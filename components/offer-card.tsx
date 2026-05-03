import { BadgeDollarSign } from "lucide-react";
import { PressureMeter } from "@/components/pressure-meter";
import { currency } from "@/lib/offer-math";
import type { Offer } from "@/lib/types";

type OfferCardProps = {
  offer: Offer;
  monthlyRevenue: number;
};

export function OfferCard({ offer, monthlyRevenue }: OfferCardProps) {
  return (
    <article className="offer-card">
      <div className="offer-card-header">
        <div>
          <h3>{offer.publicLabel}</h3>
          <p>FORZA-branded option from a funding partner.</p>
        </div>
        <span className="offer-rank">
          <BadgeDollarSign size={16} />
          Option {offer.positionRank}
        </span>
      </div>
      <div className="metric-grid">
        <div>
          <span>Advance</span>
          <strong>{currency.format(offer.advanceAmount)}</strong>
        </div>
        <div>
          <span>Total payback</span>
          <strong>{currency.format(offer.totalPayback)}</strong>
        </div>
        <div>
          <span>Factor rate</span>
          <strong>{offer.factorRate.toFixed(2)}</strong>
        </div>
        <div>
          <span>Payment</span>
          <strong>
            {currency.format(offer.paymentAmount)} {offer.paymentFrequency}
          </strong>
        </div>
        <div>
          <span>Estimated term</span>
          <strong>{offer.estimatedTermWeeks} weeks</strong>
        </div>
        <div>
          <span>Fees</span>
          <strong>{currency.format(offer.fees)}</strong>
        </div>
      </div>
      <PressureMeter monthlyRevenue={monthlyRevenue} offer={offer} />
      <div className="offer-notes">
        <p>{offer.renewalPayoffNotes}</p>
        <p>{offer.brokerCompensationDisclosure}</p>
      </div>
    </article>
  );
}
