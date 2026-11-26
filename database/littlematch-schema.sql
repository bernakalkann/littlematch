-- LittleMatch database blueprint.
-- Apply this only to a dedicated LittleMatch Supabase project.
-- The existing fixCampus project must not be reused for this schema.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  anonymous_name text,
  locale text not null default 'tr' check (locale in ('tr', 'en')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.test_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  locale text not null check (locale in ('tr', 'en')),
  status text not null default 'in_progress'
    check (status in ('in_progress', 'completed')),
  character_id text check (
    character_id is null or character_id in (
      'fox', 'cat', 'dog', 'rabbit', 'owl', 'bear', 'otter', 'hedgehog'
    )
  ),
  scores jsonb,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (id, user_id)
);

create index if not exists test_sessions_user_id_idx
  on public.test_sessions (user_id);

create table if not exists public.test_answers (
  id bigint generated always as identity primary key,
  session_id uuid not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null,
  option_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (session_id, question_id),
  foreign key (session_id, user_id)
    references public.test_sessions(id, user_id)
    on delete cascade
);

create index if not exists test_answers_user_id_idx
  on public.test_answers (user_id);

create index if not exists test_answers_session_id_idx
  on public.test_answers (session_id);

create table if not exists public.character_results (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null unique,
  user_id uuid not null references auth.users(id) on delete cascade,
  character_id text not null check (
    character_id in (
      'fox', 'cat', 'dog', 'rabbit', 'owl', 'bear', 'otter', 'hedgehog'
    )
  ),
  scores jsonb not null,
  created_at timestamptz not null default now(),
  foreign key (session_id, user_id)
    references public.test_sessions(id, user_id)
    on delete cascade
);

create index if not exists character_results_user_id_idx
  on public.character_results (user_id);

create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  creator_session_id uuid not null,
  invitee_id uuid references auth.users(id) on delete set null,
  invitee_session_id uuid,
  code_hash text not null unique,
  status text not null default 'open'
    check (status in ('open', 'claimed', 'completed', 'expired', 'cancelled')),
  expires_at timestamptz not null default (now() + interval '14 days'),
  created_at timestamptz not null default now(),
  claimed_at timestamptz,
  completed_at timestamptz,
  foreign key (creator_session_id, creator_id)
    references public.test_sessions(id, user_id)
    on delete cascade,
  foreign key (invitee_session_id, invitee_id)
    references public.test_sessions(id, user_id)
    on delete set null
);

create index if not exists invitations_creator_id_idx
  on public.invitations (creator_id);

create index if not exists invitations_invitee_id_idx
  on public.invitations (invitee_id);

create table if not exists public.comparison_results (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null unique
    references public.invitations(id) on delete cascade,
  user_a_id uuid not null references auth.users(id) on delete cascade,
  user_b_id uuid not null references auth.users(id) on delete cascade,
  overall_similarity smallint not null check (overall_similarity between 0 and 100),
  dimension_similarity jsonb not null,
  common_answers jsonb not null default '[]'::jsonb,
  different_answers jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists comparison_results_user_a_id_idx
  on public.comparison_results (user_a_id);

create index if not exists comparison_results_user_b_id_idx
  on public.comparison_results (user_b_id);

alter table public.profiles enable row level security;
alter table public.test_sessions enable row level security;
alter table public.test_answers enable row level security;
alter table public.character_results enable row level security;
alter table public.invitations enable row level security;
alter table public.comparison_results enable row level security;

revoke all on table public.profiles from anon, authenticated;
revoke all on table public.test_sessions from anon, authenticated;
revoke all on table public.test_answers from anon, authenticated;
revoke all on table public.character_results from anon, authenticated;
revoke all on table public.invitations from anon, authenticated;
revoke all on table public.comparison_results from anon, authenticated;

grant select, insert, update, delete on table public.profiles to authenticated;
grant select, insert, update, delete on table public.test_sessions to authenticated;
grant select, insert, update, delete on table public.test_answers to authenticated;
grant select, insert, update, delete on table public.character_results to authenticated;
grant select on table public.invitations to authenticated;
grant select on table public.comparison_results to authenticated;
grant usage on sequence public.test_answers_id_seq to authenticated;

grant select on table public.test_sessions, public.test_answers, public.character_results
  to service_role;
grant select, insert, update on table public.invitations, public.comparison_results
  to service_role;

-- Supabase's optional event trigger needs no Data API access.
do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
  end if;
end;
$$;

create policy "profiles_select_own"
on public.profiles for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "profiles_insert_own"
on public.profiles for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "profiles_update_own"
on public.profiles for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "profiles_delete_own"
on public.profiles for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "test_sessions_select_own"
on public.test_sessions for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "test_sessions_insert_own"
on public.test_sessions for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "test_sessions_update_own"
on public.test_sessions for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "test_sessions_delete_own"
on public.test_sessions for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "test_answers_select_own"
on public.test_answers for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "test_answers_insert_own"
on public.test_answers for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "test_answers_update_own"
on public.test_answers for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "test_answers_delete_own"
on public.test_answers for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "character_results_select_own"
on public.character_results for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "character_results_insert_own"
on public.character_results for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "character_results_update_own"
on public.character_results for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "character_results_delete_own"
on public.character_results for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "invitations_select_participant"
on public.invitations for select
to authenticated
using (
  (select auth.uid()) = creator_id
  or (select auth.uid()) = invitee_id
);

create policy "comparison_results_select_participant"
on public.comparison_results for select
to authenticated
using (
  (select auth.uid()) = user_a_id
  or (select auth.uid()) = user_b_id
);

comment on table public.invitations is
  'Creation and claiming are server-controlled. Only the stored SHA-256 hash of the invitation code is persisted.';

comment on table public.comparison_results is
  'Generated only after both participants have completed their tests. Percentages represent answer/profile similarity, not relationship-success predictions.';
