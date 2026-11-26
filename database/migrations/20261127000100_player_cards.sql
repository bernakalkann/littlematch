create table public.player_cards (
  user_id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null check (nickname ~ '^[[:alnum:]_]{3,20}$'),
  avatar_id text not null check (avatar_id ~ '^(girl|boy)-[1-5]$'),
  listed boolean not null default false,
  created_at timestamptz not null default now()
);

create unique index player_cards_nickname_idx
  on public.player_cards (lower(nickname));

alter table public.player_cards enable row level security;
revoke all on table public.player_cards from public, anon, authenticated;
grant select on table public.player_cards to authenticated;
grant insert (user_id, nickname, avatar_id), update (nickname, avatar_id, listed)
  on public.player_cards to authenticated;

create policy "registered_players_read_cards"
  on public.player_cards for select to authenticated
  using (
    not coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), true)
    and (listed or user_id = (select auth.uid()))
  );

create policy "registered_players_insert_own_card"
  on public.player_cards for insert to authenticated
  with check (
    not coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), true)
    and user_id = (select auth.uid())
  );

create policy "registered_players_update_own_card"
  on public.player_cards for update to authenticated
  using (
    not coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), true)
    and user_id = (select auth.uid())
  )
  with check (
    not coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), true)
    and user_id = (select auth.uid())
  );
