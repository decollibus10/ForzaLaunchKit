import type { Metadata, MetadataRoute } from "next";
import { funnelPages, funnelSlugs } from "@/lib/funnel-pages";
import { site, subscriptionOffer } from "@/lib/config";

type PublicRoute = {
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
};

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
};

const socialImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "FORZA ClearMatch private MCA offer dashboard"
};

const basePublicRoutes: PublicRoute[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/compare", changeFrequency: "monthly", priority: 0.9 },
  { path: "/calculator", changeFrequency: "monthly", priority: 0.9 }
];

export const publicSitemapRoutes: PublicRoute[] = [
  ...basePublicRoutes,
  ...funnelSlugs.map((slug) => ({
    path: `/funnels/${slug}`,
    changeFrequency: "monthly" as const,
    priority:
      slug === "compare-mca-offers-nj" || slug === "factor-rate-calculator-nj"
        ? 0.85
        : 0.8
  }))
];

export function canonicalUrl(path: string) {
  return new URL(path, site.url).toString();
}

export function pageMetadata({
  title,
  description,
  path,
  noIndex = false
}: PageMetadataInput): Metadata {
  const formattedTitle = title.includes(site.productName)
    ? title
    : `${title} | ${site.productName}`;

  return {
    title: formattedTitle,
    description,
    alternates: {
      canonical: path
    },
    openGraph: {
      title: formattedTitle,
      description,
      url: path,
      siteName: site.productName,
      locale: "en_US",
      type: "website",
      images: [socialImage]
    },
    twitter: {
      card: "summary_large_image",
      title: formattedTitle,
      description,
      images: [socialImage.url]
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false
          }
        }
      : undefined
  };
}

export function noIndexPageMetadata(input: Omit<PageMetadataInput, "noIndex">) {
  return pageMetadata({ ...input, noIndex: true });
}

export function buildStructuredData() {
  const organizationId = `${canonicalUrl("/")}#organization`;
  const serviceId = `${canonicalUrl("/")}#clearmatch-service`;
  const dashboardId = `${canonicalUrl("/")}#website`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "LocalBusiness", "FinancialService"],
        "@id": organizationId,
        name: site.name,
        alternateName: [site.shortName, site.productName],
        url: canonicalUrl("/"),
        email: site.supportEmail,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Marlboro",
          addressRegion: "NJ",
          addressCountry: "US"
        },
        areaServed: {
          "@type": "State",
          name: site.market
        },
        description:
          "FORZA CAPITAL PARTNERS LLC operates FORZA ClearMatch, an NJ-first commercial financing broker marketplace and private MCA offer dashboard for business-purpose funding comparisons.",
        knowsAbout: [
          "merchant cash advance offer comparison",
          "MCA factor rate math",
          "commercial financing broker support",
          "business-purpose funding offer review"
        ]
      },
      {
        "@type": "WebSite",
        "@id": dashboardId,
        name: site.productName,
        url: canonicalUrl("/"),
        publisher: {
          "@id": organizationId
        },
        description:
          "A private MCA offer dashboard for New Jersey merchants comparing factor rates, payback, payment pressure, fees, and brokered funding partner options."
      },
      {
        "@type": "Service",
        "@id": serviceId,
        name: subscriptionOffer.name,
        serviceType: "Merchant cash advance offer comparison dashboard",
        provider: {
          "@id": organizationId
        },
        areaServed: {
          "@type": "State",
          name: site.market
        },
        audience: {
          "@type": "BusinessAudience",
          audienceType: "New Jersey merchants reviewing business-purpose commercial financing"
        },
        description:
          "FORZA ClearMatch provides dashboard access, MCA offer review, file packaging, deal shopping support, outside-offer comparison, and renewal/payoff tracking. Funding approval, terms, and costs are determined by funding partners and underwriting.",
        offers: {
          "@type": "Offer",
          url: canonicalUrl("/"),
          price: subscriptionOffer.monthlyPrice,
          priceCurrency: "USD",
          category: "Commercial financing broker marketplace membership",
          description:
            "$500/month ClearMatch membership. If funded through FORZA, broker compensation is capped at 1% of funded amount. No funding is guaranteed."
        },
        additionalProperty: [
          {
            "@type": "PropertyValue",
            name: "Broker fee cap",
            value: "1% of funded amount if funded through FORZA"
          },
          {
            "@type": "PropertyValue",
            name: "Funding authority",
            value: "Funding partners determine approvals, terms, costs, and repayment structure"
          }
        ]
      },
      ...funnelSlugs.map((slug) => {
        const funnel = funnelPages[slug];

        return {
          "@type": "WebPage",
          "@id": `${canonicalUrl(`/funnels/${slug}`)}#webpage`,
          name: `${funnel.title} | ${site.productName}`,
          url: canonicalUrl(`/funnels/${slug}`),
          description: funnel.description,
          isPartOf: {
            "@id": dashboardId
          },
          about: {
            "@id": serviceId
          }
        };
      })
    ]
  };
}
