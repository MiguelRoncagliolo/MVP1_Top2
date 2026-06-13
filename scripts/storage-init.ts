import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "os10-documents";

async function main() {
  if (!url || !serviceRole) {
    throw new Error("Supabase storage env vars are missing.");
  }

  const supabase = createClient(url, serviceRole, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: existing } = await supabase.storage.listBuckets();
  if (existing?.some((item) => item.name === bucket)) {
    console.log(`Bucket '${bucket}' already exists.`);
    return;
  }

  const { error } = await supabase.storage.createBucket(bucket, {
    public: false,
    fileSizeLimit: "10MB",
    allowedMimeTypes: [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/webp",
    ],
  });

  if (error) {
    throw error;
  }

  console.log(`Bucket '${bucket}' created.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
