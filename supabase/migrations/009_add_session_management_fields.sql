-- Add missing fields for comprehensive session management
-- Based on issue requirements for lobby system

-- Add fields to game_sessions table
ALTER TABLE public.game_sessions 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS max_players INTEGER DEFAULT 4,
ADD COLUMN IF NOT EXISTS current_players INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS creator_id UUID REFERENCES public.players(id),
ADD COLUMN IF NOT EXISTS turn_timer_minutes INTEGER,
ADD COLUMN IF NOT EXISTS configuration JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- Add constraints for new fields
ALTER TABLE public.game_sessions 
ADD CONSTRAINT IF NOT EXISTS game_sessions_max_players_valid CHECK (max_players >= 2 AND max_players <= 4),
ADD CONSTRAINT IF NOT EXISTS game_sessions_current_players_valid CHECK (current_players >= 0 AND current_players <= max_players),
ADD CONSTRAINT IF NOT EXISTS game_sessions_turn_timer_valid CHECK (turn_timer_minutes IS NULL OR (turn_timer_minutes >= 2 AND turn_timer_minutes <= 10)),
ADD CONSTRAINT IF NOT EXISTS game_sessions_description_length CHECK (description IS NULL OR (char_length(description) >= 10 AND char_length(description) <= 500));

-- Add is_ready field to session_players table
ALTER TABLE public.session_players 
ADD COLUMN IF NOT EXISTS is_ready BOOLEAN DEFAULT FALSE;

-- Create indexes for new fields
CREATE INDEX IF NOT EXISTS game_sessions_creator_id_idx ON public.game_sessions(creator_id);
CREATE INDEX IF NOT EXISTS game_sessions_max_players_idx ON public.game_sessions(max_players);
CREATE INDEX IF NOT EXISTS game_sessions_started_at_idx ON public.game_sessions(started_at);
CREATE INDEX IF NOT EXISTS session_players_is_ready_idx ON public.session_players(is_ready);

-- Update RLS policies to include creator-based permissions
-- Allow creators to view and update their sessions even if they haven't joined yet
CREATE POLICY "Session creators can view their sessions" ON public.game_sessions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.players p
            WHERE p.id = game_sessions.creator_id
            AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Session creators can update their sessions" ON public.game_sessions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.players p
            WHERE p.id = game_sessions.creator_id
            AND p.user_id = auth.uid()
        )
    );