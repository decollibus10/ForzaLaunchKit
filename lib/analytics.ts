"use client";

import { analyticsConfig, subscriptionOffer } from "@/lib/config";
import type { ConversionEventName } from "@/lib/types";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const metaEventNames: Record<ConversionEventName, string> = {
  lead_submitted: "Lead",
  dashboard_started: "CompleteRegistration",
  calculator_lead: "Lead"
};

const googleLabels: Record<ConversionEventName, string | undefined> = {
  lead_submitted: analyticsConfig.googleLeadConversionLabel,
  dashboard_started: analyticsConfig.googleDashboardStartConversionLabel,
  calculator_lead: analyticsConfig.googleCalculatorLeadConversionLabel
};

type BrowserConversionOptions = {
  eventId: string;
  leadId?: string;
  funnel?: string;
  sourcePage?: string;
  value?: number;
};

export function trackBrowserConversion(
  eventName: ConversionEventName,
  options: BrowserConversionOptions
) {
  if (typeof window === "undefined") {
    return;
  }

  const payload = {
    event: eventName,
    event_id: options.eventId,
    lead_id: options.leadId,
    funnel: options.funnel,
    source_page: options.sourcePage,
    value: options.value ?? subscriptionOffer.monthlyPrice,
    currency: "USD"
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);

  if (window.gtag) {
    window.gtag("event", eventName, {
      event_id: options.eventId,
      lead_id: options.leadId,
      funnel: options.funnel,
      value: payload.value,
      currency: payload.currency
    });

    const conversionLabel = googleLabels[eventName];
    if (analyticsConfig.googleAdsId && conversionLabel) {
      window.gtag("event", "conversion", {
        send_to: `${analyticsConfig.googleAdsId}/${conversionLabel}`,
        event_id: options.eventId,
        value: payload.value,
        currency: payload.currency
      });
    }
  }

  if (window.fbq && analyticsConfig.metaPixelId) {
    window.fbq(
      "track",
      metaEventNames[eventName],
      {
        content_name: subscriptionOffer.name,
        value: payload.value,
        currency: payload.currency
      },
      { eventID: options.eventId }
    );
  }
}
