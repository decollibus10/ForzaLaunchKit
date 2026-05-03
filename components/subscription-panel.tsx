import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { currency } from "@/lib/offer-math";
import { subscriptionOffer } from "@/lib/config";

export function SubscriptionPanel() {
  const items = [
    "Private offer dashboard",
    "MCA offer shopping through funding partners",
    "Side-by-side deal comparison",
    "Outside offer review",
    "Deal packaging before funder submission",
    "Renewal and payoff tracking"
  ];

  return (
    <section className="section offer-section">
      <div className="shell offer-layout">
        <div>
          <h2>{subscriptionOffer.name}</h2>
          <p className="section-lede">{subscriptionOffer.promise}</p>
        </div>
        <div className="pricing-panel">
          <div className="price-line">
            <strong>{currency.format(subscriptionOffer.monthlyPrice)}</strong>
            <span>/month</span>
          </div>
          <p>
            Dashboard access, offer review, file packaging, and funding support.
            If you fund through FORZA, the broker fee is capped at 1% of the
            funded amount.
          </p>
          <ul className="check-list">
            {items.map((item) => (
              <li key={item}>
                <Check size={16} />
                {item}
              </li>
            ))}
          </ul>
          <Link className="button primary full" href="/login">
            {subscriptionOffer.primaryCta}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
