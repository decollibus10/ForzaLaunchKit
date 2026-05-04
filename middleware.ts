import type { NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/proxy";

// OpenNext Cloudflare rejects Next 16 node proxy output; keep Edge middleware until support lands.
export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"
  ]
};
