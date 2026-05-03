import Link from "next/link";
import { LogIn } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { subscriptionOffer } from "@/lib/config";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <BrandMark />
        <nav className="nav-links" aria-label="Primary navigation">
          <Link href="/compare">Compare</Link>
          <Link href="/calculator">Calculator</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link className="nav-action" href="/login">
            <LogIn size={16} />
            <span>{subscriptionOffer.primaryCta}</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
