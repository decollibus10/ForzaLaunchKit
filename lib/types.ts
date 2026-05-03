export type MerchantStatus =
  | "new"
  | "profile_started"
  | "docs_requested"
  | "shopping_funders"
  | "offers_ready"
  | "accepted"
  | "declined"
  | "archived";

export type OfferStatus = "draft" | "published" | "archived";

export type PaymentFrequency = "daily" | "weekly" | "monthly";

export type ConversionEventName =
  | "lead_submitted"
  | "dashboard_started"
  | "calculator_lead";

export type AttributionTouch = {
  capturedAt: string;
  landingUrl: string;
  landingPath: string;
  sourcePage: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  gclid?: string;
  fbclid?: string;
  fbp?: string;
  fbc?: string;
  funnelIntent?: string;
};

export type CalculatorSnapshot = {
  advance: number;
  factorRate: number;
  weeklyPayment: number;
  monthlyRevenue: number;
  totalPayback: number;
  estimatedTermWeeks: number;
  weeklyPressure: number;
};

export type LeadPayload = {
  fullName: string;
  email: string;
  phone: string;
  businessName: string;
  monthlyRevenue: string;
  requestedAmount: string;
  existingAdvance: string;
  funnel: string;
  sourcePage: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  gclid?: string;
  fbclid?: string;
  fbp?: string;
  fbc?: string;
  referrer?: string;
  landingUrl?: string;
  landingPath?: string;
  firstTouch?: AttributionTouch;
  lastTouch?: AttributionTouch;
  funnelIntent?: string;
  contactConsent: boolean;
  marketingConsent: boolean;
  conversionEventId?: string;
  calculatorSnapshot?: CalculatorSnapshot;
  existingOfferSummary?: string;
};

export type MerchantProfile = {
  id: string;
  businessLegalName: string;
  dba?: string | null;
  ownerName: string;
  email: string;
  phone: string;
  state: string;
  industry: string;
  monthlyRevenue: number;
  requestedAmount: number;
  useOfFunds: string;
  existingPositions: string;
  status: MerchantStatus;
};

export type DealFile = {
  id: string;
  documentType: string;
  fileName: string;
  status: "needed" | "uploaded" | "accepted" | "needs_review";
  uploadedAt?: string;
};

export type Offer = {
  id: string;
  publicLabel: string;
  status: OfferStatus;
  advanceAmount: number;
  factorRate: number;
  totalPayback: number;
  paymentAmount: number;
  paymentFrequency: PaymentFrequency;
  estimatedTermWeeks: number;
  fees: number;
  brokerCompensationDisclosure: string;
  renewalPayoffNotes: string;
  positionRank: number;
};

export type DealEvent = {
  id: string;
  label: string;
  detail: string;
  status: "complete" | "current" | "pending";
  occurredAt?: string;
};
