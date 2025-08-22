-- Create turn_results table
-- This table stores resolution outcomes for each turn in a game session

CREATE TABLE IF NOT EXISTS public.turn_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.game_sessions(id) ON DELETE CASCADE,
    turn_number INTEGER NOT NULL,
    results_data JSONB DEFAULT '{}'::jsonb,
    resolved_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT turn_results_turn_number_positive CHECK (turn_number >= 1),
    
    -- Ensure one result record per turn per session
    UNIQUE(session_id, turn_number)
);

-- Create indexes for optimal query performance
CREATE INDEX IF NOT EXISTS turn_results_session_id_idx ON public.turn_results(session_id);
CREATE INDEX IF NOT EXISTS turn_results_turn_number_idx ON public.turn_results(turn_number);
CREATE INDEX IF NOT EXISTS turn_results_resolved_at_idx ON public.turn_results(resolved_at);
CREATE INDEX IF NOT EXISTS turn_results_session_turn_idx ON public.turn_results(session_id, turn_number);

-- Create GIN index for JSONB results_data for efficient querying
CREATE INDEX IF NOT EXISTS turn_results_data_gin_idx ON public.turn_results USING GIN (results_data);

-- Enable Row Level Security
ALTER TABLE public.turn_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Players can view turn results for sessions they're participating in
CREATE POLICY "Players can view session turn results" ON public.turn_results
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.session_players 
            WHERE session_players.session_id = turn_results.session_id 
            AND session_players.player_id IN (
                SELECT id FROM public.players WHERE user_id = auth.uid()
            )
        )
    );

-- Only service role can modify turn results (admin/game engine only)
CREATE POLICY "Only service role can modify turn results" ON public.turn_results
    FOR ALL USING (auth.role() = 'service_role');