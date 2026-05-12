import { redirect } from "next/navigation";
import { CreditCard, FileText, ShieldCheck } from "lucide-react";
import { DealTimeline } from "@/components/deal-timeline";
import { DocumentUpload } from "@/components/document-upload";
import { OfferCard } from "@/components/offer-card";
import {
  canRenderLocalDemoData,
  hasSupabasePublicEnv,
  subscriptionOffer
} from "@/lib/config";
import { currency } from "@/lib/offer-math";
import {
  sampleEvents,
  sampleFiles,
  sampleMerchant,
  sampleOffers
} from "@/lib/sample-data";
import { noIndexPageMetadata } from "@/lib/seo";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import type { DealEvent, DealFile, MerchantProfile, Offer } from "@/lib/types";

type MerchantRow = {
  id: string;
  business_legal_name: string;
  dba: string | null;
  owner_name: string;
  email: string;
  phone: string;
  state: string;
  industry: string;
  monthly_revenue: number;
  requested_amount: number;
  use_of_funds: string;
  existing_positions: string;
  status: MerchantProfile["status"];
};

type OfferRow = {
  id: string;
  public_label: string;
  status: Offer["status"];
  advance_amount: number;
  factor_rate: number;
  total_payback: number;
  payment_amount: number;
  payment_frequency: Offer["paymentFrequency"];
  estimated_term_weeks: number;
  fees: number;
  broker_compensation_disclosure: string;
  renewal_payoff_notes: string;
  position_rank: number;
};

type FileRow = {
  id: string;
  document_type: string;
  file_name: string;
  status: DealFile["status"];
  created_at: string;
};

type EventRow = {
  id: string;
  label: string;
  detail: string;
  status: DealEvent["status"];
  occurred_at: string | null;
};

function mapMerchant(row: MerchantRow): MerchantProfile {
  return {
    id: row.id,
    businessLegalName: row.business_legal_name,
    dba: row.dba,
    ownerName: row.owner_name,
    email: row.email,
    phone: row.phone,
    state: row.state,
    industry: row.industry,
    monthlyRevenue: Number(row.monthly_revenue || 0),
    requestedAmount: Number(row.requested_amount || 0),
    useOfFunds: row.use_of_funds,
    existingPositions: row.existing_positions,
    status: row.status
  };
}

function mapOffer(row: OfferRow): Offer {
  return {
    id: row.id,
    publicLabel: row.public_label,
    status: row.status,
    advanceAmount: Number(row.advance_amount || 0),
    factorRate: Number(row.factor_rate || 0),
    totalPayback: Number(row.total_payback || 0),
    paymentAmount: Number(row.payment_amount || 0),
    paymentFrequency: row.payment_frequency,
    estimatedTermWeeks: Number(row.estimated_term_weeks || 0),
    fees: Number(row.fees || 0),
    brokerCompensationDisclosure: row.broker_compensation_disclosure,
    renewalPayoffNotes: row.renewal_payoff_notes,
    positionRank: Number(row.position_rank || 1)
  };
}

function mapFile(row: FileRow): DealFile {
  return {
    id: row.id,
    documentType: row.document_type,
    fileName: row.file_name,
    status: row.status,
    uploadedAt: row.created_at?.slice(0, 10)
  };
}

function mapEvent(row: EventRow): DealEvent {
  return {
    id: row.id,
    label: row.label,
    detail: row.detail,
    status: row.status,
    occurredAt: row.occurred_at || undefined
  };
}

async function loadDashboardData() {
  if (!hasSupabasePublicEnv()) {
    if (!canRenderLocalDemoData()) {
      redirect("/login");
    }

    return {
      merchant: sampleMerchant,
      offers: sampleOffers,
      files: sampleFiles,
      events: sampleEvents,
      demo: true
    };
  }

  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();
  const merchantQuery = await supabase
    .from("merchant_profiles")
    .select(
      "id,business_legal_name,dba,owner_name,email,phone,state,industry,monthly_revenue,requested_amount,use_of_funds,existing_positions,status"
    )
    .eq("owner_user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const merchant = merchantQuery.data
    ? mapMerchant(merchantQuery.data as MerchantRow)
    : sampleMerchant;

  const [offersQuery, filesQuery, eventsQuery] = await Promise.all([
    supabase
      .from("offers")
      .select(
        "id,public_label,status,advance_amount,factor_rate,total_payback,payment_amount,payment_frequency,estimated_term_weeks,fees,broker_compensation_disclosure,renewal_payoff_notes,position_rank"
      )
      .eq("merchant_profile_id", merchant.id)
      .eq("status", "published")
      .order("position_rank", { ascending: true }),
    supabase
      .from("deal_files")
      .select("id,document_type,file_name,status,created_at")
      .eq("merchant_profile_id", merchant.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("deal_events")
      .select("id,label,detail,status,occurred_at")
      .eq("merchant_profile_id", merchant.id)
      .order("created_at", { ascending: true })
  ]);

  return {
    merchant,
    offers: offersQuery.data?.map((row) => mapOffer(row as OfferRow)) || [],
    files: filesQuery.data?.map((row) => mapFile(row as FileRow)) || [],
    events: eventsQuery.data?.map((row) => mapEvent(row as EventRow)) || [],
    demo: false
  };
}

export const metadata = noIndexPageMetadata({
  title: "Merchant Dashboard | FORZA ClearMatch",
  description: "Private FORZA ClearMatch merchant dashboard.",
  path: "/dashboard"
});

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { merchant, offers, files, events, demo } = await loadDashboardData();

  return (
    <main className="app-main">
      <section className="app-shell">
        <div className="app-header">
          <div>
            <h1>{merchant.dba || merchant.businessLegalName}</h1>
            <p>
              {subscriptionOffer.name}: {currency.format(subscriptionOffer.monthlyPrice)}
              /month offer desk with broker fee capped at 1% if funded through FORZA.
            </p>
          </div>
          <span className="status-pill">{demo ? "Demo mode" : merchant.status}</span>
        </div>

        <div className="dashboard-layout">
          <section className="dashboard-main">
            <div className="summary-grid">
              <div className="summary-tile">
                <CreditCard size={18} />
                <span>Requested</span>
                <strong>{currency.format(merchant.requestedAmount)}</strong>
              </div>
              <div className="summary-tile">
                <ShieldCheck size={18} />
                <span>Monthly revenue</span>
                <strong>{currency.format(merchant.monthlyRevenue)}</strong>
              </div>
              <div className="summary-tile">
                <FileText size={18} />
                <span>Published offers</span>
                <strong>{offers.length}</strong>
              </div>
            </div>

            <div className="panel">
              <div className="panel-heading">
                <div>
                  <h2>Offer comparison</h2>
                  <p>Only published FORZA-branded options appear to merchants.</p>
                </div>
              </div>
              <div className="offer-stack">
                {offers.length ? (
                  offers.map((offer) => (
                    <OfferCard
                      key={offer.id}
                      offer={offer}
                      monthlyRevenue={merchant.monthlyRevenue}
                    />
                  ))
                ) : (
                  <p className="empty-state">
                    FORZA is still shopping and normalizing the numbers. Published offers
                    will appear here.
                  </p>
                )}
              </div>
            </div>
          </section>

          <aside className="dashboard-side">
            <div className="panel">
              <h2>Business profile</h2>
              <dl className="detail-list">
                <div>
                  <dt>Industry</dt>
                  <dd>{merchant.industry}</dd>
                </div>
                <div>
                  <dt>Use of funds</dt>
                  <dd>{merchant.useOfFunds}</dd>
                </div>
                <div>
                  <dt>Existing positions</dt>
                  <dd>{merchant.existingPositions}</dd>
                </div>
              </dl>
            </div>
            <DocumentUpload merchantProfileId={merchant.id} initialFiles={files} />
            <div className="panel">
              <h2>Deal timeline</h2>
              <DealTimeline events={events.length ? events : sampleEvents} />
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
