import { site, subscriptionOffer } from "@/lib/config";

export function BrokerDisclosure() {
  return (
    <section className="disclosure-band" aria-label="Broker disclosure">
      <div className="shell">
        <p>{subscriptionOffer.disclosure}</p>
        <p>
          Business-purpose commercial financing only. {site.shortName} does not
          provide consumer loans and does not guarantee approval, terms, cost, or
          funding speed.
        </p>
      </div>
    </section>
  );
}
