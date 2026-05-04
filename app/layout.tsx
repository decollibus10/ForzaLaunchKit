import type { Metadata } from "next";
import { AnalyticsNoScript, AnalyticsScripts } from "@/components/analytics-scripts";
import { AttributionCapture } from "@/components/attribution-capture";
import { BrokerDisclosure } from "@/components/disclosure";
import { SiteHeader } from "@/components/site-header";
import { site, subscriptionOffer } from "@/lib/config";
import "./globals.css";

export const metadata: Metadata = {
  title: `${site.productName} | Transparent MCA Offer Dashboard`,
  description:
    "A private MCA offer dashboard for New Jersey merchants comparing factor rates, payback, payment pressure, fees, and funding partner options.",
  metadataBase: new URL(site.url)
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AnalyticsNoScript />
        <AnalyticsScripts />
        <AttributionCapture />
        <SiteHeader />
        {children}
        <BrokerDisclosure />
        <footer className="site-footer">
          <div className="shell footer-inner">
            <p>
              {site.name} is a commercial financing broker. {subscriptionOffer.name} is
              a merchant membership for offer review and deal support.
            </p>
            <p>{site.address}</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
