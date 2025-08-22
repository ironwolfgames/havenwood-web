-- Create resources table
-- This table tracks resource quantities per faction per turn in game sessions

CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.game_sessions(id) ON DELETE CASCADE,
    faction_id UUID NOT NULL REFERENCES public.factions(id) ON DELETE RESTRICT,
    resource_type TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    turn_number INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT resources_quantity_non_negative CHECK (quantity >= 0),
    CONSTRAINT resources_turn_number_positive CHECK (turn_number >= 1),
    CONSTRAINT resources_type_valid CHECK (resource_type IN (
        'food', 'timber', 'fiber', 
        'protection_tokens', 'stability_tokens',
        'magic_crystals', 'insight_tokens',
        'infrastructure_tokens', 'project_progress'
    )),
    
    -- Ensure one record per faction per resource type per turn per session
    UNIQUE(session_id, faction_id, resource_type, turn_number)
);

-- Create indexes for optimal query performance
CREATE INDEX IF NOT EXISTS resources_session_id_idx ON public.resources(session_id);
CREATE INDEX IF NOT EXISTS resources_faction_id_idx ON public.resources(faction_id);
CREATE INDEX IF NOT EXISTS resources_type_idx ON public.resources(resource_type);
CREATE INDEX IF NOT EXISTS resources_turn_number_idx ON public.resources(turn_number);
CREATE INDEX IF NOT EXISTS resources_created_at_idx ON public.resources(created_at);
CREATE INDEX IF NOT EXISTS resources_session_turn_idx ON public.resources(session_id, turn_number);

-- Create updated_at trigger
CREATE TRIGGER update_resources_updated_at 
    BEFORE UPDATE ON public.resources
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Players can view resources for sessions they're participating in
CREATE POLICY "Players can view session resources" ON public.resources
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.session_players 
            WHERE session_players.session_id = resources.session_id 
            AND session_players.player_id IN (
                SELECT id FROM public.players WHERE user_id = auth.uid()
            )
        )
    );

-- Players can update resources for their own faction in sessions they're in
CREATE POLICY "Players can update own faction resources" ON public.resources
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.session_players 
            WHERE session_players.session_id = resources.session_id 
            AND session_players.faction_id = resources.faction_id
            AND session_players.player_id IN (
                SELECT id FROM public.players WHERE user_id = auth.uid()
            )
        )
    );

-- Players can insert resources for their own faction in sessions they're in
CREATE POLICY "Players can create own faction resources" ON public.resources
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.session_players 
            WHERE session_players.session_id = resources.session_id 
            AND session_players.faction_id = resources.faction_id
            AND session_players.player_id IN (
                SELECT id FROM public.players WHERE user_id = auth.uid()
            )
        )
    );

-- Only service role can delete resources (admin only)
CREATE POLICY "Only service role can delete resources" ON public.resources
    FOR DELETE USING (auth.role() = 'service_role');