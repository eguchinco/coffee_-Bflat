import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { hasSupabaseSecrets } from "@/lib/env";

let serviceClient: SupabaseClient | null = null;

export function getSupabaseServiceClient() {
  if (serviceClient) {
    return serviceClient;
  }

  if (!hasSupabaseSecrets()) {
    return null;
  }

  serviceClient = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );

  return serviceClient;
}

export function hasSupabase() {
  return Boolean(getSupabaseServiceClient());
}

