import { cashPressureRatio, percent, pressureLabel, pressureTone } from "@/lib/offer-math";
import type { Offer } from "@/lib/types";

type PressureMeterProps = {
  monthlyRevenue: number;
  offer: Offer;
};

export function PressureMeter({ monthlyRevenue, offer }: PressureMeterProps) {
  const ratio = cashPressureRatio(
    monthlyRevenue,
    offer.paymentAmount,
    offer.paymentFrequency
  );
  const tone = pressureTone(ratio);

  return (
    <div className={`pressure-meter ${tone}`}>
      <div>
        <span>Cash pressure</span>
        <strong>{pressureLabel(ratio)}</strong>
      </div>
      <div className="meter-track" aria-hidden="true">
        <span style={{ width: `${Math.min(ratio * 420, 100)}%` }} />
      </div>
      <p>{ratio > 0 ? `${percent.format(ratio)} of estimated weekly revenue` : "Revenue needed"}</p>
    </div>
  );
}
