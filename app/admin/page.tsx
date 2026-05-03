import { redirect } from "next/navigation";
import { Eye, EyeOff, Plus } from "lucide-react";
import { createOffer, updateOfferStatus } from "@/app/admin/actions";
import { hasSupabasePublicEnv, subscriptionOffer } from "@/lib/config";
import { currency } from "@/lib/offer-math";
import { sampleMerchant, sampleOffers } from "@/lib/sample-data";
import { createClient, getCurrentUser } from "@/lib/supabase/server";

type AdminMerchant = {
  id: string;
  business_legal_name: string;
  dba: string | null;
  status: string;
  monthly_revenue: number;
  requested_amount: number;
  membership_status: string;
};

type AdminOffer = {
  id: string;
  merchant_profile_id: string;
  public_label: string;
  status: string;
  advance_amount: number;
  total_payback: number;
  payment_amount: number;
  payment_frequency: string;
};

type AdminLead = {
  id: string;
  business_name: string;
  funnel: string;
  source_page: string;
  utm_source: string | null;
  utm_campaign: string | null;
  gclid: string | null;
  fbclid: string | null;
  lead_status: string;
  created_at: string;
};

type AdminConversion = {
  lead_id: string | null;
  event_name: string;
  status: string;
};

type PerformanceRow = {
  channel: string;
  campaign: string;
  funnel: string;
  leads: number;
  dashboardStarts: number;
  calculatorLeads: number;
};

function summarizePerformance(leads: AdminLead[], conversions: AdminConversion[]) {
  const conversionMap = new Map<string, AdminConversion[]>();

  for (const conversion of conversions) {
    if (!conversion.lead_id) {
      continue;
    }
    const existing = conversionMap.get(conversion.lead_id) || [];
    existing.push(conversion);
    conversionMap.set(conversion.lead_id, existing);
  }

  const rows = new Map<string, PerformanceRow>();

  for (const lead of leads) {
    const channel = lead.utm_source || "direct";
    const campaign = lead.utm_campaign || "untracked";
    const key = `${channel}:${campaign}:${lead.funnel}`;
    const row =
      rows.get(key) ||
      ({
        channel,
        campaign,
        funnel: lead.funnel,
        leads: 0,
        dashboardStarts: 0,
        calculatorLeads: 0
      } satisfies PerformanceRow);

    const leadConversions = conversionMap.get(lead.id) || [];
    row.leads += 1;
    row.dashboardStarts += leadConversions.some(
      (conversion) => conversion.event_name === "dashboard_started"
    )
      ? 1
      : 0;
    row.calculatorLeads +=
      lead.funnel === "calculator_lead" ||
      leadConversions.some((conversion) => conversion.event_name === "calculator_lead")
        ? 1
        : 0;
    rows.set(key, row);
  }

  return Array.from(rows.values()).sort((a, b) => b.leads - a.leads);
}

async function loadAdminData() {
  if (!hasSupabasePublicEnv()) {
    return {
      demo: true,
      merchants: [
        {
          id: sampleMerchant.id,
          business_legal_name: sampleMerchant.businessLegalName,
          dba: sampleMerchant.dba,
          status: sampleMerchant.status,
          monthly_revenue: sampleMerchant.monthlyRevenue,
          requested_amount: sampleMerchant.requestedAmount,
          membership_status: "demo"
        }
      ],
      offers: sampleOffers.map((offer) => ({
        id: offer.id,
        merchant_profile_id: sampleMerchant.id,
        public_label: offer.publicLabel,
        status: offer.status,
        advance_amount: offer.advanceAmount,
        total_payback: offer.totalPayback,
        payment_amount: offer.paymentAmount,
        payment_frequency: offer.paymentFrequency
      })),
      performance: [
        {
          channel: "google",
          campaign: "nj_compare_mca_offers_search_v1",
          funnel: "paid_compare_mca_offers_nj",
          leads: 6,
          dashboardStarts: 4,
          calculatorLeads: 0
        },
        {
          channel: "meta",
          campaign: "clearmatch_dashboard_transparency_v1",
          funnel: "paid_offer_dashboard_nj",
          leads: 5,
          dashboardStarts: 3,
          calculatorLeads: 0
        },
        {
          channel: "google",
          campaign: "nj_factor_rate_calculator_search_v1",
          funnel: "calculator_lead",
          leads: 4,
          dashboardStarts: 2,
          calculatorLeads: 4
        }
      ] satisfies PerformanceRow[]
    };
  }

  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { demo: false, merchants: [], offers: [], unauthorized: true };
  }

  const [merchants, offers, leads, conversions] = await Promise.all([
    supabase
      .from("merchant_profiles")
      .select(
        "id,business_legal_name,dba,status,monthly_revenue,requested_amount,membership_status"
      )
      .order("created_at", { ascending: false }),
    supabase
      .from("offers")
      .select(
        "id,merchant_profile_id,public_label,status,advance_amount,total_payback,payment_amount,payment_frequency"
      )
      .order("created_at", { ascending: false }),
    supabase
      .from("leads")
      .select(
        "id,business_name,funnel,source_page,utm_source,utm_campaign,gclid,fbclid,lead_status,created_at"
      )
      .order("created_at", { ascending: false })
      .limit(250),
    supabase
      .from("ad_conversions")
      .select("lead_id,event_name,status")
      .order("created_at", { ascending: false })
  ]);

  return {
    demo: false,
    merchants: (merchants.data || []) as AdminMerchant[],
    offers: (offers.data || []) as AdminOffer[],
    performance: summarizePerformance(
      (leads.data || []) as AdminLead[],
      (conversions.data || []) as AdminConversion[]
    )
  };
}

export const metadata = {
  title: "Admin Deal Desk | FORZA ClearMatch"
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const data = await loadAdminData();

  if ("unauthorized" in data && data.unauthorized) {
    return (
      <main className="app-main">
        <section className="app-shell">
          <h1>Admin access required.</h1>
          <p>Your account is signed in, but it is not marked as a FORZA admin.</p>
        </section>
      </main>
    );
  }

  const firstMerchantId = data.merchants[0]?.id || sampleMerchant.id;
  const performanceRows: PerformanceRow[] =
    "performance" in data ? data.performance ?? [] : [];

  return (
    <main className="app-main">
      <section className="app-shell">
        <div className="app-header">
          <div>
            <h1>FORZA admin deal desk</h1>
            <p>
              Enter funding partner offers internally. Merchants only see
              FORZA-branded published options and transparent math.
            </p>
          </div>
          <span className="status-pill">
            {data.demo ? "Demo mode" : subscriptionOffer.name}
          </span>
        </div>

        <div className="admin-layout">
          <section className="panel">
            <div className="panel-heading">
              <div>
                <h2>Leads and merchants</h2>
                <p>Supabase is the source of truth for merchant files.</p>
              </div>
            </div>
            <div className="admin-table">
              <div className="admin-row header">
                <span>Merchant</span>
                <span>Status</span>
                <span>Revenue</span>
                <span>Request</span>
                <span>Membership</span>
              </div>
              {data.merchants.map((merchant) => (
                <div className="admin-row" key={merchant.id}>
                  <span>{merchant.dba || merchant.business_legal_name}</span>
                  <span>{merchant.status}</span>
                  <span>{currency.format(Number(merchant.monthly_revenue || 0))}</span>
                  <span>{currency.format(Number(merchant.requested_amount || 0))}</span>
                  <span>{merchant.membership_status}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-heading">
              <div>
                <h2>Create offer</h2>
                <p>Draft offers stay hidden until status is published.</p>
              </div>
            </div>
            <form className="admin-form" action={createOffer}>
              <label>
                <span>Merchant profile ID</span>
                <input name="merchantProfileId" defaultValue={firstMerchantId} required />
              </label>
              <label>
                <span>Funder ID</span>
                <input name="funderId" placeholder="Internal only" />
              </label>
              <label>
                <span>Public label</span>
                <input name="publicLabel" defaultValue="FORZA Option A" required />
              </label>
              <label>
                <span>Status</span>
                <select name="status" defaultValue="draft">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </label>
              <label>
                <span>Advance</span>
                <input name="advanceAmount" type="number" defaultValue="30000" required />
              </label>
              <label>
                <span>Factor</span>
                <input name="factorRate" type="number" step="0.01" defaultValue="1.34" required />
              </label>
              <label>
                <span>Payment</span>
                <input name="paymentAmount" type="number" defaultValue="1340" required />
              </label>
              <label>
                <span>Frequency</span>
                <select name="paymentFrequency" defaultValue="weekly">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </label>
              <label>
                <span>Fees</span>
                <input name="fees" type="number" defaultValue="0" />
              </label>
              <label>
                <span>Rank</span>
                <input name="positionRank" type="number" defaultValue="1" min="1" />
              </label>
              <label className="full-field">
                <span>Broker compensation disclosure</span>
                <textarea
                  name="brokerCompensationDisclosure"
                  defaultValue="FORZA may receive or retain a 1% broker fee if funded through FORZA."
                  rows={3}
                />
              </label>
              <label className="full-field">
                <span>Renewal and payoff notes</span>
                <textarea name="renewalPayoffNotes" rows={3} />
              </label>
              <button className="button primary full" type="submit">
                <Plus size={16} />
                Save offer
              </button>
            </form>
          </section>

          <section className="panel full-width">
            <div className="panel-heading">
              <div>
                <h2>Ad performance</h2>
                <p>
                  Leads by channel, campaign, funnel, and dashboard-start progress.
                </p>
              </div>
            </div>
            <div className="admin-table">
              <div className="admin-row header performance-row">
                <span>Channel</span>
                <span>Campaign</span>
                <span>Funnel</span>
                <span>Leads</span>
                <span>Dashboard</span>
                <span>Calculator</span>
              </div>
              {performanceRows.length ? (
                performanceRows.map((row) => (
                  <div
                    className="admin-row performance-row"
                    key={`${row.channel}-${row.campaign}-${row.funnel}`}
                  >
                    <span>{row.channel}</span>
                    <span>{row.campaign}</span>
                    <span>{row.funnel}</span>
                    <span>{row.leads}</span>
                    <span>{row.dashboardStarts}</span>
                    <span>{row.calculatorLeads}</span>
                  </div>
                ))
              ) : (
                <div className="empty-state">No paid-attribution leads yet.</div>
              )}
            </div>
          </section>

          <section className="panel full-width">
            <div className="panel-heading">
              <div>
                <h2>Offer publishing</h2>
                <p>Published offers appear in the merchant dashboard. Draft and archived offers do not.</p>
              </div>
            </div>
            <div className="admin-table">
              <div className="admin-row header offer-admin-row">
                <span>Offer</span>
                <span>Status</span>
                <span>Advance</span>
                <span>Total</span>
                <span>Payment</span>
                <span>Visibility</span>
              </div>
              {data.offers.map((offer) => (
                <div className="admin-row offer-admin-row" key={offer.id}>
                  <span>{offer.public_label}</span>
                  <span>{offer.status}</span>
                  <span>{currency.format(Number(offer.advance_amount || 0))}</span>
                  <span>{currency.format(Number(offer.total_payback || 0))}</span>
                  <span>
                    {currency.format(Number(offer.payment_amount || 0))}{" "}
                    {offer.payment_frequency}
                  </span>
                  <form action={updateOfferStatus}>
                    <input type="hidden" name="offerId" value={offer.id} />
                    <input
                      type="hidden"
                      name="status"
                      value={offer.status === "published" ? "draft" : "published"}
                    />
                    <button className="small-action" type="submit">
                      {offer.status === "published" ? <EyeOff size={15} /> : <Eye size={15} />}
                      {offer.status === "published" ? "Unpublish" : "Publish"}
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
