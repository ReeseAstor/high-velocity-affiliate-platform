-- Users table (extends Supabase Auth)
create table public.profiles (
  id uuid references auth.users not null,
  full_name text,
  avatar_url text,
  website text,
  updated_at timestamp with time zone,
  primary key (id)
);

-- Affiliate Networks
create table public.networks (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  postback_url_template text, -- e.g. https://api.network.com/postback?clickid={click_id}
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Products to promote
create table public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  affiliate_link text not null,
  network_id uuid references public.networks(id),
  metadata jsonb default '{}'::jsonb, -- Store imported data from CSV/Airtable
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Generated Content
create table public.contents (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products(id),
  title text,
  slug text unique,
  body_markdown text,
  status text default 'draft', -- draft, published, archived
  meta_description text,
  published_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tracking: Clicks
create table public.clicks (
  id uuid default gen_random_uuid() primary key,
  click_id text unique not null, -- external ID for postbacks
  product_id uuid references public.products(id),
  visitor_ip text,
  user_agent text,
  referrer text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tracking: Conversions
create table public.conversions (
  id uuid default gen_random_uuid() primary key,
  click_id text references public.clicks(click_id),
  amount numeric(10, 2),
  currency text default 'USD',
  network_id uuid references public.networks(id),
  transaction_id text, -- ID from the network
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table profiles enable row level security;
alter table networks enable row level security;
alter table products enable row level security;
alter table contents enable row level security;
-- Clicks and conversions might be public-write (via API) but restricted read
alter table clicks enable row level security;
alter table conversions enable row level security;
