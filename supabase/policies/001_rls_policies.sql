alter table profiles enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;

create policy "Users can view their own profile"
on profiles
for select
using (auth.uid()::text = id::text);

create policy "Users can manage their own conversations"
on conversations
for all
using (auth.uid() = profile_id)
with check (auth.uid() = profile_id);

create policy "Users can manage their own messages"
on messages
for all
using (
  exists (
    select 1 from conversations c where c.id = conversation_id and c.profile_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from conversations c where c.id = conversation_id and c.profile_id = auth.uid()
  )
);
