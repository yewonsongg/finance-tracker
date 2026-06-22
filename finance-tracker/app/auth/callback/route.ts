import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  let response = NextResponse.redirect(new URL("/dashboard", request.url));

  let supabase;

  try {
    supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          response.cookies.set({ name, value: "", ...options, maxAge: 0 });
        },
      },
    });
  } catch {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  if (code) {
    const { data } = await supabase.auth.exchangeCodeForSession(code);
    const user = data.user;

    if (user) {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        email: user.email,
        updated_at: new Date().toISOString(),
      });

      if (error && error.code !== "PGRST205") {
        throw error;
      }
    }
  }

  return response;
}
