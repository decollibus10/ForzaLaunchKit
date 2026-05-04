import { NextResponse } from "next/server";
import { hasSupabasePublicEnv } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import type { LeadPayload } from "@/lib/types";

function clean(value: unknown) {
  return String(value || "").trim();
}

function jsonRecord(value: unknown) {
  return value && typeof value === "object" ? value : {};
}

function buildNextUrl(request: Request, email: string, leadId: string, funnel: string) {
  const url = new URL("/login", request.url);
  url.searchParams.set("email", email);
  url.searchParams.set("leadId", leadId);
  url.searchParams.set("intent", funnel);
  return `${url.pathname}${url.search}`;
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<LeadPayload>;
  const email = clean(body.email).toLowerCase();
  const businessName = clean(body.businessName);

  if (!email || !businessName) {
    return NextResponse.json(
      { error: "Email and business name are required." },
      { status: 400 }
    );
  }

  if (!body.contactConsent) {
    return NextResponse.json(
      { error: "Contact consent is required to create a dashboard lead." },
      { status: 400 }
    );
  }

  const leadId = crypto.randomUUID();
  const payload = {
    id: leadId,
    full_name: clean(body.fullName),
    email,
    phone: clean(body.phone),
    business_name: businessName,
    monthly_revenue_range: clean(body.monthlyRevenue),
    requested_amount_range: clean(body.requestedAmount),
    existing_advance: clean(body.existingAdvance),
    existing_offer_summary: clean(body.existingOfferSummary),
    funnel: clean(body.funnel) || "unknown",
    source_page: clean(body.sourcePage) || "/",
    utm_source: clean(body.utmSource),
    utm_medium: clean(body.utmMedium),
    utm_campaign: clean(body.utmCampaign),
    utm_content: clean(body.utmContent),
    utm_term: clean(body.utmTerm),
    gclid: clean(body.gclid),
    fbclid: clean(body.fbclid),
    fbp: clean(body.fbp),
    fbc: clean(body.fbc),
    referrer: clean(body.referrer),
    landing_url: clean(body.landingUrl),
    landing_path: clean(body.landingPath),
    first_touch: jsonRecord(body.firstTouch),
    last_touch: jsonRecord(body.lastTouch),
    funnel_intent: clean(body.funnelIntent) || clean(body.funnel) || "unknown",
    contact_consent: Boolean(body.contactConsent),
    marketing_consent: Boolean(body.marketingConsent),
    conversion_event_id: clean(body.conversionEventId),
    calculator_snapshot: jsonRecord(body.calculatorSnapshot),
    lead_status: "new",
    membership_interest: "clearmatch"
  };

  if (!hasSupabasePublicEnv()) {
    const id = "demo";
    return NextResponse.json(
      { id, mode: "demo", nextUrl: buildNextUrl(request, email, id, payload.funnel) },
      { status: 202 }
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.from("leads").insert(payload);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase.from("ad_attribution").insert({
    lead_id: leadId,
    source_page: payload.source_page,
    utm_source: payload.utm_source,
    utm_medium: payload.utm_medium,
    utm_campaign: payload.utm_campaign,
    utm_content: payload.utm_content,
    utm_term: payload.utm_term,
    gclid: payload.gclid,
    fbclid: payload.fbclid,
    fbp: payload.fbp,
    fbc: payload.fbc,
    referrer: payload.referrer,
    landing_url: payload.landing_url,
    landing_path: payload.landing_path,
    first_touch: payload.first_touch,
    last_touch: payload.last_touch,
    funnel_intent: payload.funnel_intent,
    conversion_event_id: payload.conversion_event_id,
    contact_consent: payload.contact_consent,
    marketing_consent: payload.marketing_consent
  });

  return NextResponse.json({
    id: leadId,
    nextUrl: buildNextUrl(request, email, leadId, payload.funnel)
  });
}
