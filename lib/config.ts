export const site = {
  name: "FORZA CAPITAL PARTNERS LLC",
  shortName: "FORZA",
  productName: "FORZA ClearMatch",
  market: "New Jersey",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://forza-funding.com",
  supportEmail: "intake@forzacapitalpartners.com",
  address: "Marlboro, New Jersey"
};

export const subscriptionOffer = {
  name: "FORZA ClearMatch",
  monthlyPrice: 500,
  brokerFeeCapPercent: 0.01,
  primaryCta: "Create Your Offer Dashboard",
  secondaryCta: "Compare An Offer You Already Received",
  promise:
    "One monthly funding desk. Transparent MCA offers. No oversized broker commission.",
  disclosure:
    "FORZA is a commercial financing broker. The $500/month membership covers dashboard access, offer review, file packaging, and funding support. If a merchant funds through FORZA, FORZA may receive or retain a 1% broker fee. Funding approval, terms, and costs are determined by funding partners and underwriting. No funding is guaranteed."
};

export const paidTestPlan = {
  durationDays: 14,
  dailyBudget: 100,
  googleBudgetShare: 0.65,
  metaBudgetShare: 0.35
};

export const analyticsConfig = {
  gtmId: process.env.NEXT_PUBLIC_GTM_ID,
  ga4MeasurementId: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID,
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID,
  googleAdsId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID,
  googleLeadConversionLabel: process.env.NEXT_PUBLIC_GOOGLE_LEAD_CONVERSION_LABEL,
  googleDashboardStartConversionLabel:
    process.env.NEXT_PUBLIC_GOOGLE_DASHBOARD_START_CONVERSION_LABEL,
  googleCalculatorLeadConversionLabel:
    process.env.NEXT_PUBLIC_GOOGLE_CALCULATOR_LEAD_CONVERSION_LABEL
};

export const complianceLinks = [
  {
    label: "Meta financial products category",
    href: "https://archive.ph/2025.12.08-100221/https%3A/www.facebook.com/business/help/510724041294968"
  },
  {
    label: "Meta prohibited financial products",
    href: "https://www.facebook.com/policies/ads/prohibited_content/prohibited_financial_products_and_services"
  },
  {
    label: "Google financial products policy",
    href: "https://support.google.com/adspolicy/answer/2464998?hl=en"
  },
  {
    label: "NJ S1760",
    href: "https://pub.njleg.gov/Bills/2026/S2000/1760_I1.HTM"
  },
  {
    label: "FTC MCA enforcement",
    href: "https://www.ftc.gov/news-events/news/press-releases/2023/10/ftc-case-leads-permanent-ban-against-merchant-cash-advance-owner-deceiving-small-businesses-seizing"
  }
];

export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
};

export function hasSupabasePublicEnv() {
  return Boolean(supabaseConfig.url && supabaseConfig.publishableKey);
}

export function getSupabasePublicEnv() {
  if (!hasSupabasePublicEnv()) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
    );
  }

  return {
    url: supabaseConfig.url as string,
    publishableKey: supabaseConfig.publishableKey as string
  };
}
