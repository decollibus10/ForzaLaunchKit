import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hasSupabasePublicEnv } from "@/lib/config";

function noIndexRedirect(url: URL) {
  const response = NextResponse.redirect(url);
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export async function GET(request: NextRequest) {
  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = "/dashboard";
  redirectTo.search = "";

  if (!hasSupabasePublicEnv()) {
    return noIndexRedirect(redirectTo);
  }

  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type") as EmailOtpType | null;

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash
    });

    if (!error) {
      return noIndexRedirect(redirectTo);
    }
  }

  redirectTo.pathname = "/login";
  redirectTo.searchParams.set("error", "magic-link");
  return noIndexRedirect(redirectTo);
}
