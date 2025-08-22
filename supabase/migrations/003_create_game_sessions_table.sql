-- Create game_sessions table
-- This table stores game session information

CREATE TABLE IF NOT EXISTS public.game_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'waiting',
    current_turn INTEGER NOT NULL DEFAULT 1,
    max_turns INTEGER NOT NULL DEFAULT 7,
    shared_project_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT game_sessions_name_length CHECK (char_length(name) >= 3 AND char_length(name) <= 100),
    CONSTRAINT game_sessions_status_valid CHECK (status IN ('waiting', 'active', 'completed')),
    CONSTRAINT game_sessions_current_turn_valid CHECK (current_turn >= 1),
    CONSTRAINT game_sessions_max_turns_valid CHECK (max_turns >= 1 AND max_turns <= 20),
    CONSTRAINT game_sessions_turn_order_valid CHECK (current_turn <= max_turns)
);

-- Create indexes for optimal query performance
CREATE INDEX IF NOT EXISTS game_sessions_status_idx ON public.game_sessions(status);
CREATE INDEX IF NOT EXISTS game_sessions_created_at_idx ON public.game_sessions(created_at);
CREATE INDEX IF NOT EXISTS game_sessions_current_turn_idx ON public.game_sessions(current_turn);

-- Create updated_at trigger for game_sessions
CREATE TRIGGER update_game_sessions_updated_at 
    BEFORE UPDATE ON public.game_sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Players can view sessions they're participating in (via session_players junction)
CREATE POLICY "Players can view their game sessions" ON public.game_sessions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.session_players sp
            INNER JOIN public.players p ON sp.player_id = p.id
            WHERE sp.session_id = game_sessions.id
            AND p.user_id = auth.uid()
        )
    );

-- Players can create new game sessions
CREATE POLICY "Authenticated users can create sessions" ON public.game_sessions
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Only session participants can update sessions (will be refined later with more specific rules)
CREATE POLICY "Session participants can update sessions" ON public.game_sessions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.session_players sp
            INNER JOIN public.players p ON sp.player_id = p.id
            WHERE sp.session_id = game_sessions.id
            AND p.user_id = auth.uid()
        )
    );