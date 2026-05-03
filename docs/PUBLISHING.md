# Publishing Notes

## Current Deployment

- Vercel project: `forza-clearmatch`
- Production URL: `https://forza-clearmatch.vercel.app`
- Deployment status: ready
- Custom domains added in Vercel:
  - `forza-funding.com`
  - `www.forza-funding.com`

## DNS Still Needed

The domain currently uses Cloudflare nameservers:

- `hadlee.ns.cloudflare.com`
- `pete.ns.cloudflare.com`

Add these DNS records in Cloudflare:

```text
Type: A
Name: @
Value: 76.76.21.21
Proxy status: DNS only
TTL: Auto
```

```text
Type: A
Name: www
Value: 76.76.21.21
Proxy status: DNS only
TTL: Auto
```

Vercel also supports switching nameservers to:

```text
ns1.vercel-dns.com
ns2.vercel-dns.com
```

For this launch, keeping Cloudflare and adding the A records is the fastest path.

## Before Google Ads

- Do not publish the owner home address unless counsel says it is required.
- For paid Google Ads, use a compliant public physical business address before launch. Prefer a legitimate registered agent, staffed office, or compliant commercial business address instead of the home address if counsel approves.
- Confirm `https://forza-funding.com` resolves to the Vercel site.
- Set production analytics/conversion env vars in Vercel.
- Confirm counsel has reviewed financial-services disclosures and landing-page copy.
