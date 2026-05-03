"use client";

import { useMemo, useState } from "react";
import { LeadForm } from "@/components/lead-form";
import { currency, percent } from "@/lib/offer-math";

type FactorCalculatorProps = {
  showLeadCapture?: boolean;
};

export function FactorCalculator({ showLeadCapture = true }: FactorCalculatorProps) {
  const [advance, setAdvance] = useState(30000);
  const [factor, setFactor] = useState(1.34);
  const [weeklyPayment, setWeeklyPayment] = useState(1340);
  const [monthlyRevenue, setMonthlyRevenue] = useState(82000);

  const output = useMemo(() => {
    const total = Math.round(advance * factor);
    const term = weeklyPayment > 0 ? Math.ceil(total / weeklyPayment) : 0;
    const pressure = monthlyRevenue > 0 ? weeklyPayment / (monthlyRevenue / 4.33) : 0;
    return { total, term, pressure };
  }, [advance, factor, monthlyRevenue, weeklyPayment]);

  return (
    <div className="calculator-shell">
      <div className="slider-stack">
        <label>
          <span>Advance: {currency.format(advance)}</span>
          <input
            type="range"
            min="5000"
            max="100000"
            step="1000"
            value={advance}
            onChange={(event) => setAdvance(Number(event.target.value))}
          />
        </label>
        <label>
          <span>Factor rate: {factor.toFixed(2)}</span>
          <input
            type="range"
            min="1.1"
            max="1.6"
            step="0.01"
            value={factor}
            onChange={(event) => setFactor(Number(event.target.value))}
          />
        </label>
        <label>
          <span>Weekly payment: {currency.format(weeklyPayment)}</span>
          <input
            type="range"
            min="250"
            max="5000"
            step="10"
            value={weeklyPayment}
            onChange={(event) => setWeeklyPayment(Number(event.target.value))}
          />
        </label>
        <label>
          <span>Monthly revenue: {currency.format(monthlyRevenue)}</span>
          <input
            type="range"
            min="15000"
            max="300000"
            step="1000"
            value={monthlyRevenue}
            onChange={(event) => setMonthlyRevenue(Number(event.target.value))}
          />
        </label>
      </div>
      <div className="calculator-output">
        <div>
          <span>Total payback</span>
          <strong>{currency.format(output.total)}</strong>
        </div>
        <div>
          <span>Estimated term</span>
          <strong>{output.term} weeks</strong>
        </div>
        <div>
          <span>Weekly pressure</span>
          <strong>{percent.format(output.pressure)}</strong>
        </div>
        {showLeadCapture ? (
          <section className="calculator-lead">
            <h2>Save this estimate</h2>
            <p>
              Send the snapshot into a FORZA dashboard lead so the actual offers
              can be compared against the same math.
            </p>
            <LeadForm
              compact
              funnel="calculator_lead"
              funnelIntent="calculator_lead"
              calculatorSnapshot={{
                advance,
                factorRate: factor,
                weeklyPayment,
                monthlyRevenue,
                totalPayback: output.total,
                estimatedTermWeeks: output.term,
                weeklyPressure: output.pressure
              }}
            />
          </section>
        ) : null}
      </div>
    </div>
  );
}
