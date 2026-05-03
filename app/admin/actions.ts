"use server";

import { revalidatePath } from "next/cache";
import { hasSupabasePublicEnv } from "@/lib/config";
import { calculateEstimatedTermWeeks, calculateTotalPayback } from "@/lib/offer-math";
import { createClient, getCurrentUser } from "@/lib/supabase/server";

async function assertAdmin() {
  if (!hasSupabasePublicEnv()) {
    return null;
  }

  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Authentication required.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (error || data?.role !== "admin") {
    throw new Error("Admin access required.");
  }

  return supabase;
}

export async function createOffer(formData: FormData) {
  const supabase = await assertAdmin();
  if (!supabase) {
    revalidatePath("/admin");
    return;
  }

  const merchantProfileId = String(formData.get("merchantProfileId") || "");
  const advanceAmount = Number(formData.get("advanceAmount") || 0);
  const factorRate = Number(formData.get("factorRate") || 0);
  const paymentAmount = Number(formData.get("paymentAmount") || 0);
  const paymentFrequency = String(formData.get("paymentFrequency") || "weekly");
  const totalPayback = calculateTotalPayback(advanceAmount, factorRate);
  const estimatedTermWeeks = calculateEstimatedTermWeeks(
    totalPayback,
    paymentAmount,
    paymentFrequency as "daily" | "weekly" | "monthly"
  );

  await supabase.from("offers").insert({
    merchant_profile_id: merchantProfileId,
    funder_id: String(formData.get("funderId") || "") || null,
    public_label: String(formData.get("publicLabel") || "FORZA Option"),
    status: String(formData.get("status") || "draft"),
    advance_amount: advanceAmount,
    factor_rate: factorRate,
    total_payback: totalPayback,
    payment_amount: paymentAmount,
    payment_frequency: paymentFrequency,
    estimated_term_weeks: estimatedTermWeeks,
    fees: Number(formData.get("fees") || 0),
    broker_compensation_disclosure: String(
      formData.get("brokerCompensationDisclosure") ||
        "FORZA may receive or retain a 1% broker fee if funded through FORZA."
    ),
    renewal_payoff_notes: String(formData.get("renewalPayoffNotes") || ""),
    position_rank: Number(formData.get("positionRank") || 1)
  });

  revalidatePath("/admin");
}

export async function updateOfferStatus(formData: FormData) {
  const supabase = await assertAdmin();
  if (!supabase) {
    revalidatePath("/admin");
    return;
  }

  const offerId = String(formData.get("offerId") || "");
  const status = String(formData.get("status") || "draft");

  await supabase.from("offers").update({ status }).eq("id", offerId);
  revalidatePath("/admin");
}
