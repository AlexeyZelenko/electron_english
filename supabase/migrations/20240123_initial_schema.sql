-- Create words table
create table if not exists public.words (
    id bigint generated by default as identity primary key,
    user_id uuid references auth.users not null,
    english text not null,
    ukrainian text not null,
    transcription text,
    category text default 'General',
    collection text default 'Default',
    sentence_english text,
    sentence_ukrainian text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.words enable row level security;

-- Create policy to allow users to read their own words
create policy "Users can read their own words"
    on words for select
    using (auth.uid() = user_id);

-- Create policy to allow users to insert their own words
create policy "Users can insert their own words"
    on words for insert
    with check (auth.uid() = user_id);

-- Create policy to allow users to update their own words
create policy "Users can update their own words"
    on words for update
    using (auth.uid() = user_id);

-- Create policy to allow users to delete their own words
create policy "Users can delete their own words"
    on words for delete
    using (auth.uid() = user_id);

-- Create function to automatically update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger handle_updated_at
    before update on words
    for each row
    execute procedure public.handle_updated_at();