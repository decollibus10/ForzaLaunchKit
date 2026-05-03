"use client";

import { FormEvent, useState } from "react";
import { Mail } from "lucide-react";
import { makeConversionEventId } from "@/lib/attribution";
import { trackBrowserConversion } from "@/lib/analytics";
import { hasSupabasePublicEnv, subscriptionOffer } from "@/lib/config";
import { createClient } from "@/lib/supabase/client";

type LoginFormProps = {
  initialEmail?: string;
  leadId?: string;
  intent?: string;
};

export function LoginForm({ initialEmail = "", leadId = "", intent = "" }: LoginFormProps) {
  const [email, setEmail] = useState(initialEmail);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function recordDashboardStart() {
    const eventId = makeConversionEventId("dashboard");

    trackBrowserConversion("dashboard_started", {
      eventId,
      leadId,
      funnel: intent || "dashboard_start",
      sourcePage: "/login"
    });

    await fetch("/api/conversions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName: "dashboard_started",
        eventId,
        leadId,
        email,
        funnel: intent || "dashboard_start",
        sourcePage: "/login",
        landingUrl: window.location.href
      })
    }).catch(() => undefined);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    if (!hasSupabasePublicEnv()) {
      await recordDashboardStart();
      setLoading(false);
      setMessage(
        "Demo mode: add Supabase env vars to send magic links and persist dashboard records."
      );
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/auth/confirm`
      }
    });

    if (!error) {
      await recordDashboardStart();
    }

    setLoading(false);
    setMessage(
      error
        ? error.message
        : "Check your email for the secure dashboard login link."
    );
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label>
        <span>Email address</span>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          autoComplete="email"
          required
        />
      </label>
      <button className="button primary full" disabled={loading} type="submit">
        <Mail size={16} />
        {loading ? "Sending link..." : subscriptionOffer.primaryCta}
      </button>
      {message ? <p className="form-status success">{message}</p> : null}
    </form>
  );
}
