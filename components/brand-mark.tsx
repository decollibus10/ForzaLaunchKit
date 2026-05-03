import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { site } from "@/lib/config";

export function BrandMark() {
  return (
    <Link className="brand-mark" href="/" aria-label={`${site.shortName} home`}>
      <span className="brand-icon" aria-hidden="true">
        <BarChart3 size={18} />
      </span>
      <span>
        <strong>{site.shortName}</strong>
        <small>ClearMatch</small>
      </span>
    </Link>
  );
}
