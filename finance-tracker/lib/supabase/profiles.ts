import type { SupabaseClient } from "@supabase/supabase-js";

export type ProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  created_at?: string;
  updated_at?: string;
};

function isMissingTableError(error: { code?: string; message?: string }) {
  return (
    error.code === "PGRST205" ||
    error.message?.includes("Could not find the table 'public.profiles'")
  );
}

export async function getOrCreateProfile(
  supabase: SupabaseClient,
  userId: string,
  email: string | null,
) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id,email,full_name,created_at,updated_at")
    .eq("id", userId)
    .maybeSingle();

  if (error && error.code !== "PGRST116" && !isMissingTableError(error)) {
    throw error;
  }

  if (data) {
    return data as ProfileRow;
  }

  const { data: inserted, error: insertError } = await supabase
    .from("profiles")
    .upsert({
      id: userId,
      email,
      updated_at: new Date().toISOString(),
    })
    .select("id,email,full_name,created_at,updated_at")
    .single();

  if (insertError && isMissingTableError(insertError)) {
    return {
      id: userId,
      email,
      full_name: null,
    } as ProfileRow;
  }

  if (insertError) {
    throw insertError;
  }

  return inserted as ProfileRow;
}
