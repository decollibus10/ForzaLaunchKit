import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FactorCalculator } from "@/components/factor-calculator";
import { subscriptionOffer } from "@/lib/config";

export const metadata = {
  title: "MCA Factor Rate Calculator | FORZA ClearMatch",
  description:
    "Estimate MCA total payback, payment term, and weekly cash pressure before reviewing funding offers."
};

export default function CalculatorPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="shell narrow">
          <h1>MCA factor-rate calculator.</h1>
          <p>
            Normalize the numbers before a funding call. The dashboard adds
            offer review, document status, outside-offer comparison, and renewal
            tracking.
          </p>
          <Link className="button primary" href="/login">
            {subscriptionOffer.primaryCta}
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
      <section className="section">
        <div className="shell">
          <FactorCalculator />
        </div>
      </section>
    </main>
  );
}
