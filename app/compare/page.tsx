import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LeadForm } from "@/components/lead-form";
import { OfferDecoder } from "@/components/offer-decoder";
import { subscriptionOffer } from "@/lib/config";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Compare an MCA Offer | FORZA ClearMatch",
  description:
    "Review an outside MCA offer and compare advance, factor rate, payback, payments, fees, term estimate, and cash pressure.",
  path: "/compare"
});

export default function ComparePage() {
  return (
    <main>
      <section className="page-hero">
        <div className="shell narrow">
          <h1>Compare an offer you already received.</h1>
          <p>
            Decode the MCA numbers, then bring the offer into your private
            dashboard so FORZA can compare it against funding partner options.
          </p>
          <Link className="button primary" href="/login">
            {subscriptionOffer.primaryCta}
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
      <section className="section">
        <div className="shell">
          <OfferDecoder />
        </div>
      </section>
      <section className="section muted">
        <div className="shell split-section">
          <div>
            <h2>Send the competing terms.</h2>
            <p className="section-lede">
              FORZA reviews outside offers for total payback, payment pressure,
              fees, renewal/payoff rules, and whether a lower factor is hiding a
              heavier payment cadence.
            </p>
          </div>
          <div className="lead-capture">
            <LeadForm funnel="outside_offer_review" outsideOffer />
          </div>
        </div>
      </section>
    </main>
  );
}
