"use client";

import { FormEvent, useState } from "react";
import { ArrowRight } from "lucide-react";
import { captureAttribution, makeConversionEventId } from "@/lib/attribution";
import { trackBrowserConversion } from "@/lib/analytics";
import { subscriptionOffer } from "@/lib/config";
import type { CalculatorSnapshot, LeadPayload } from "@/lib/types";

type LeadFormProps = {
  funnel: string;
  funnelIntent?: string;
  compact?: boolean;
  outsideOffer?: boolean;
  calculatorSnapshot?: CalculatorSnapshot;
};

export function LeadForm({
  funnel,
  funnelIntent,
  compact = false,
  outsideOffer = false,
  calculatorSnapshot
}: LeadFormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setStatus("submitting");
    setMessage("");

    const form = new FormData(formElement);
    const activeAttribution = captureAttribution(funnelIntent || funnel) || undefined;
    const conversionEventId = makeConversionEventId("lead");
    const payload: LeadPayload = {
      fullName: String(form.get("fullName") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      businessName: String(form.get("businessName") || ""),
      monthlyRevenue: String(form.get("monthlyRevenue") || ""),
      requestedAmount: String(form.get("requestedAmount") || ""),
      existingAdvance: String(form.get("existingAdvance") || ""),
      existingOfferSummary: String(form.get("existingOfferSummary") || ""),
      funnel,
      sourcePage: activeAttribution?.sourcePage || "/",
      utmSource: activeAttribution?.utmSource,
      utmMedium: activeAttribution?.utmMedium,
      utmCampaign: activeAttribution?.utmCampaign,
      utmContent: activeAttribution?.utmContent,
      utmTerm: activeAttribution?.utmTerm,
      gclid: activeAttribution?.gclid,
      fbclid: activeAttribution?.fbclid,
      fbp: activeAttribution?.fbp,
      fbc: activeAttribution?.fbc,
      referrer: activeAttribution?.referrer,
      landingUrl: activeAttribution?.landingUrl,
      landingPath: activeAttribution?.landingPath,
      firstTouch: activeAttribution?.firstTouch,
      lastTouch: activeAttribution?.lastTouch,
      funnelIntent: funnelIntent || funnel,
      contactConsent: form.get("contactConsent") === "on",
      marketingConsent: form.get("marketingConsent") === "on",
      conversionEventId,
      calculatorSnapshot
    };

    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      setStatus("error");
      setMessage("The lead could not be saved. Check the required fields and try again.");
      return;
    }

    const result = (await response.json()) as {
      id: string;
      mode?: string;
      nextUrl?: string;
    };
    const conversionName = calculatorSnapshot ? "calculator_lead" : "lead_submitted";

    trackBrowserConversion(conversionName, {
      eventId: conversionEventId,
      leadId: result.id,
      funnel,
      sourcePage: payload.sourcePage
    });

    await fetch("/api/conversions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName: conversionName,
        eventId: conversionEventId,
        leadId: result.id,
        email: payload.email,
        phone: payload.phone,
        funnel,
        sourcePage: payload.sourcePage,
        landingUrl: payload.landingUrl,
        fbp: payload.fbp,
        fbc: payload.fbc,
        gclid: payload.gclid,
        fbclid: payload.fbclid,
        calculatorSnapshot
      })
    }).catch(() => undefined);

    setStatus("success");
    setMessage(
      result.mode === "demo"
        ? "Demo mode: attribution and dashboard handoff are ready. Add Supabase env vars to save live leads."
        : "Saved. Opening the dashboard-start step next."
    );
    formElement.reset();

    if (result.nextUrl) {
      window.location.assign(result.nextUrl);
    }
  }

  return (
    <form className={compact ? "lead-form compact" : "lead-form"} onSubmit={handleSubmit}>
      <label>
        <span>Name</span>
        <input name="fullName" autoComplete="name" required />
      </label>
      <label>
        <span>Email</span>
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label>
        <span>Phone</span>
        <input name="phone" type="tel" autoComplete="tel" required />
      </label>
      <label>
        <span>Business</span>
        <input name="businessName" autoComplete="organization" required />
      </label>
      <label>
        <span>Monthly revenue</span>
        <select name="monthlyRevenue" required defaultValue="">
          <option value="" disabled>
            Select range
          </option>
          <option value="15000-30000">$15k-$30k</option>
          <option value="30000-75000">$30k-$75k</option>
          <option value="75000-150000">$75k-$150k</option>
          <option value="150000+">$150k+</option>
        </select>
      </label>
      <label>
        <span>Funding target</span>
        <select name="requestedAmount" required defaultValue="">
          <option value="" disabled>
            Select amount
          </option>
          <option value="5000-15000">$5k-$15k</option>
          <option value="15000-30000">$15k-$30k</option>
          <option value="30000-75000">$30k-$75k</option>
          <option value="75000+">$75k+</option>
        </select>
      </label>
      <label>
        <span>Existing MCA</span>
        <select name="existingAdvance" required defaultValue="">
          <option value="" disabled>
            Select status
          </option>
          <option value="none">No active advance</option>
          <option value="one">One active position</option>
          <option value="multiple">Multiple active positions</option>
          <option value="unsure">Not sure</option>
        </select>
      </label>
      {outsideOffer ? (
        <label className="full-field">
          <span>Outside offer summary</span>
          <textarea
            name="existingOfferSummary"
            rows={4}
            placeholder="Advance, factor rate, payment, fees, and any payoff or renewal notes."
          />
        </label>
      ) : null}
      <label className="checkbox-field full-field">
        <input name="contactConsent" type="checkbox" required />
        <span>
          I agree FORZA may contact me about my business funding dashboard and offer
          review.
        </span>
      </label>
      <label className="checkbox-field full-field">
        <input name="marketingConsent" type="checkbox" />
        <span>I agree to receive ClearMatch updates and can opt out later.</span>
      </label>
      <button className="button primary full" disabled={status === "submitting"} type="submit">
        {status === "submitting" ? "Saving..." : subscriptionOffer.primaryCta}
        <ArrowRight size={16} />
      </button>
      {message ? <p className={`form-status ${status}`}>{message}</p> : null}
    </form>
  );
}
