import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().optional(),
  DIRECT_URL: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SECRET_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_STORAGE_BUCKET: z.string().default("os10-documents"),
});

const parsedEnv = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_STORAGE_BUCKET: process.env.SUPABASE_STORAGE_BUCKET,
});

export const env = {
  ...parsedEnv,
  NEXT_PUBLIC_SUPABASE_PUBLIC_KEY:
    parsedEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    parsedEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVER_KEY:
    parsedEnv.SUPABASE_SECRET_KEY ?? parsedEnv.SUPABASE_SERVICE_ROLE_KEY,
};

export function isSupabaseConfigured() {
  return Boolean(
    env.NEXT_PUBLIC_SUPABASE_URL &&
      env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY &&
      env.SUPABASE_SERVER_KEY,
  );
}

export function isDatabaseConfigured() {
  return Boolean(env.DATABASE_URL);
}
