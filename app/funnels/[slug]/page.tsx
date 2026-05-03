import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BarChart3, FileSearch, Gauge, LockKeyhole } from "lucide-react";
import { FactorCalculator } from "@/components/factor-calculator";
import { LeadForm } from "@/components/lead-form";
import { site, subscriptionOffer } from "@/lib/config";

const funnelPages = {
  "offer-dashboard-nj": {
    title: "Create a private MCA offer dashboard before you shop funding.",
    description:
      "FORZA ClearMatch gives New Jersey merchants one place to organize documents, compare partner offers, and see the real MCA math before deciding.",
    formTitle: "Start the dashboard",
    funnel: "paid_offer_dashboard_nj",
    intent: "dashboard_account",
    cta: subscriptionOffer.primaryCta,
    icon: LockKeyhole,
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
    icon: BarChart3,
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
    icon: FileSearch,
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
    icon: Gauge,
    calculator: true,
    bullets: [
      "Estimate total payback from advance and factor rate.",
      "Compare weekly payment against monthly revenue.",
      "Move from estimate to dashboard when you are ready to compare real terms."
    ]
  }
} as const;

type FunnelSlug = keyof typeof funnelPages;

type FunnelPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(funnelPages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: FunnelPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = funnelPages[slug as FunnelSlug];

  if (!page) {
    return {};
  }

  return {
    title: `${page.title} | FORZA ClearMatch`,
    description: page.description
  };
}

export default async function PaidFunnelPage({ params }: FunnelPageProps) {
  const { slug } = await params;
  const page = funnelPages[slug as FunnelSlug];

  if (!page) {
    notFound();
  }

  const Icon = page.icon;

  return (
    <main>
      <section className="paid-hero">
        <div className="shell paid-hero-grid">
          <div className="paid-copy">
            <h1>{page.title}</h1>
            <p>{page.description}</p>
            <div className="hero-actions">
              <a className="button primary" href="#start">
                {page.cta}
                <ArrowRight size={16} />
              </a>
              <Link className="button secondary" href="/calculator">
                Use calculator
              </Link>
            </div>
          </div>
          <div className="paid-panel">
            <Icon size={24} />
            <h2>{subscriptionOffer.promise}</h2>
            <ul className="check-list">
              {page.bullets.map((bullet) => (
                <li key={bullet}>
                  <ArrowRight size={16} />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <div className="paid-price">
              <strong>$500/month</strong>
              <span>1% broker-fee cap if funded through FORZA</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="start">
        <div className="shell split-section">
          <div>
            <h2>{page.formTitle}</h2>
            <p className="section-lede">
              Start with business basics only. After submission, the next step
              is a secure email link into your private offer dashboard.
            </p>
            <div className="funnel-proof">
              <article>
                <strong>Broker role</strong>
                <span>FORZA shops offers through funding partners.</span>
              </article>
              <article>
                <strong>Transparent math</strong>
                <span>Advance, payback, payment, fees, and pressure are visible.</span>
              </article>
              <article>
                <strong>Private next step</strong>
                <span>Use an email magic link to continue into the dashboard.</span>
              </article>
            </div>
          </div>
          {"calculator" in page && page.calculator ? (
            <FactorCalculator />
          ) : (
            <div className="lead-capture">
              <LeadForm
                funnel={page.funnel}
                funnelIntent={page.intent}
                outsideOffer={"outsideOffer" in page && page.outsideOffer}
              />
            </div>
          )}
        </div>
      </section>

      <section className="section muted">
        <div className="shell paid-disclosure">
          <h2>Commercial financing disclosure</h2>
          <p>{subscriptionOffer.disclosure}</p>
          <p>
            FORZA serves New Jersey business-purpose commercial financing
            inquiries in v1. Funding partner underwriting controls final
            approvals, terms, cost, and repayment structure.
          </p>
          <p>
            Fees shown on this page: $500/month ClearMatch membership; if funded
            through FORZA, FORZA may receive or retain a broker fee capped at 1%
            of funded amount. Business address: {site.address}.
          </p>
        </div>
      </section>
    </main>
  );
}
