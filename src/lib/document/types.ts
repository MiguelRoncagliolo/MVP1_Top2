export type DocumentSourceType = "reference" | "submitted";

export type ExtractedDocumentData = {
  rawText: string;
  extractedName: string | null;
  extractedRut: string | null;
  extractedDates: string[];
  extractedDocumentType: string | null;
  textBlocks: string[];
  ocrConfidence: number;
};

export type ComparisonResult = {
  identityMatch: boolean;
  rutMatch: boolean;
  referenceLayoutMatch: boolean;
  extractedName: string | null;
  extractedRut: string | null;
  detectedAnomalies: string[];
  reviewStatus: "approvable" | "observe" | "reject" | "manual_review";
  confidenceScore: number;
  summary: string;
  recommendation: string;
};
