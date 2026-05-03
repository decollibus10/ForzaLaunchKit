"use client";

import { FormEvent, useState } from "react";
import { Calculator } from "lucide-react";
import {
  calculateEstimatedTermWeeks,
  calculateTotalPayback,
  cashPressureRatio,
  currency,
  percent,
  pressureLabel
} from "@/lib/offer-math";

type DecodedOffer = {
  totalPayback: number;
  termWeeks: number;
  pressure: number;
  label: string;
};

export function OfferDecoder() {
  const [decoded, setDecoded] = useState<DecodedOffer | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const advance = Number(form.get("advance") || 0);
    const factor = Number(form.get("factor") || 0);
    const payment = Number(form.get("payment") || 0);
    const monthlyRevenue = Number(form.get("monthlyRevenue") || 0);
    const frequency = String(form.get("frequency") || "weekly") as
      | "daily"
      | "weekly"
      | "monthly";

    const totalPayback = calculateTotalPayback(advance, factor);
    const termWeeks = calculateEstimatedTermWeeks(totalPayback, payment, frequency);
    const pressure = cashPressureRatio(monthlyRevenue, payment, frequency);

    setDecoded({
      totalPayback,
      termWeeks,
      pressure,
      label: pressureLabel(pressure)
    });
  }

  return (
    <div className="tool-grid">
      <form className="tool-form" onSubmit={handleSubmit}>
        <label>
          <span>Advance amount</span>
          <input name="advance" type="number" min="0" step="1000" required />
        </label>
        <label>
          <span>Factor rate</span>
          <input name="factor" type="number" min="1" step="0.01" required />
        </label>
        <label>
          <span>Payment amount</span>
          <input name="payment" type="number" min="0" step="50" required />
        </label>
        <label>
          <span>Payment frequency</span>
          <select name="frequency" defaultValue="weekly">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </label>
        <label>
          <span>Monthly gross revenue</span>
          <input name="monthlyRevenue" type="number" min="0" step="1000" required />
        </label>
        <button className="button primary full" type="submit">
          <Calculator size={16} />
          Decode offer
        </button>
      </form>
      <div className="tool-output">
        {decoded ? (
          <>
            <span>Comparison output</span>
            <strong>{currency.format(decoded.totalPayback)} total payback</strong>
            <dl>
              <div>
                <dt>Estimated term</dt>
                <dd>{decoded.termWeeks} weeks</dd>
              </div>
              <div>
                <dt>Cash pressure</dt>
                <dd>
                  {decoded.label} ({percent.format(decoded.pressure)})
                </dd>
              </div>
            </dl>
            <p>
              Bring the offer into your dashboard and FORZA will compare it
              against funding partner options before you sign.
            </p>
          </>
        ) : (
          <>
            <span>Ready</span>
            <strong>Paste the deal numbers before you sign.</strong>
            <p>
              The decoder normalizes MCA math into advance, payback, payment,
              estimated term, and cash-pressure language.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
