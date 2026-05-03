import { LoginForm } from "@/components/login-form";
import { subscriptionOffer } from "@/lib/config";

export const metadata = {
  title: "Create Your Offer Dashboard | FORZA ClearMatch",
  description:
    "Create a private FORZA ClearMatch dashboard with email magic-link login."
};

type LoginPageProps = {
  searchParams: Promise<{
    email?: string;
    leadId?: string;
    intent?: string;
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>{subscriptionOffer.primaryCta}</h1>
        <p>
          Use email magic-link login for your private dashboard. The membership
          is $500/month, with FORZA broker compensation capped at 1% if you fund
          through FORZA.
        </p>
        <LoginForm
          initialEmail={params.email || ""}
          leadId={params.leadId || ""}
          intent={params.intent || ""}
        />
      </section>
    </main>
  );
}
