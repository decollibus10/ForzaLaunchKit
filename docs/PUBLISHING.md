# Publishing Notes

## Current Deployment

- Platform: Cloudflare Workers
- Adapter: `@opennextjs/cloudflare`
- Worker name: `forza-clearmatch`
- Production domains:
  - `https://forza-funding.com`
  - `https://www.forza-funding.com`

Vercel is no longer the production target for this project.

## Cloudflare Commands

```bash
npm install
npm run preview
npm run deploy
```

`npm run preview` builds with OpenNext and runs the app locally in the Workers runtime. `npm run deploy` builds and deploys the Worker.

## Domain Setup

The domain uses Cloudflare DNS. `wrangler.jsonc` declares custom domains for `forza-funding.com` and `www.forza-funding.com`, so Cloudflare can attach the Worker directly to both hostnames.

If Cloudflare reports that an existing DNS record blocks the custom domain, remove the old Vercel A records pointing to `76.76.21.21`, then deploy again or add the custom domains from Workers & Pages > `forza-clearmatch` > Settings > Domains & Routes.

## Environment Variables

Set public values as Worker variables and server-only values as Worker secrets in Cloudflare. For CLI-managed secrets:

```bash
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx wrangler secret put META_CAPI_ACCESS_TOKEN
```

At minimum, production needs:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_META_PIXEL_ID
META_CAPI_ACCESS_TOKEN
```

For Workers Builds from GitHub, also add build variables/secrets in Cloudflare so `next build` can inline the `NEXT_PUBLIC_` values.

## Before Google Ads

- Do not publish the owner home address unless counsel says it is required.
- For paid Google Ads, use a compliant public physical business address before launch. Prefer a legitimate registered agent, staffed office, or compliant commercial business address instead of the home address if counsel approves.
- Confirm `https://forza-funding.com` resolves to the Cloudflare Worker.
- Set production analytics/conversion env vars in Cloudflare.
- Confirm counsel has reviewed financial-services disclosures, paid-ad copy, commercial-financing obligations, privacy language, and document workflows before paid traffic.
