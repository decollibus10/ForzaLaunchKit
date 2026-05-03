create schema if not exists private;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'merchant' check (role in ('merchant', 'admin')),
  full_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where user_id = (select auth.uid())
      and role = 'admin'
  );
$$;

grant usage on schema private to authenticated;
grant execute on function private.is_admin() to authenticated;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (user_id, full_name, phone)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone'
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  email text not null,
  phone text,
  business_name text not null,
  monthly_revenue_range text,
  requested_amount_range text,
  existing_advance text,
  existing_offer_summary text,
  funnel text not null default 'unknown',
  source_page text not null default '/',
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  gclid text,
  fbclid text,
  fbp text,
  fbc text,
  referrer text,
  landing_url text,
  landing_path text,
  first_touch jsonb not null default '{}'::jsonb,
  last_touch jsonb not null default '{}'::jsonb,
  funnel_intent text not null default 'unknown',
  contact_consent boolean not null default false,
  marketing_consent boolean not null default false,
  conversion_event_id text,
  calculator_snapshot jsonb not null default '{}'::jsonb,
  lead_status text not null default 'new' check (lead_status in ('new', 'prequalified', 'manual_review', 'converted', 'nurture', 'declined')),
  membership_interest text not null default 'clearmatch',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.merchant_profiles (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete set null,
  business_legal_name text not null,
  dba text,
  owner_name text not null,
  email text not null,
  phone text,
  state text not null default 'NJ' check (state = 'NJ'),
  industry text not null default 'Unspecified',
  monthly_revenue numeric(12, 2) not null default 0 check (monthly_revenue >= 0),
  requested_amount numeric(12, 2) not null default 0 check (requested_amount >= 0),
  use_of_funds text not null default '',
  existing_positions text not null default '',
  status text not null default 'profile_started' check (
    status in (
      'new',
      'profile_started',
      'docs_requested',
      'shopping_funders',
      'offers_ready',
      'accepted',
      'declined',
      'archived'
    )
  ),
  membership_status text not null default 'not_started' check (
    membership_status in ('not_started', 'active', 'past_due', 'cancelled', 'demo')
  ),
  membership_price_cents integer not null default 50000,
  broker_fee_cap_bps integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.funders (
  id uuid primary key default gen_random_uuid(),
  display_name_internal text not null,
  status text not null default 'active' check (status in ('active', 'paused', 'archived')),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  merchant_profile_id uuid not null references public.merchant_profiles(id) on delete cascade,
  funder_id uuid references public.funders(id) on delete set null,
  public_label text not null default 'FORZA Option',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  advance_amount numeric(12, 2) not null check (advance_amount >= 0),
  factor_rate numeric(5, 3) not null check (factor_rate >= 1),
  total_payback numeric(12, 2) not null check (total_payback >= 0),
  payment_amount numeric(12, 2) not null check (payment_amount >= 0),
  payment_frequency text not null default 'weekly' check (payment_frequency in ('daily', 'weekly', 'monthly')),
  estimated_term_weeks integer not null default 0 check (estimated_term_weeks >= 0),
  fees numeric(12, 2) not null default 0 check (fees >= 0),
  broker_compensation_disclosure text not null default 'FORZA may receive or retain a 1% broker fee if funded through FORZA.',
  renewal_payoff_notes text not null default '',
  position_rank integer not null default 1 check (position_rank >= 1),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.deal_files (
  id uuid primary key default gen_random_uuid(),
  merchant_profile_id uuid not null references public.merchant_profiles(id) on delete cascade,
  uploaded_by uuid references auth.users(id) on delete set null,
  document_type text not null,
  file_name text not null,
  storage_path text not null,
  status text not null default 'uploaded' check (status in ('needed', 'uploaded', 'accepted', 'needs_review')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.deal_events (
  id uuid primary key default gen_random_uuid(),
  merchant_profile_id uuid not null references public.merchant_profiles(id) on delete cascade,
  label text not null,
  detail text not null default '',
  status text not null default 'pending' check (status in ('complete', 'current', 'pending')),
  occurred_at text,
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  merchant_profile_id uuid not null references public.merchant_profiles(id) on delete cascade,
  assigned_to uuid references auth.users(id) on delete set null,
  title text not null,
  status text not null default 'open' check (status in ('open', 'done', 'cancelled')),
  due_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.ad_attribution (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  merchant_profile_id uuid references public.merchant_profiles(id) on delete cascade,
  source_page text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  gclid text,
  fbclid text,
  fbp text,
  fbc text,
  referrer text,
  landing_url text,
  landing_path text,
  first_touch jsonb not null default '{}'::jsonb,
  last_touch jsonb not null default '{}'::jsonb,
  funnel_intent text not null default 'unknown',
  conversion_event_id text,
  contact_consent boolean not null default false,
  marketing_consent boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.ad_conversions (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete set null,
  event_name text not null check (
    event_name in ('lead_submitted', 'dashboard_started', 'calculator_lead')
  ),
  event_id text not null,
  platform text not null default 'meta' check (platform in ('meta', 'google', 'gtm', 'internal')),
  status text not null default 'skipped' check (status in ('sent', 'skipped', 'error')),
  source_page text,
  landing_url text,
  gclid text,
  fbclid text,
  response jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists leads_email_idx on public.leads (email);
create index if not exists leads_campaign_idx on public.leads (utm_source, utm_campaign);
create index if not exists leads_click_ids_idx on public.leads (gclid, fbclid);
create index if not exists merchant_profiles_owner_idx on public.merchant_profiles (owner_user_id);
create index if not exists offers_merchant_status_idx on public.offers (merchant_profile_id, status);
create index if not exists deal_files_merchant_idx on public.deal_files (merchant_profile_id);
create index if not exists deal_events_merchant_idx on public.deal_events (merchant_profile_id);
create index if not exists tasks_merchant_idx on public.tasks (merchant_profile_id);
create index if not exists ad_attribution_lead_idx on public.ad_attribution (lead_id);
create index if not exists ad_attribution_campaign_idx on public.ad_attribution (utm_source, utm_campaign);
create index if not exists ad_conversions_lead_idx on public.ad_conversions (lead_id, event_name);
create unique index if not exists ad_conversions_event_id_idx on public.ad_conversions (event_id, platform);

alter table public.profiles enable row level security;
alter table public.leads enable row level security;
alter table public.merchant_profiles enable row level security;
alter table public.funders enable row level security;
alter table public.offers enable row level security;
alter table public.deal_files enable row level security;
alter table public.deal_events enable row level security;
alter table public.tasks enable row level security;
alter table public.ad_attribution enable row level security;
alter table public.ad_conversions enable row level security;

create policy "profiles_select_own_or_admin"
on public.profiles for select
to authenticated
using (user_id = (select auth.uid()) or private.is_admin());

create policy "profiles_insert_own_merchant"
on public.profiles for insert
to authenticated
with check (user_id = (select auth.uid()) and role = 'merchant');

create policy "profiles_update_admin"
on public.profiles for update
to authenticated
using (private.is_admin())
with check (private.is_admin());

create policy "leads_public_insert"
on public.leads for insert
to anon, authenticated
with check (true);

create policy "leads_admin_select"
on public.leads for select
to authenticated
using (private.is_admin());

create policy "leads_admin_update"
on public.leads for update
to authenticated
using (private.is_admin())
with check (private.is_admin());

create policy "merchant_profiles_insert_own_or_admin"
on public.merchant_profiles for insert
to authenticated
with check (owner_user_id = (select auth.uid()) or private.is_admin());

create policy "merchant_profiles_select_own_or_admin"
on public.merchant_profiles for select
to authenticated
using (owner_user_id = (select auth.uid()) or private.is_admin());

create policy "merchant_profiles_update_own_or_admin"
on public.merchant_profiles for update
to authenticated
using (owner_user_id = (select auth.uid()) or private.is_admin())
with check (owner_user_id = (select auth.uid()) or private.is_admin());

create policy "funders_admin_all"
on public.funders for all
to authenticated
using (private.is_admin())
with check (private.is_admin());

create policy "offers_admin_all"
on public.offers for all
to authenticated
using (private.is_admin())
with check (private.is_admin());

create policy "offers_merchants_select_published"
on public.offers for select
to authenticated
using (
  status = 'published'
  and exists (
    select 1
    from public.merchant_profiles mp
    where mp.id = offers.merchant_profile_id
      and mp.owner_user_id = (select auth.uid())
  )
);

create policy "deal_files_admin_all"
on public.deal_files for all
to authenticated
using (private.is_admin())
with check (private.is_admin());

create policy "deal_files_merchants_insert"
on public.deal_files for insert
to authenticated
with check (
  exists (
    select 1
    from public.merchant_profiles mp
    where mp.id = deal_files.merchant_profile_id
      and mp.owner_user_id = (select auth.uid())
  )
);

create policy "deal_files_merchants_select"
on public.deal_files for select
to authenticated
using (
  exists (
    select 1
    from public.merchant_profiles mp
    where mp.id = deal_files.merchant_profile_id
      and mp.owner_user_id = (select auth.uid())
  )
);

create policy "deal_events_admin_all"
on public.deal_events for all
to authenticated
using (private.is_admin())
with check (private.is_admin());

create policy "deal_events_merchants_select"
on public.deal_events for select
to authenticated
using (
  exists (
    select 1
    from public.merchant_profiles mp
    where mp.id = deal_events.merchant_profile_id
      and mp.owner_user_id = (select auth.uid())
  )
);

create policy "tasks_admin_all"
on public.tasks for all
to authenticated
using (private.is_admin())
with check (private.is_admin());

create policy "tasks_merchants_select"
on public.tasks for select
to authenticated
using (
  exists (
    select 1
    from public.merchant_profiles mp
    where mp.id = tasks.merchant_profile_id
      and mp.owner_user_id = (select auth.uid())
  )
);

create policy "ad_attribution_public_insert"
on public.ad_attribution for insert
to anon, authenticated
with check (true);

create policy "ad_attribution_admin_select"
on public.ad_attribution for select
to authenticated
using (private.is_admin());

create policy "ad_conversions_public_insert"
on public.ad_conversions for insert
to anon, authenticated
with check (true);

create policy "ad_conversions_admin_select"
on public.ad_conversions for select
to authenticated
using (private.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'merchant-documents',
  'merchant-documents',
  false,
  52428800,
  array[
    'application/pdf',
    'image/png',
    'image/jpeg',
    'text/csv',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "merchant_documents_select_own_or_admin"
on storage.objects for select
to authenticated
using (
  bucket_id = 'merchant-documents'
  and (
    private.is_admin()
    or exists (
      select 1
      from public.merchant_profiles mp
      where mp.id::text = (storage.foldername(name))[1]
        and mp.owner_user_id = (select auth.uid())
    )
  )
);

create policy "merchant_documents_insert_own_or_admin"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'merchant-documents'
  and (
    private.is_admin()
    or exists (
      select 1
      from public.merchant_profiles mp
      where mp.id::text = (storage.foldername(name))[1]
        and mp.owner_user_id = (select auth.uid())
    )
  )
);

create policy "merchant_documents_update_own_or_admin"
on storage.objects for update
to authenticated
using (
  bucket_id = 'merchant-documents'
  and (
    private.is_admin()
    or exists (
      select 1
      from public.merchant_profiles mp
      where mp.id::text = (storage.foldername(name))[1]
        and mp.owner_user_id = (select auth.uid())
    )
  )
)
with check (
  bucket_id = 'merchant-documents'
  and (
    private.is_admin()
    or exists (
      select 1
      from public.merchant_profiles mp
      where mp.id::text = (storage.foldername(name))[1]
        and mp.owner_user_id = (select auth.uid())
    )
  )
);
