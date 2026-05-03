import Script from "next/script";
import { analyticsConfig } from "@/lib/config";

export function AnalyticsScripts() {
  const gtagId = analyticsConfig.ga4MeasurementId || analyticsConfig.googleAdsId;

  return (
    <>
      {analyticsConfig.gtmId ? (
        <Script id="gtm-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
            (function(w,d,s,l,i){var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;
            j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
            f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${analyticsConfig.gtmId}');
          `}
        </Script>
      ) : null}

      {gtagId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              ${analyticsConfig.ga4MeasurementId ? `gtag('config', '${analyticsConfig.ga4MeasurementId}');` : ""}
              ${analyticsConfig.googleAdsId ? `gtag('config', '${analyticsConfig.googleAdsId}');` : ""}
            `}
          </Script>
        </>
      ) : null}

      {analyticsConfig.metaPixelId ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${analyticsConfig.metaPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      ) : null}
    </>
  );
}

export function AnalyticsNoScript() {
  return analyticsConfig.gtmId ? (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${analyticsConfig.gtmId}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  ) : null;
}
