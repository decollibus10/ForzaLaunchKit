import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { hasSupabasePublicEnv, subscriptionOffer } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import type { CalculatorSnapshot, ConversionEventName } from "@/lib/types";

export const runtime = "nodejs";

type ConversionPayload = {
  eventName?: ConversionEventName;
  eventId?: string;
  leadId?: string;
  email?: string;
  phone?: string;
  funnel?: string;
  sourcePage?: string;
  landingUrl?: string;
  fbp?: string;
  fbc?: string;
  gclid?: string;
  fbclid?: string;
  calculatorSnapshot?: CalculatorSnapshot;
};

const allowedEvents = new Set<ConversionEventName>([
  "lead_submitted",
  "dashboard_started",
  "calculator_lead"
]);

const metaEventNames: Record<ConversionEventName, string> = {
  lead_submitted: "Lead",
  dashboard_started: "CompleteRegistration",
  calculator_lead: "Lead"
};

function clean(value: unknown) {
  return String(value || "").trim();
}

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function normalizedHash(value: unknown) {
  const normalized = clean(value).toLowerCase();
  return normalized ? sha256(normalized) : undefined;
}

function phoneHash(value: unknown) {
  const normalized = clean(value).replace(/\D/g, "");
  return normalized ? sha256(normalized) : undefined;
}

async function writeConversion(
  payload: ConversionPayload,
  platform: string,
  status: "sent" | "skipped" | "error",
  response: unknown
) {
  if (!hasSupabasePublicEnv()) {
    return;
  }

  const supabase = await createClient();
  await supabase.from("ad_conversions").insert({
    lead_id: payload.leadId || null,
    event_name: payload.eventName,
    event_id: payload.eventId,
    platform,
    status,
    source_page: clean(payload.sourcePage),
    landing_url: clean(payload.landingUrl),
    gclid: clean(payload.gclid),
    fbclid: clean(payload.fbclid),
    response
  });
}

export async function POST(request: Request) {
  const payload = (await request.json()) as ConversionPayload;

  if (!payload.eventName || !allowedEvents.has(payload.eventName)) {
    return NextResponse.json({ error: "Unsupported conversion event." }, { status: 400 });
  }

  if (!payload.eventId) {
    return NextResponse.json({ error: "Conversion event id is required." }, { status: 400 });
  }

  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    await writeConversion(payload, "meta", "skipped", {
      reason: "Missing NEXT_PUBLIC_META_PIXEL_ID or META_CAPI_ACCESS_TOKEN."
    });
    return NextResponse.json({ sent: false, skipped: true });
  }

  const userAgent = request.headers.get("user-agent") || undefined;
  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const apiVersion = process.env.META_CAPI_GRAPH_API_VERSION || "v24.0";
  const endpoint = `https://graph.facebook.com/${apiVersion}/${pixelId}/events`;
  const metaPayload = {
    data: [
      {
        event_name: metaEventNames[payload.eventName],
        event_time: Math.floor(Date.now() / 1000),
        event_id: payload.eventId,
        action_source: "website",
        event_source_url: payload.landingUrl || payload.sourcePage,
        user_data: {
          em: normalizedHash(payload.email),
          ph: phoneHash(payload.phone),
          client_ip_address: clientIp,
          client_user_agent: userAgent,
          fbp: clean(payload.fbp) || undefined,
          fbc: clean(payload.fbc) || undefined
        },
        custom_data: {
          content_name: subscriptionOffer.name,
          funnel: payload.funnel,
          lead_id: payload.leadId,
          value: subscriptionOffer.monthlyPrice,
          currency: "USD",
          calculator_snapshot: payload.calculatorSnapshot
        }
      }
    ],
    test_event_code: process.env.META_CAPI_TEST_EVENT_CODE || undefined
  };

  const response = await fetch(`${endpoint}?access_token=${accessToken}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(metaPayload)
  });
  const responseBody = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  const status = response.ok ? "sent" : "error";

  await writeConversion(payload, "meta", status, responseBody);

  return NextResponse.json({
    sent: response.ok,
    skipped: false,
    platform: "meta",
    response: responseBody
  });
}
