-- KOC Manager MVP — Supabase schema
-- Chạy toàn bộ file này trong Supabase Dashboard > SQL Editor (mục "New query") rồi bấm Run.

create table if not exists koc (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  handle text not null,
  region text not null default 'Other',
  niche text not null default 'Lifestyle',
  followers integer not null default 0,
  base_price_eur numeric not null default 0,
  avg_cvr numeric,
  past_roi numeric,
  rating numeric,
  created_at timestamptz not null default now()
);

create table if not exists product (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'Other',
  created_at timestamptz not null default now()
);

create table if not exists campaign (
  id uuid primary key default gen_random_uuid(),
  koc_id uuid not null references koc(id) on delete cascade,
  product_id uuid not null references product(id) on delete cascade,
  campaign_name text not null,
  budget_eur numeric not null default 0,
  post_url text,
  status text not null default 'pending' check (status in ('pending','confirmed','posted','completed','cancelled')),
  start_date date,
  created_at timestamptz not null default now()
);

create table if not exists performance_checkin (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaign(id) on delete cascade,
  check_date date not null default current_date,
  views integer,
  likes integer,
  comments integer,
  shares integer,
  cvr numeric,
  revenue_eur numeric,
  notes text,
  created_at timestamptz not null default now()
);

-- Bật Row Level Security. Vì đây là MVP dùng riêng một mình (chưa có đăng nhập nhiều người),
-- policy dưới cho phép đọc/ghi tự do qua anon key. Khi có nhiều người dùng thật, thay policy
-- này bằng điều kiện theo user đăng nhập (xem ghi chú trong README).
alter table koc enable row level security;
alter table product enable row level security;
alter table campaign enable row level security;
alter table performance_checkin enable row level security;

create policy "allow all koc" on koc for all using (true) with check (true);
create policy "allow all product" on product for all using (true) with check (true);
create policy "allow all campaign" on campaign for all using (true) with check (true);
create policy "allow all performance_checkin" on performance_checkin for all using (true) with check (true);
