import type { DealEvent, DealFile, MerchantProfile, Offer } from "@/lib/types";

export const sampleMerchant: MerchantProfile = {
  id: "00000000-0000-4000-8000-000000000001",
  businessLegalName: "Garden State Auto Works LLC",
  dba: "Garden State Auto Works",
  ownerName: "Maria Alvarez",
  email: "owner@example.com",
  phone: "(201) 555-0134",
  state: "NJ",
  industry: "Auto repair",
  monthlyRevenue: 82000,
  requestedAmount: 30000,
  useOfFunds: "Inventory, equipment, and seasonal payroll timing.",
  existingPositions: "One active MCA with payoff requested.",
  status: "offers_ready"
};

export const sampleFiles: DealFile[] = [
  {
    id: "file-1",
    documentType: "Bank statements",
    fileName: "Last 4 months",
    status: "uploaded",
    uploadedAt: "2026-05-03"
  },
  {
    id: "file-2",
    documentType: "Existing MCA contract",
    fileName: "Senior position payoff package",
    status: "needs_review"
  },
  {
    id: "file-3",
    documentType: "Entity verification",
    fileName: "Certificate and EIN letter",
    status: "needed"
  }
];

export const sampleOffers: Offer[] = [
  {
    id: "offer-1",
    publicLabel: "FORZA Option A",
    status: "published",
    advanceAmount: 30000,
    factorRate: 1.34,
    totalPayback: 40200,
    paymentAmount: 1340,
    paymentFrequency: "weekly",
    estimatedTermWeeks: 30,
    fees: 495,
    brokerCompensationDisclosure:
      "Broker compensation is reviewed case by case before acceptance.",
    renewalPayoffNotes:
      "Renewal eligibility reviewed after payment history and current balances are verified.",
    positionRank: 1
  },
  {
    id: "offer-2",
    publicLabel: "FORZA Option B",
    status: "published",
    advanceAmount: 25000,
    factorRate: 1.29,
    totalPayback: 32250,
    paymentAmount: 645,
    paymentFrequency: "daily",
    estimatedTermWeeks: 10,
    fees: 0,
    brokerCompensationDisclosure:
      "Broker compensation is reviewed case by case before acceptance.",
    renewalPayoffNotes:
      "Daily remittance creates higher pressure even though the factor is lower.",
    positionRank: 2
  }
];

export const sampleEvents: DealEvent[] = [
  {
    id: "event-1",
    label: "Dashboard created",
    detail: "Merchant profile and ad attribution captured.",
    status: "complete",
    occurredAt: "May 3"
  },
  {
    id: "event-2",
    label: "Documents in review",
    detail: "Statements and existing position details are being checked.",
    status: "current",
    occurredAt: "Today"
  },
  {
    id: "event-3",
    label: "Offer comparison",
    detail: "Published offers appear here once FORZA verifies the math.",
    status: "pending"
  }
];
