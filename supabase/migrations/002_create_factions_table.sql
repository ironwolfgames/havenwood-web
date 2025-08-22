-- Create factions table
-- This table stores the four main factions and their system types

CREATE TABLE IF NOT EXISTS public.factions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    system_type TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT factions_name_length CHECK (char_length(name) >= 3 AND char_length(name) <= 100),
    CONSTRAINT factions_description_length CHECK (char_length(description) >= 10 AND char_length(description) <= 1000),
    CONSTRAINT factions_system_type_valid CHECK (system_type IN ('provisioner', 'guardian', 'mystic', 'explorer'))
);

-- Create indexes for optimal query performance
CREATE INDEX IF NOT EXISTS factions_name_idx ON public.factions(name);
CREATE INDEX IF NOT EXISTS factions_system_type_idx ON public.factions(system_type);
CREATE INDEX IF NOT EXISTS factions_created_at_idx ON public.factions(created_at);

-- Enable Row Level Security
ALTER TABLE public.factions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- All authenticated users can read factions (they're public game data)
CREATE POLICY "Authenticated users can view factions" ON public.factions
    FOR SELECT USING (auth.role() = 'authenticated');

-- Only service role can insert/update/delete factions (admin only)
CREATE POLICY "Only service role can modify factions" ON public.factions
    FOR ALL USING (auth.role() = 'service_role');