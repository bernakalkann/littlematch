alter table public.player_cards
  add column avatar_look text check (avatar_look ~ '^[0-5][0-4][0-4][0-3][0-4][0-4]$');

grant insert (avatar_look), update (avatar_look) on public.player_cards to authenticated;

create table public.result_posts (
  user_id uuid primary key references public.player_cards(user_id) on delete cascade,
  session_id uuid not null,
  character_id text not null,
  shared_at timestamptz not null default now(),
  foreign key (session_id, user_id)
    references public.test_sessions(id, user_id) on delete cascade
);

create index result_posts_shared_at_idx on public.result_posts (shared_at desc);
create index result_posts_session_user_idx on public.result_posts (session_id, user_id);
alter table public.result_posts enable row level security;
revoke all on public.result_posts from public, anon, authenticated;
grant select, insert, delete on public.result_posts to authenticated;
grant update (session_id, character_id, shared_at) on public.result_posts to authenticated;

create policy "registered_players_read_posts"
  on public.result_posts for select to authenticated
  using (not coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), true));

create policy "registered_players_publish_own_result"
  on public.result_posts for insert to authenticated
  with check (
    not coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), true)
    and user_id = (select auth.uid())
    and exists (
      select 1 from public.test_sessions s
      where s.id = result_posts.session_id and s.user_id = result_posts.user_id
        and s.status = 'completed' and s.character_id = result_posts.character_id
    )
  );

create policy "registered_players_replace_own_result"
  on public.result_posts for update to authenticated
  using (
    not coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), true)
    and user_id = (select auth.uid())
  )
  with check (
    not coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), true)
    and user_id = (select auth.uid())
    and exists (
      select 1 from public.test_sessions s
      where s.id = result_posts.session_id and s.user_id = result_posts.user_id
        and s.status = 'completed' and s.character_id = result_posts.character_id
    )
  );

create policy "registered_players_remove_own_result"
  on public.result_posts for delete to authenticated
  using (
    not coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), true)
    and user_id = (select auth.uid())
  );
