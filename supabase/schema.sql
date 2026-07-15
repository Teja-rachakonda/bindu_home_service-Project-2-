-- ============================================================
--  Bindu Home Services — Supabase schema
--  Run ONCE: Supabase Dashboard → SQL Editor → New query →
--  paste all of this → Run.
-- ============================================================

-- 1. BRAND (single row) --------------------------------------
create table if not exists brand (
  id            int primary key default 1,
  header1       text default 'DEALS ALERT',
  header2       text default 'Live Offers This Week',
  logo          text default '🚨',
  footer_top    text default '',
  footer_bottom text default '',
  phone         text default '+1 647-740-8124',
  facebook_profile text default '',
  facebook_page    text default '',
  instagram        text default '',
  updated_at    timestamptz default now(),
  constraint brand_singleton check (id = 1)
);
insert into brand (id) values (1) on conflict (id) do nothing;

-- 2. CONFIG (single row) -------------------------------------
create table if not exists config (
  id           int primary key default 1,
  wa_number    text default '16477408124',
  connect_text text default '💬 Connect with Agent',
  call_text    text default '📞 Call Us Now',
  plan         text default 'Professional',
  max_posters  int default 10,
  agent_email  text default 'agent@pabbarealty.com',
  tabs         jsonb default '{"internet":true,"rental":true,"homePhone":true,"mobile":true}',
  updated_at   timestamptz default now(),
  constraint config_singleton check (id = 1)
);
insert into config (id) values (1) on conflict (id) do nothing;

-- 3. POSTERS -------------------------------------------------
create table if not exists posters (
  id             uuid primary key default gen_random_uuid(),
  title          text default '',
  image          text default '',
  description    text default '',
  wa_message     text default '',
  badge          text default '',
  status         text default 'draft',
  knowledge_base text default '',
  sort_order     int default 0,
  created_at     timestamptz default now()
);

-- 3b. CATEGORIES (tabs) --------------------------------------
create table if not exists categories (
  id         uuid primary key default gen_random_uuid(),
  key        text unique,
  name       text default '',
  sort_order int default 0,
  active     boolean default true,
  created_at timestamptz default now()
);
insert into categories (key, name, sort_order)
select * from (values
  ('internet','Internet Deals',1),
  ('rental','Rental',2),
  ('homePhone','Home Phone',3),
  ('mobile','Mobile Plans',4)
) as v(key, name, sort_order)
on conflict (key) do nothing;

-- 4. OFFERS (the deal cards) ---------------------------------
create table if not exists offers (
  id         uuid primary key default gen_random_uuid(),
  category   text default 'internet',
  name       text default '',
  details    text default '',
  price      text default '',
  tag        text default '',
  badge      text default '',
  active     boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- 5. TEMPLATES (custom, admin-created) -----------------------
create table if not exists templates (
  id         uuid primary key default gen_random_uuid(),
  name       text default '',
  details    text default '',
  image      text default '',
  badge      text default '',
  wa_message text default '',
  created_at timestamptz default now()
);

-- 6. LEADS ---------------------------------------------------
create table if not exists leads (
  id         uuid primary key default gen_random_uuid(),
  deal_name  text default '',
  tab        text default '',
  action     text default '',
  first_name text default '',
  last_name  text default '',
  phone      text default '',
  email      text default '',
  created_at timestamptz default now()
);

-- 7. ADMIN USERS --------------------------------------------
create table if not exists admin_users (
  id           uuid primary key default gen_random_uuid(),
  name         text default '',
  phone        text default '',
  password     text default '',
  allowed_tabs jsonb default '[]',
  created_at   timestamptz default now()
);

-- ============================================================
--  Seed the deal cards so the public page isn't empty.
--  Idempotent: only seeds when the offers table is still empty.
-- ============================================================
insert into offers (category, name, details, price, tag, badge, sort_order)
select * from (values
  ('internet','Starter Internet','25 Mbps','$45/mo','Best for 1-2 users','Popular',1),
  ('internet','Home Internet Plus','150 Mbps','$60/mo','Best for families','',2),
  ('internet','Gigabit Fibre','1 Gbps','$85/mo','Unlimited data','Best Value',3),
  ('rental','1 Bed Apartment','Downtown Toronto','$1,800/mo','Available now','New',1),
  ('rental','2 Bed Apartment','North York','$2,200/mo','Pet friendly','',2),
  ('rental','3 Bed House','Mississauga','$2,800/mo','Garage included','',3),
  ('homePhone','Basic Home Phone','Unlimited local calls','$15/mo','No contract','',1),
  ('homePhone','Home Phone Plus','Unlimited Canada-wide','$25/mo','+ Voicemail','Popular',2),
  ('homePhone','International Bundle','60+ countries','$35/mo','Unlimited USA & India','',3),
  ('mobile','Talk & Text','5 GB data','$25/mo','Canada-wide','',1),
  ('mobile','Unlimited Basic','20 GB data','$40/mo','No overage fees','Popular',2),
  ('mobile','Unlimited Premium','Unlimited data','$55/mo','USA & Mexico roaming','Best Value',3)
) as v(category, name, details, price, tag, badge, sort_order)
where not exists (select 1 from offers);

-- Extra columns added later (idempotent) -------------------
alter table offers add column if not exists description  text default '';
alter table offers add column if not exists image        text default '';
alter table brand  add column if not exists header_color text default '';
alter table brand  add column if not exists text_color   text default '';
alter table brand  add column if not exists page_color   text default '';
alter table config add column if not exists socials      jsonb default '[]';

-- ============================================================
--  Row Level Security
--  DEMO policies: the public anon key can read/write everything.
--  This is OK for a private demo but MUST be tightened with
--  Supabase Auth before a real public launch.
--  Idempotent: drop-then-create so re-running never errors.
-- ============================================================
alter table brand       enable row level security;
alter table config      enable row level security;
alter table categories  enable row level security;
alter table posters     enable row level security;
alter table offers      enable row level security;
alter table templates   enable row level security;
alter table leads       enable row level security;
alter table admin_users enable row level security;

drop policy if exists "demo brand"       on brand;
drop policy if exists "demo config"      on config;
drop policy if exists "demo categories"  on categories;
drop policy if exists "demo posters"     on posters;
drop policy if exists "demo offers"      on offers;
drop policy if exists "demo templates"   on templates;
drop policy if exists "demo leads"       on leads;
drop policy if exists "demo admin_users" on admin_users;

create policy "demo brand"       on brand       for all using (true) with check (true);
create policy "demo config"      on config      for all using (true) with check (true);
create policy "demo categories"  on categories  for all using (true) with check (true);
create policy "demo posters"     on posters     for all using (true) with check (true);
create policy "demo offers"      on offers      for all using (true) with check (true);
create policy "demo templates"   on templates   for all using (true) with check (true);
create policy "demo leads"       on leads       for all using (true) with check (true);
create policy "demo admin_users" on admin_users for all using (true) with check (true);

-- Subscribers (the "Alert Me" opt-in list) -------------------
create table if not exists subscribers (
  id         uuid primary key default gen_random_uuid(),
  name       text default '',
  phone      text default '',
  email      text default '',
  created_at timestamptz default now()
);
alter table subscribers enable row level security;
drop policy if exists "demo subscribers" on subscribers;
create policy "demo subscribers" on subscribers for all using (true) with check (true);
