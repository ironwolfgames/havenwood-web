-- Create players table
-- This table stores basic player information linked to auth users

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT players_username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 50),
    CONSTRAINT players_username_format CHECK (username ~ '^[a-zA-Z0-9_-]+$')
);

-- Create indexes for optimal query performance
CREATE INDEX IF NOT EXISTS players_user_id_idx ON public.players(user_id);
CREATE INDEX IF NOT EXISTS players_username_idx ON public.players(username);
CREATE INDEX IF NOT EXISTS players_created_at_idx ON public.players(created_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language plpgsql;

CREATE TRIGGER update_players_updated_at 
    BEFORE UPDATE ON public.players
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Players can view their own data
CREATE POLICY "Players can view own profile" ON public.players
    FOR SELECT USING (auth.uid() = user_id);

-- Players can update their own data
CREATE POLICY "Players can update own profile" ON public.players
    FOR UPDATE USING (auth.uid() = user_id);

-- Players can insert their own profile
CREATE POLICY "Players can create own profile" ON public.players
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Players can delete their own profile
CREATE POLICY "Players can delete own profile" ON public.players
    FOR DELETE USING (auth.uid() = user_id);