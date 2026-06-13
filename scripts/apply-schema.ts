import { Client } from "pg";

const sql = `
CREATE SCHEMA IF NOT EXISTS "public";

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ReviewCaseStatus') THEN
    CREATE TYPE "ReviewCaseStatus" AS ENUM ('draft', 'processing', 'completed', 'needs_attention', 'failed');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'DocumentSourceType') THEN
    CREATE TYPE "DocumentSourceType" AS ENUM ('reference', 'submitted');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ReviewStatus') THEN
    CREATE TYPE "ReviewStatus" AS ENUM ('approvable', 'observe', 'reject', 'manual_review');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "ReviewCase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "expectedName" TEXT NOT NULL,
    "expectedRut" TEXT NOT NULL,
    "expectedDocumentType" TEXT,
    "status" "ReviewCaseStatus" NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ReviewCase_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Document" (
    "id" TEXT NOT NULL,
    "reviewCaseId" TEXT NOT NULL,
    "sourceType" "DocumentSourceType" NOT NULL,
    "storagePath" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ExtractedDocumentData" (
    "id" TEXT NOT NULL,
    "reviewCaseId" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "sourceType" "DocumentSourceType" NOT NULL,
    "rawText" TEXT NOT NULL,
    "extractedName" TEXT,
    "extractedRut" TEXT,
    "extractedDates" JSONB NOT NULL,
    "extractedDocumentType" TEXT,
    "textBlocks" JSONB NOT NULL,
    "ocrConfidence" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ExtractedDocumentData_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "DocumentComparison" (
    "id" TEXT NOT NULL,
    "reviewCaseId" TEXT NOT NULL,
    "identityMatch" BOOLEAN NOT NULL,
    "rutMatch" BOOLEAN NOT NULL,
    "referenceLayoutMatch" BOOLEAN NOT NULL,
    "detectedAnomaliesJson" JSONB NOT NULL,
    "confidenceScore" DOUBLE PRECISION NOT NULL,
    "summary" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DocumentComparison_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ReviewResult" (
    "id" TEXT NOT NULL,
    "reviewCaseId" TEXT NOT NULL,
    "reviewStatus" "ReviewStatus" NOT NULL,
    "recommendation" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ReviewResult_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "ReviewCase_userId_createdAt_idx" ON "ReviewCase"("userId", "createdAt");
CREATE INDEX IF NOT EXISTS "Document_reviewCaseId_sourceType_idx" ON "Document"("reviewCaseId", "sourceType");
CREATE UNIQUE INDEX IF NOT EXISTS "ExtractedDocumentData_documentId_key" ON "ExtractedDocumentData"("documentId");
CREATE INDEX IF NOT EXISTS "ExtractedDocumentData_reviewCaseId_sourceType_idx" ON "ExtractedDocumentData"("reviewCaseId", "sourceType");
CREATE UNIQUE INDEX IF NOT EXISTS "DocumentComparison_reviewCaseId_key" ON "DocumentComparison"("reviewCaseId");
CREATE UNIQUE INDEX IF NOT EXISTS "ReviewResult_reviewCaseId_key" ON "ReviewResult"("reviewCaseId");
CREATE INDEX IF NOT EXISTS "AuditLog_userId_createdAt_idx" ON "AuditLog"("userId", "createdAt");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'Document_reviewCaseId_fkey'
  ) THEN
    ALTER TABLE "Document"
      ADD CONSTRAINT "Document_reviewCaseId_fkey"
      FOREIGN KEY ("reviewCaseId") REFERENCES "ReviewCase"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'ExtractedDocumentData_reviewCaseId_fkey'
  ) THEN
    ALTER TABLE "ExtractedDocumentData"
      ADD CONSTRAINT "ExtractedDocumentData_reviewCaseId_fkey"
      FOREIGN KEY ("reviewCaseId") REFERENCES "ReviewCase"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'ExtractedDocumentData_documentId_fkey'
  ) THEN
    ALTER TABLE "ExtractedDocumentData"
      ADD CONSTRAINT "ExtractedDocumentData_documentId_fkey"
      FOREIGN KEY ("documentId") REFERENCES "Document"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'DocumentComparison_reviewCaseId_fkey'
  ) THEN
    ALTER TABLE "DocumentComparison"
      ADD CONSTRAINT "DocumentComparison_reviewCaseId_fkey"
      FOREIGN KEY ("reviewCaseId") REFERENCES "ReviewCase"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'ReviewResult_reviewCaseId_fkey'
  ) THEN
    ALTER TABLE "ReviewResult"
      ADD CONSTRAINT "ReviewResult_reviewCaseId_fkey"
      FOREIGN KEY ("reviewCaseId") REFERENCES "ReviewCase"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
`;

async function main() {
  if (!process.env.DIRECT_URL) {
    throw new Error("DIRECT_URL is required.");
  }

  const client = new Client({
    connectionString: process.env.DIRECT_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  await client.connect();
  try {
    await client.query(sql);
    console.log("Schema applied successfully.");
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
