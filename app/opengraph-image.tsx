import { ImageResponse } from "next/og";
import { site, subscriptionOffer } from "@/lib/config";

export const alt = "FORZA ClearMatch private MCA offer dashboard";
export const size = {
  width: 1200,
  height: 630
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          color: "#f8fafc",
          background: "#0f172a",
          fontFamily: "Arial, Helvetica, sans-serif"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 28,
            letterSpacing: 0
          }}
        >
          <span>{site.productName}</span>
          <span>{site.market}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <h1
            style={{
              maxWidth: 900,
              margin: 0,
              fontSize: 78,
              lineHeight: 1.02,
              letterSpacing: 0
            }}
          >
            Compare MCA offers before you sign.
          </h1>
          <p style={{ maxWidth: 860, margin: 0, fontSize: 34, lineHeight: 1.32 }}>
            Private offer dashboard, transparent MCA math, and broker support
            with a 1% fee cap if funded through FORZA.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 26,
            color: "#cbd5e1"
          }}
        >
          <span>{subscriptionOffer.primaryCta}</span>
          <span>$500/month ClearMatch membership</span>
        </div>
      </div>
    ),
    size
  );
}
