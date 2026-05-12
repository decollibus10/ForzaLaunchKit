import { subscriptionOffer } from "@/lib/config";

export const funnelPages = {
  "offer-dashboard-nj": {
    title: "Create a private MCA offer dashboard before you shop funding.",
    description:
      "FORZA ClearMatch gives New Jersey merchants one place to organize documents, compare partner offers, and see the real MCA math before deciding.",
    formTitle: "Start the dashboard",
    funnel: "paid_offer_dashboard_nj",
    intent: "dashboard_account",
    cta: subscriptionOffer.primaryCta,
    iconKey: "lockKeyhole",
    bullets: [
      "Private dashboard for MCA offers, documents, and next steps.",
      "Transparent factor rate, payback, payment, fee, and cash-pressure math.",
      "$500/month membership with a 1% broker-fee cap if funded through FORZA."
    ]
  },
  "compare-mca-offers-nj": {
    title: "Compare MCA offers side by side before you sign.",
    description:
      "Bring FORZA the offer you received and see how the advance, payback, payment cadence, fees, and renewal rules actually compare.",
    formTitle: "Compare an outside offer",
    funnel: "paid_compare_mca_offers_nj",
    intent: "outside_offer_review",
    cta: subscriptionOffer.secondaryCta,
    iconKey: "barChart3",
    outsideOffer: true,
    bullets: [
      "Normalize offers that use different payment schedules or fee language.",
      "Review outside broker terms against FORZA-shopped partner options.",
      "Keep funder names internal while merchant-facing deal numbers stay visible."
    ]
  },
  "mca-second-opinion-nj": {
    title: "Get a second opinion on an MCA offer.",
    description:
      "Use FORZA ClearMatch as your comparison desk when another broker sends terms that are hard to read or hard to compare.",
    formTitle: "Send the terms for review",
    funnel: "paid_mca_second_opinion_nj",
    intent: "second_opinion",
    cta: subscriptionOffer.secondaryCta,
    iconKey: "fileSearch",
    outsideOffer: true,
    bullets: [
      "Review factor rate, total payback, payment amount, fees, and term estimate.",
      "Flag cash-pressure risk before a daily or weekly payment hits operations.",
      "Package the file cleanly if FORZA shops better-fit partner options."
    ]
  },
  "factor-rate-calculator-nj": {
    title: "Calculate MCA payback and payment pressure.",
    description:
      "Estimate total payback, term, and weekly cash pressure, then save the snapshot into a FORZA dashboard lead for offer comparison.",
    formTitle: "Save the estimate",
    funnel: "paid_factor_rate_calculator_nj",
    intent: "calculator_lead",
    cta: subscriptionOffer.primaryCta,
    iconKey: "gauge",
    calculator: true,
    bullets: [
      "Estimate total payback from advance and factor rate.",
      "Compare weekly payment against monthly revenue.",
      "Move from estimate to dashboard when you are ready to compare real terms."
    ]
  }
} as const;

export type FunnelSlug = keyof typeof funnelPages;

export const funnelSlugs = Object.keys(funnelPages) as FunnelSlug[];
