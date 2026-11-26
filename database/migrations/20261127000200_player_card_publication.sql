alter policy "registered_players_update_own_card"
  on public.player_cards
  with check (
    not coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), true)
    and user_id = (select auth.uid())
    and (
      not listed or exists (
        select 1 from public.test_sessions
        where test_sessions.user_id = (select auth.uid())
          and test_sessions.status = 'completed'
      )
    )
  );
