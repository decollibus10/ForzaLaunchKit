import type { Offer } from "@/lib/types";

export const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

export const percent = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1
});

export function calculateTotalPayback(advanceAmount: number, factorRate: number) {
  return Math.round(advanceAmount * factorRate);
}

export function calculateEstimatedTermWeeks(
  totalPayback: number,
  paymentAmount: number,
  paymentFrequency: Offer["paymentFrequency"]
) {
  if (!paymentAmount || paymentAmount <= 0) {
    return 0;
  }

  const payments = totalPayback / paymentAmount;
  if (paymentFrequency === "daily") {
    return Math.ceil(payments / 5);
  }
  if (paymentFrequency === "monthly") {
    return Math.ceil(payments * 4.33);
  }

  return Math.ceil(payments);
}

export function weeklyPaymentEquivalent(
  paymentAmount: number,
  paymentFrequency: Offer["paymentFrequency"]
) {
  if (paymentFrequency === "daily") {
    return paymentAmount * 5;
  }
  if (paymentFrequency === "monthly") {
    return paymentAmount / 4.33;
  }

  return paymentAmount;
}

export function cashPressureRatio(
  monthlyRevenue: number,
  paymentAmount: number,
  paymentFrequency: Offer["paymentFrequency"]
) {
  if (!monthlyRevenue || monthlyRevenue <= 0) {
    return 0;
  }

  const weeklyRevenue = monthlyRevenue / 4.33;
  return weeklyPaymentEquivalent(paymentAmount, paymentFrequency) / weeklyRevenue;
}

export function pressureLabel(ratio: number) {
  if (ratio <= 0) {
    return "Unknown";
  }
  if (ratio < 0.08) {
    return "Light";
  }
  if (ratio < 0.14) {
    return "Manageable";
  }
  if (ratio < 0.22) {
    return "Tight";
  }

  return "Heavy";
}

export function pressureTone(ratio: number) {
  if (ratio < 0.08) {
    return "good";
  }
  if (ratio < 0.14) {
    return "ok";
  }
  if (ratio < 0.22) {
    return "watch";
  }

  return "risk";
}
