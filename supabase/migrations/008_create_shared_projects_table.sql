-- Create shared_projects table
-- This table stores the shared project definitions for cooperative gameplay

CREATE TABLE IF NOT EXISTS public.shared_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    stages JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT shared_projects_name_length CHECK (char_length(name) >= 3 AND char_length(name) <= 100),
    CONSTRAINT shared_projects_description_length CHECK (char_length(description) >= 10 AND char_length(description) <= 1000)
);

-- Create indexes for optimal query performance
CREATE INDEX IF NOT EXISTS shared_projects_name_idx ON public.shared_projects(name);
CREATE INDEX IF NOT EXISTS shared_projects_created_at_idx ON public.shared_projects(created_at);

-- Create GIN index for JSONB stages for efficient querying
CREATE INDEX IF NOT EXISTS shared_projects_stages_gin_idx ON public.shared_projects USING GIN (stages);

-- Enable Row Level Security
ALTER TABLE public.shared_projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- All authenticated users can read shared projects (they're public game data)
CREATE POLICY "Authenticated users can view shared projects" ON public.shared_projects
    FOR SELECT USING (auth.role() = 'authenticated');

-- Only service role can modify shared projects (admin only)
CREATE POLICY "Only service role can modify shared projects" ON public.shared_projects
    FOR ALL USING (auth.role() = 'service_role');