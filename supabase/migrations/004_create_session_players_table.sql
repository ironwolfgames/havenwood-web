-- Create session_players table (junction table)
-- This table links players to game sessions with their chosen factions

CREATE TABLE IF NOT EXISTS public.session_players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.game_sessions(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
    faction_id UUID NOT NULL REFERENCES public.factions(id) ON DELETE RESTRICT,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure each player can only join a session once
    UNIQUE(session_id, player_id),
    -- Ensure each faction can only be used once per session
    UNIQUE(session_id, faction_id)
);

-- Create indexes for optimal query performance
CREATE INDEX IF NOT EXISTS session_players_session_id_idx ON public.session_players(session_id);
CREATE INDEX IF NOT EXISTS session_players_player_id_idx ON public.session_players(player_id);
CREATE INDEX IF NOT EXISTS session_players_faction_id_idx ON public.session_players(faction_id);
CREATE INDEX IF NOT EXISTS session_players_joined_at_idx ON public.session_players(joined_at);

-- Enable Row Level Security
ALTER TABLE public.session_players ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Players can view session participants for sessions they're part of
CREATE POLICY "Players can view session participants" ON public.session_players
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.session_players sp2
            INNER JOIN public.players p ON sp2.player_id = p.id
            WHERE sp2.session_id = session_players.session_id
            AND p.user_id = auth.uid()
        )
    );

-- Players can join sessions (insert their own participation)
CREATE POLICY "Players can join sessions" ON public.session_players
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.players p
            WHERE p.id = session_players.player_id
            AND p.user_id = auth.uid()
        )
    );

-- Players can leave sessions (delete their own participation)
CREATE POLICY "Players can leave sessions" ON public.session_players
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.players p
            WHERE p.id = session_players.player_id
            AND p.user_id = auth.uid()
        )
    );

-- Players can update their faction choice in sessions they're part of
CREATE POLICY "Players can update their faction choice" ON public.session_players
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.players p
            WHERE p.id = session_players.player_id
            AND p.user_id = auth.uid()
        )
    );