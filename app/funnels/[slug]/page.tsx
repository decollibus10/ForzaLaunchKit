import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BarChart3, FileSearch, Gauge, LockKeyhole } from "lucide-react";
import { FactorCalculator } from "@/components/factor-calculator";
import { LeadForm } from "@/components/lead-form";
import { funnelPages, type FunnelSlug } from "@/lib/funnel-pages";
import { site, subscriptionOffer } from "@/lib/config";
import { pageMetadata } from "@/lib/seo";

const funnelIcons = {
  barChart3: BarChart3,
  fileSearch: FileSearch,
  gauge: Gauge,
  lockKeyhole: LockKeyhole
} as const;

type FunnelPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: FunnelPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = funnelPages[slug as FunnelSlug];

  if (!page) {
    return {};
  }

  return pageMetadata({
    title: page.title,
    description: page.description,
    path: `/funnels/${slug}`
  });
}

export default async function PaidFunnelPage({ params }: FunnelPageProps) {
  const { slug } = await params;
  const page = funnelPages[slug as FunnelSlug];

  if (!page) {
    notFound();
  }

  const Icon = funnelIcons[page.iconKey];

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
