-- Dear Yesterday V3 FINAL schema.
-- Run this in Supabase SQL Editor for the existing project.
create extension if not exists pgcrypto;

create table if not exists public.profiles(
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null check(length(username) between 3 and 32),
  display_name text not null check(length(display_name) between 1 and 80),
  bio text not null default '' check(length(bio)<=500),
  player_gender text not null default 'guy' check(player_gender in ('guy','girl')),
  instagram_url text,
  whatsapp_url text,
  is_premium boolean not null default false,
  premium_since timestamptz,
  role text not null default 'user' check(role in ('user','admin')),
  created_at timestamptz not null default now()
);
alter table public.profiles add column if not exists bio text not null default '';
alter table public.profiles add column if not exists player_gender text not null default 'guy';
alter table public.profiles add column if not exists role text not null default 'user';
do $$ begin if not exists(select 1 from pg_constraint where conname='profiles_player_gender_check') then alter table public.profiles add constraint profiles_player_gender_check check(player_gender in ('guy','girl')) not valid; end if; if not exists(select 1 from pg_constraint where conname='profiles_role_check') then alter table public.profiles add constraint profiles_role_check check(role in ('user','admin')) not valid; end if; end $$;

create table if not exists public.messages(
  id uuid primary key default gen_random_uuid(), sender_id uuid not null references auth.users(id) on delete cascade,
  recipient_id uuid not null references auth.users(id) on delete cascade,
  body text not null check(length(body)>0 and length(body)<=2000), created_at timestamptz not null default now()
);
create table if not exists public.private_social_links(
  user_id uuid primary key references auth.users(id) on delete cascade, whatsapp_url text, instagram_url text, updated_at timestamptz not null default now()
);
create table if not exists public.connections(
  requester_id uuid not null references auth.users(id) on delete cascade, recipient_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check(status in ('pending','accepted','declined')), created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  primary key(requester_id,recipient_id), check(requester_id<>recipient_id)
);
create table if not exists public.reports(
  id uuid primary key default gen_random_uuid(), reporter_id uuid not null references auth.users(id) on delete cascade, target_user_id uuid not null references auth.users(id) on delete cascade,
  reason text not null, status text not null default 'open' check(status in ('open','reviewed','dismissed')), admin_note text, reviewed_at timestamptz, reviewed_by uuid references auth.users(id), created_at timestamptz not null default now()
);
alter table public.reports add column if not exists status text not null default 'open';
alter table public.reports add column if not exists admin_note text;
alter table public.reports add column if not exists reviewed_at timestamptz;
alter table public.reports add column if not exists reviewed_by uuid references auth.users(id);
create table if not exists public.blocks(
  blocker_id uuid not null references auth.users(id) on delete cascade, blocked_id uuid not null references auth.users(id) on delete cascade, created_at timestamptz not null default now(),
  primary key(blocker_id,blocked_id), check(blocker_id<>blocked_id)
);
create table if not exists public.passport_visits(
  user_id uuid not null references auth.users(id) on delete cascade, location text not null, visited_at timestamptz not null default now(), primary key(user_id,location)
);
create table if not exists public.purchases(
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, provider text not null,
  provider_order_id text unique, provider_payment_id text, webhook_event_id text unique, amount integer not null, currency text not null, status text not null, created_at timestamptz not null default now()
);
create table if not exists public.commerce_items(
  id text primary key, category text not null, title text not null, description text not null, provider text not null, url text not null, active boolean not null default true, sort_order integer not null default 0, created_at timestamptz not null default now()
);
insert into public.commerce_items(id,category,title,description,provider,url,sort_order) values
('clothes','RETRO CLOTHING','Denim / Streetwear','Open a current marketplace search for retro-style clothing.','Amazon India','https://www.amazon.in/s?k=retro+denim+streetwear',10),
('books','BOOK SHOP','Vintage & Chennai reads','Browse books inspired by the old-world reading corner.','Flipkart','https://www.flipkart.com/search?q=vintage+books',20),
('music','CD WORLD','2001 Tamil & Indian playlists','Jump from the CD shop into streaming search.','Spotify','https://open.spotify.com/search/2001%20Tamil%20songs',30),
('photo','PHOTO SHOP','Disposable-camera mood','A simple inspiration link for retro photography.','Pinterest','https://www.pinterest.com/search/pins/?q=disposable%20camera%20photography',40)
on conflict(id) do update set category=excluded.category,title=excluded.title,description=excluded.description,provider=excluded.provider,url=excluded.url,sort_order=excluded.sort_order;

create table if not exists public.notifications(
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  type text not null, title text not null, body text not null, related_user_id uuid references auth.users(id) on delete set null,
  read_at timestamptz, created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.messages enable row level security;
alter table public.private_social_links enable row level security;
alter table public.connections enable row level security;
alter table public.reports enable row level security;
alter table public.blocks enable row level security;
alter table public.passport_visits enable row level security;
alter table public.purchases enable row level security;
alter table public.commerce_items enable row level security;
alter table public.notifications enable row level security;

create or replace function public.is_admin()
returns boolean language sql security definer stable set search_path=public
as $$ select exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'); $$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

revoke select(whatsapp_url,instagram_url) on public.profiles from anon,authenticated;
drop policy if exists "profiles readable" on public.profiles;
create policy "profiles readable" on public.profiles for select to authenticated using(true);
drop policy if exists "own profile insert" on public.profiles;
create policy "own profile insert" on public.profiles for insert to authenticated with check((select auth.uid())=id);
drop policy if exists "own profile update" on public.profiles;
create policy "own profile update" on public.profiles for update to authenticated using((select auth.uid())=id) with check((select auth.uid())=id);

drop policy if exists "social links participants read" on public.private_social_links;
create policy "social links participants read" on public.private_social_links for select to authenticated using((select auth.uid())=user_id or exists(select 1 from public.connections c where c.status='accepted' and ((c.requester_id=(select auth.uid()) and c.recipient_id=user_id) or (c.recipient_id=(select auth.uid()) and c.requester_id=user_id))));
drop policy if exists "own social links write" on public.private_social_links;
create policy "own social links write" on public.private_social_links for all to authenticated using((select auth.uid())=user_id) with check((select auth.uid())=user_id);

drop policy if exists "connection participants read" on public.connections;
create policy "connection participants read" on public.connections for select to authenticated using((select auth.uid())=requester_id or (select auth.uid())=recipient_id);
drop policy if exists "send connection" on public.connections;
create policy "send connection" on public.connections for insert to authenticated with check((select auth.uid())=requester_id);
drop policy if exists "connection participants update" on public.connections;
create policy "connection participants update" on public.connections for update to authenticated using((select auth.uid())=requester_id or (select auth.uid())=recipient_id) with check((select auth.uid())=requester_id or (select auth.uid())=recipient_id);

drop policy if exists "message participants read" on public.messages;
create policy "message participants read" on public.messages for select to authenticated using((select auth.uid())=sender_id or (select auth.uid())=recipient_id);
drop policy if exists "send own messages" on public.messages;
create policy "send own messages" on public.messages for insert to authenticated with check((select auth.uid())=sender_id);

drop policy if exists "own reports" on public.reports;
create policy "own reports" on public.reports for insert to authenticated with check((select auth.uid())=reporter_id);
drop policy if exists "admin read reports" on public.reports;
create policy "admin read reports" on public.reports for select to authenticated using(public.is_admin());
drop policy if exists "admin update reports" on public.reports;
create policy "admin update reports" on public.reports for update to authenticated using(public.is_admin()) with check(public.is_admin());

drop policy if exists "own blocks" on public.blocks;
create policy "own blocks" on public.blocks for all to authenticated using((select auth.uid())=blocker_id) with check((select auth.uid())=blocker_id);
drop policy if exists "own visits" on public.passport_visits;
create policy "own visits" on public.passport_visits for all to authenticated using((select auth.uid())=user_id) with check((select auth.uid())=user_id);
drop policy if exists "own purchases" on public.purchases;
create policy "own purchases" on public.purchases for select to authenticated using((select auth.uid())=user_id);

drop policy if exists "commerce public read" on public.commerce_items;
create policy "commerce public read" on public.commerce_items for select to anon,authenticated using(active=true);
drop policy if exists "commerce admin write" on public.commerce_items;
create policy "commerce admin write" on public.commerce_items for all to authenticated using(public.is_admin()) with check(public.is_admin());

drop policy if exists "own notifications read" on public.notifications;
create policy "own notifications read" on public.notifications for select to authenticated using((select auth.uid())=user_id);
drop policy if exists "own notifications update" on public.notifications;
create policy "own notifications update" on public.notifications for update to authenticated using((select auth.uid())=user_id) with check((select auth.uid())=user_id);

create or replace function public.notify_connection_request() returns trigger language plpgsql security definer set search_path=public as $$
begin if new.status='pending' then insert into public.notifications(user_id,type,title,body,related_user_id) values(new.recipient_id,'connection_request','New connection request','Someone wants to connect with you in Dear Yesterday.',new.requester_id); end if; return new; end; $$;
drop trigger if exists trg_notify_connection_request on public.connections;
create trigger trg_notify_connection_request after insert on public.connections for each row execute function public.notify_connection_request();

create or replace function public.notify_new_message() returns trigger language plpgsql security definer set search_path=public as $$
begin insert into public.notifications(user_id,type,title,body,related_user_id) values(new.recipient_id,'message','New DearMail message','You have a new message waiting in DearMail.',new.sender_id); return new; end; $$;
drop trigger if exists trg_notify_new_message on public.messages;
create trigger trg_notify_new_message after insert on public.messages for each row execute function public.notify_new_message();

create or replace function public.touch_connection_updated_at() returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end; $$;
drop trigger if exists trg_touch_connection_updated_at on public.connections;
create trigger trg_touch_connection_updated_at before update on public.connections for each row execute function public.touch_connection_updated_at();

-- Realtime publication additions are idempotent.
do $$ begin
  if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='messages') then alter publication supabase_realtime add table public.messages; end if;
  if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='notifications') then alter publication supabase_realtime add table public.notifications; end if;
end $$;

-- IMPORTANT: after you create your own account, make it an administrator by running:
-- update public.profiles set role='admin' where id='YOUR-AUTH-USER-UUID';
