# Cloudflare Pages Deployment

Primary deploy target: `static-site/`.

Official reference: Cloudflare Pages Direct Upload docs: https://developers.cloudflare.com/pages/get-started/direct-upload/

## Option A: Dashboard Direct Upload

1. Build the static files:

   ```bash
   npm run check:launch
   ```

2. In Cloudflare, open **Workers & Pages**.
3. Create a Pages project using direct upload.
4. Upload the contents of `static-site/`.
5. Use the Cloudflare preview URL for counsel/content review.

## Option B: Wrangler CLI

1. Confirm Cloudflare auth:

   ```bash
   npm run login:cloudflare
   npx wrangler whoami
   ```

2. Deploy:

   ```bash
   npm run deploy:cloudflare
   ```

## Staging Defaults

The static site intentionally blocks indexing three ways:

- `static-site/robots.txt` disallows crawling.
- Every page includes `noindex,nofollow`.
- `static-site/_headers` includes `X-Robots-Tag: noindex, nofollow`.

Leave all three in place until counsel approves:

- Business funding copy.
- Privacy policy.
- Terms of use.
- Disclosures.
- Form consent language.
- Tracking pixels and cookie/privacy posture.

## Production Switch

After domain and counsel approval:

1. Replace `siteUrl` in `config/forza-site.json` with the real domain.
2. Remove the `noindex,nofollow` meta tag from generated pages.
3. Remove `X-Robots-Tag: noindex, nofollow` from `_headers`.
4. Change `robots.txt` to allow crawling and include the sitemap.
5. Rebuild and redeploy.
6. Submit the sitemap in Google Search Console.

## Domain Notes

When a domain is purchased, add it to the Cloudflare Pages project as a custom domain. Keep the Cloudflare preview URL as staging and use the real domain only after review.
