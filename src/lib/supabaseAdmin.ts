import { createClient } from "@supabase/supabase-js";

function env(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

/**
 * Resolve the server-side Supabase API key. Prefers the modern secret key
 * (`sb_secret_*`) and falls back to the legacy `service_role` JWT so the app
 * keeps working during the migration. Returns null if neither is set.
 */
export function supabaseSecretKey(): string | null {
  return (
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    null
  );
}

export function supabaseAdmin() {
  const key = supabaseSecretKey();
  if (!key) throw new Error("Missing env var: SUPABASE_SECRET_KEY");
  return createClient(env("SUPABASE_URL"), key, {
    auth: { persistSession: false },
  });
}
