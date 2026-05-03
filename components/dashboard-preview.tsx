import { CheckCircle2, Clock3, FileText, ShieldCheck } from "lucide-react";
import { currency, percent, cashPressureRatio } from "@/lib/offer-math";
import { sampleMerchant, sampleOffers } from "@/lib/sample-data";

export function DashboardPreview() {
  const firstOffer = sampleOffers[0];
  const pressure = cashPressureRatio(
    sampleMerchant.monthlyRevenue,
    firstOffer.paymentAmount,
    firstOffer.paymentFrequency
  );

  return (
    <div className="dashboard-preview" aria-label="Example offer dashboard">
      <div className="preview-topbar">
        <span>{sampleMerchant.dba}</span>
        <strong>Offers ready</strong>
      </div>
      <div className="preview-grid">
        <div className="preview-panel">
          <h3>FORZA Option A</h3>
          <div className="preview-metric">
            <span>Advance</span>
            <strong>{currency.format(firstOffer.advanceAmount)}</strong>
          </div>
          <div className="preview-metric">
            <span>Total payback</span>
            <strong>{currency.format(firstOffer.totalPayback)}</strong>
          </div>
          <div className="preview-row">
            <span>Factor</span>
            <b>{firstOffer.factorRate.toFixed(2)}</b>
          </div>
          <div className="preview-row">
            <span>Weekly payment</span>
            <b>{currency.format(firstOffer.paymentAmount)}</b>
          </div>
        </div>
        <div className="preview-panel">
          <h3>Deal desk</h3>
          <ol className="preview-steps">
            <li>
              <CheckCircle2 size={16} />
              Profile captured
            </li>
            <li>
              <Clock3 size={16} />
              Documents in review
            </li>
            <li>
              <FileText size={16} />
              Compare offer math
            </li>
            <li>
              <ShieldCheck size={16} />
              Broker fee capped at 1%
            </li>
          </ol>
        </div>
      </div>
      <div className="pressure-strip">
        <span>Cash pressure</span>
        <strong>{percent.format(pressure)} of weekly revenue</strong>
      </div>
    </div>
  );
}
