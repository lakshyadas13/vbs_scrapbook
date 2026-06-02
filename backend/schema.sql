-- Supabase Schema for Doodly Scrapbook App (Production Edition)

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ==========================================
-- 1. TABLES DEFINITIONS (Dependencies first)
-- ==========================================

-- 1.1 COUPLES TABLE
create table public.couples (
    id uuid primary key default gen_random_uuid(),
    created_at timestamp with time zone default now()
);

-- 1.2 PROFILES TABLE
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    display_name text not null,
    avatar_url text,
    role text check (role in ('lakshya', 'partner')),
    couple_id uuid references public.couples(id) on delete set null,
    invite_code text unique not null,
    created_at timestamp with time zone default now()
);

-- 1.3 COUPLE SETTINGS TABLE
create table public.couple_settings (
    couple_id uuid references public.couples(id) on delete cascade primary key,
    anniversary_date date not null default '2025-04-01',
    partner1_name text default 'Lakshya',
    partner2_name text default 'Vishakha',
    updated_at timestamp with time zone default now()
);

-- 1.4 MOODS TABLE (Realtime)
create table public.moods (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users on delete cascade unique,
    mood_type text not null check (mood_type in ('in_love', 'miss_you', 'dreaming', 'celeb')),
    created_at timestamp with time zone default now()
);

-- 1.5 LOVE TAPS TABLE (Realtime)
create table public.love_taps (
    user_id uuid references auth.users on delete cascade primary key,
    count integer not null default 0,
    updated_at timestamp with time zone default now()
);

-- 1.6 GOOD THINGS TABLE (Realtime)
create table public.good_things (
    id uuid primary key default gen_random_uuid(),
    couple_id uuid references public.couples(id) on delete cascade not null,
    user_id uuid references auth.users on delete cascade not null,
    title text not null,
    description text,
    time text,
    tags text[] default '{}'::text[],
    image_url text,
    created_at timestamp with time zone default now()
);

-- 1.7 OOPSIES TABLE (Realtime)
create table public.oopsies (
    id uuid primary key default gen_random_uuid(),
    couple_id uuid references public.couples(id) on delete cascade not null,
    user_id uuid references auth.users on delete cascade not null,
    title text not null,
    description text,
    tags text[] default '{}'::text[],
    image_url text,
    status text default 'pending' check (status in ('pending', 'promised')),
    created_at timestamp with time zone default now()
);

-- 1.8 PLANS TABLE (Realtime)
create table public.plans (
    id uuid primary key default gen_random_uuid(),
    couple_id uuid references public.couples(id) on delete cascade not null,
    title text not null,
    description text,
    time text,
    image_url text,
    tags text[] default '{}'::text[],
    date date not null default current_date,
    created_at timestamp with time zone default now()
);

-- 1.9 PLANS CHECKLIST TABLE (Realtime)
create table public.plans_checklist (
    id uuid primary key default gen_random_uuid(),
    couple_id uuid references public.couples(id) on delete cascade not null,
    task text not null,
    is_completed boolean default false not null,
    created_at timestamp with time zone default now()
);

-- ==========================================
-- 2. ROW LEVEL SECURITY (RLS) & POLICIES
-- ==========================================

-- 2.1 Couples Policies
alter table public.couples enable row level security;

create policy "Allow couple members to read couples"
    on public.couples for select
    using (
        id in (
            select couple_id from public.profiles where id = auth.uid()
        )
    );

-- 2.2 Profiles Policies
alter table public.profiles enable row level security;

create policy "Allow authenticated read to profiles"
    on public.profiles for select
    using (auth.role() = 'authenticated');

create policy "Allow users to update their own profile"
    on public.profiles for update
    using (auth.uid() = id);

create policy "Allow users to insert their own profile"
    on public.profiles for insert
    with check (auth.uid() = id);

-- 2.3 Couple Settings Policies
alter table public.couple_settings enable row level security;

create policy "Allow couple members to manage couple settings"
    on public.couple_settings for all
    using (
        couple_id in (
            select couple_id from public.profiles where id = auth.uid()
        )
    );

-- 2.4 Moods Policies
alter table public.moods enable row level security;

create policy "Allow couple members to read moods"
    on public.moods for select
    using (
        user_id in (
            select id from public.profiles where couple_id = (
                select couple_id from public.profiles where id = auth.uid()
            )
        )
    );

create policy "Allow users to manage their own mood"
    on public.moods for all
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- 2.5 Love Taps Policies
alter table public.love_taps enable row level security;

create policy "Allow couple members to read love taps"
    on public.love_taps for select
    using (
        user_id in (
            select id from public.profiles where couple_id = (
                select couple_id from public.profiles where id = auth.uid()
            )
        )
    );

create policy "Allow users to update their own love taps"
    on public.love_taps for all
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- 2.6 Good Things Policies
alter table public.good_things enable row level security;

create policy "Allow couple members to read good things"
    on public.good_things for select
    using (
        couple_id in (
            select couple_id from public.profiles where id = auth.uid()
        )
    );

create policy "Allow couple members to manage good things"
    on public.good_things for all
    using (
        couple_id in (
            select couple_id from public.profiles where id = auth.uid()
        )
    )
    with check (
        couple_id in (
            select couple_id from public.profiles where id = auth.uid()
        )
    );

-- 2.7 Oopsies Policies
alter table public.oopsies enable row level security;

create policy "Allow couple members to read oopsies"
    on public.oopsies for select
    using (
        couple_id in (
            select couple_id from public.profiles where id = auth.uid()
        )
    );

create policy "Allow couple members to manage oopsies"
    on public.oopsies for all
    using (
        couple_id in (
            select couple_id from public.profiles where id = auth.uid()
        )
    )
    with check (
        couple_id in (
            select couple_id from public.profiles where id = auth.uid()
        )
    );

-- 2.8 Plans Policies
alter table public.plans enable row level security;

create policy "Allow couple members to read plans"
    on public.plans for select
    using (
        couple_id in (
            select couple_id from public.profiles where id = auth.uid()
        )
    );

create policy "Allow couple members to manage plans"
    on public.plans for all
    using (
        couple_id in (
            select couple_id from public.profiles where id = auth.uid()
        )
    )
    with check (
        couple_id in (
            select couple_id from public.profiles where id = auth.uid()
        )
    );

-- 2.9 Plans Checklist Policies
alter table public.plans_checklist enable row level security;

create policy "Allow couple members to read plans_checklist"
    on public.plans_checklist for select
    using (
        couple_id in (
            select couple_id from public.profiles where id = auth.uid()
        )
    );

create policy "Allow couple members to manage plans_checklist"
    on public.plans_checklist for all
    using (
        couple_id in (
            select couple_id from public.profiles where id = auth.uid()
        )
    )
    with check (
        couple_id in (
            select couple_id from public.profiles where id = auth.uid()
        )
    );

-- ==========================================
-- 3. REALTIME PUBLICATIONS
-- ==========================================
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime for table 
    public.moods, 
    public.love_taps, 
    public.good_things, 
    public.oopsies, 
    public.plans, 
    public.plans_checklist;
commit;

-- ==========================================
-- 4. FUNCTIONS & TRIGGERS
-- ==========================================

-- 4.1 User Registration Trigger Function
create or replace function public.handle_new_user()
returns trigger as $$
declare
  generated_code text;
  code_exists boolean;
begin
  loop
    generated_code := upper(substring(replace(gen_random_uuid()::text, '-', '') from 1 for 6));
    select exists(select 1 from public.profiles where invite_code = generated_code) into code_exists;
    exit when not code_exists;
  end loop;

  insert into public.profiles (id, display_name, role, invite_code)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', 'Cutie'),
    coalesce(new.raw_user_meta_data->>'role', 'partner'),
    generated_code
  );

  insert into public.love_taps (user_id, count)
  values (new.id, 0);

  insert into public.moods (user_id, mood_type)
  values (new.id, 'in_love');

  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4.2 Couple Linking Transaction Function (RPC)
create or replace function public.link_couples(partner_code text, user_role text)
returns json as $$
declare
  current_user_id uuid;
  partner_profile record;
  new_couple_id uuid;
  role_to_set text;
  partner_role_to_set text;
begin
  current_user_id := auth.uid();
  if current_user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- Find partner by invite code
  select * into partner_profile from public.profiles where upper(invite_code) = upper(partner_code);
  if not found then
    raise exception 'Invalid invite code';
  end if;

  if partner_profile.id = current_user_id then
    raise exception 'Cannot link with yourself';
  end if;

  if partner_profile.couple_id is not null then
    raise exception 'Partner is already linked to a couple';
  end if;

  -- Check if current user is already linked
  if (select couple_id from public.profiles where id = current_user_id) is not null then
    raise exception 'You are already linked to a couple';
  end if;

  -- Create new couple
  insert into public.couples default values returning id into new_couple_id;

  -- Define roles
  if user_role = 'lakshya' then
    role_to_set := 'lakshya';
    partner_role_to_set := 'partner';
  else
    role_to_set := 'partner';
    partner_role_to_set := 'lakshya';
  end if;

  -- Update current user profile
  update public.profiles 
  set couple_id = new_couple_id, role = role_to_set 
  where id = current_user_id;

  -- Update partner profile
  update public.profiles 
  set couple_id = new_couple_id, role = partner_role_to_set 
  where id = partner_profile.id;

  -- Insert default couple settings
  insert into public.couple_settings (couple_id, partner1_name, partner2_name)
  values (
    new_couple_id,
    case when role_to_set = 'lakshya' then (select display_name from public.profiles where id = current_user_id) else partner_profile.display_name end,
    case when role_to_set = 'partner' then (select display_name from public.profiles where id = current_user_id) else partner_profile.display_name end
  );

  return json_build_object(
    'success', true, 
    'couple_id', new_couple_id,
    'role', role_to_set
  );
end;
$$ language plpgsql security definer;
