import Link from "next/link";
import { ArrowRight, FileSearch, Gauge, Layers3, LockKeyhole } from "lucide-react";
import { DashboardPreview } from "@/components/dashboard-preview";
import { LeadForm } from "@/components/lead-form";
import { SubscriptionPanel } from "@/components/subscription-panel";
import { subscriptionOffer } from "@/lib/config";

const workflow = [
  {
    title: "Create the dashboard",
    body: "Merchant basics, request size, active positions, and ad attribution are captured in one record.",
    icon: LockKeyhole
  },
  {
    title: "Package the file",
    body: "FORZA organizes statements, contracts, payoff notes, and use-of-funds context before funder submission.",
    icon: Layers3
  },
  {
    title: "Compare the math",
    body: "Every option is normalized by advance, total payback, payment, fee load, term estimate, and cash pressure.",
    icon: Gauge
  },
  {
    title: "Review outside offers",
    body: "Merchants can keep FORZA as the comparison desk when another broker sends a competing offer.",
    icon: FileSearch
  }
];

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <h1>Compare MCA offers before you sign.</h1>
            <p>
              {subscriptionOffer.name} gives New Jersey merchants a private
              funding desk for deal shopping, offer review, file packaging, and
              transparent MCA math.
            </p>
            <div className="hero-actions">
              <Link className="button primary" href="/login">
                {subscriptionOffer.primaryCta}
                <ArrowRight size={16} />
              </Link>
              <Link className="button secondary" href="/compare">
                {subscriptionOffer.secondaryCta}
              </Link>
            </div>
          </div>
          <DashboardPreview />
        </div>
      </section>

      <SubscriptionPanel />

      <section className="section">
        <div className="shell split-section">
          <div>
            <h2>One dashboard for funding options, costs, documents, and next steps.</h2>
            <p className="section-lede">
              The business model is simple: subscription-funded transparency plus
              a capped success fee, instead of oversized broker commission.
            </p>
            <div className="workflow-list">
              {workflow.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="workflow-item">
                    <Icon size={20} />
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.body}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
          <div className="lead-capture">
            <h2>Create your offer dashboard</h2>
            <p>
              Start with business basics only. Sensitive documents are requested
              after login and consent.
            </p>
            <LeadForm funnel="homepage_dashboard" />
          </div>
        </div>
      </section>

      <section className="section muted">
        <div className="shell proof-grid">
          <article>
            <h2>What stays visible</h2>
            <p>
              Factor rate, total payback, payment cadence, fees, estimated term,
              broker-fee disclosure, renewal notes, and cash-pressure scoring.
            </p>
          </article>
          <article>
            <h2>What stays controlled</h2>
            <p>
              Funder identity, submission routing, underwriting notes, internal
              compensation, and unpublished draft offers stay in the admin side.
            </p>
          </article>
          <article>
            <h2>What ads promote</h2>
            <p>
              Dashboard transparency, MCA second opinions, and comparison tools.
              No approval promises, speed promises, exploitative targeting, or
              consumer-loan framing.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
