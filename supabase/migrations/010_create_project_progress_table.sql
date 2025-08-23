-- Create project_progress table
-- This table tracks the progress of shared projects for each game session

CREATE TABLE IF NOT EXISTS public.project_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.game_sessions(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES public.shared_projects(id) ON DELETE CASCADE,
    current_stage INTEGER NOT NULL DEFAULT 1,
    stage_contributions JSONB NOT NULL DEFAULT '{}'::jsonb,
    completed_stages JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT project_progress_current_stage_valid CHECK (current_stage >= 1),
    CONSTRAINT project_progress_completion_consistency CHECK (
        (is_completed = TRUE AND completed_at IS NOT NULL) OR
        (is_completed = FALSE AND completed_at IS NULL)
    ),
    -- Ensure only one project per session
    CONSTRAINT project_progress_session_unique UNIQUE (session_id)
);

-- Create indexes for optimal query performance
CREATE INDEX IF NOT EXISTS project_progress_session_idx ON public.project_progress(session_id);
CREATE INDEX IF NOT EXISTS project_progress_project_idx ON public.project_progress(project_id);
CREATE INDEX IF NOT EXISTS project_progress_stage_idx ON public.project_progress(current_stage);
CREATE INDEX IF NOT EXISTS project_progress_completed_idx ON public.project_progress(is_completed);

-- Create GIN indexes for JSONB columns for efficient querying
CREATE INDEX IF NOT EXISTS project_progress_contributions_gin_idx ON public.project_progress USING GIN (stage_contributions);
CREATE INDEX IF NOT EXISTS project_progress_completed_stages_gin_idx ON public.project_progress USING GIN (completed_stages);

-- Create updated_at trigger for project_progress
CREATE TRIGGER update_project_progress_updated_at 
    BEFORE UPDATE ON public.project_progress
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.project_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Session participants can view project progress for their sessions
CREATE POLICY "Session participants can view project progress" ON public.project_progress
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.session_players sp
            INNER JOIN public.players p ON sp.player_id = p.id
            WHERE sp.session_id = project_progress.session_id
            AND p.user_id = auth.uid()
        )
    );

-- Session participants can create project progress (when selecting a project)
CREATE POLICY "Session participants can create project progress" ON public.project_progress
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.session_players sp
            INNER JOIN public.players p ON sp.player_id = p.id
            WHERE sp.session_id = project_progress.session_id
            AND p.user_id = auth.uid()
        )
    );

-- Session participants can update project progress (contributing resources)
CREATE POLICY "Session participants can update project progress" ON public.project_progress
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.session_players sp
            INNER JOIN public.players p ON sp.player_id = p.id
            WHERE sp.session_id = project_progress.session_id
            AND p.user_id = auth.uid()
        )
    );

-- Only service role can delete project progress (admin only)
CREATE POLICY "Only service role can delete project progress" ON public.project_progress
    FOR DELETE USING (auth.role() = 'service_role');