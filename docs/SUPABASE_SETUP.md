# Supabase Setup

## Environment

Use publishable browser keys only in `NEXT_PUBLIC_` variables.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SUPABASE_SERVICE_ROLE_KEY=
```

Never expose the service role key in client code.

## Auth

The app uses email magic links. Configure the Supabase confirmation email template so the confirmation link points to:

```text
{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
```

## Data Model

Primary tables:

- `profiles`
- `leads`
- `merchant_profiles`
- `funders`
- `offers`
- `deal_files`
- `deal_events`
- `tasks`
- `ad_attribution`

Storage bucket:

- `merchant-documents`

## Security

RLS is enabled on all public tables. Merchant access is scoped to records connected to their `auth.uid()`. Admin access is granted by setting `public.profiles.role = 'admin'`.

Document object policies restrict access to paths beginning with the merchant profile id.
