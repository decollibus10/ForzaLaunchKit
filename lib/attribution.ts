"use client";

import type { AttributionTouch } from "@/lib/types";

const FIRST_TOUCH_KEY = "forza:first-touch:v1";
const LAST_TOUCH_KEY = "forza:last-touch:v1";

function readCookie(name: string) {
  if (typeof document === "undefined") {
    return undefined;
  }

  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
}

function getStoredTouch(key: string) {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as AttributionTouch) : null;
  } catch {
    return null;
  }
}

function storeTouch(key: string, value: AttributionTouch) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Attribution is useful, not worth blocking the form when storage is unavailable.
  }
}

function fbcFromClickId(fbclid?: string) {
  if (!fbclid) {
    return undefined;
  }

  return `fb.1.${Date.now()}.${fbclid}`;
}

export function makeConversionEventId(prefix = "forza") {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function captureAttribution(funnelIntent?: string) {
  if (typeof window === "undefined") {
    return null;
  }

  const params = new URLSearchParams(window.location.search);
  const fbclid = params.get("fbclid") || undefined;
  const currentTouch: AttributionTouch = {
    capturedAt: new Date().toISOString(),
    landingUrl: window.location.href,
    landingPath: window.location.pathname,
    sourcePage: window.location.pathname,
    referrer: document.referrer || undefined,
    utmSource: params.get("utm_source") || undefined,
    utmMedium: params.get("utm_medium") || undefined,
    utmCampaign: params.get("utm_campaign") || undefined,
    utmContent: params.get("utm_content") || undefined,
    utmTerm: params.get("utm_term") || undefined,
    gclid: params.get("gclid") || undefined,
    fbclid,
    fbp: readCookie("_fbp"),
    fbc: readCookie("_fbc") || fbcFromClickId(fbclid),
    funnelIntent
  };

  const firstTouch = getStoredTouch(FIRST_TOUCH_KEY) || currentTouch;
  storeTouch(FIRST_TOUCH_KEY, firstTouch);
  storeTouch(LAST_TOUCH_KEY, currentTouch);

  return {
    ...currentTouch,
    firstTouch,
    lastTouch: currentTouch
  };
}
