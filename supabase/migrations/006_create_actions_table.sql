-- Create actions table
-- This table stores player actions with flexible parameters for turn-based gameplay

CREATE TABLE IF NOT EXISTS public.actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.game_sessions(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
    turn_number INTEGER NOT NULL,
    action_type TEXT NOT NULL,
    action_data JSONB DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'submitted',
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT actions_turn_number_positive CHECK (turn_number >= 1),
    CONSTRAINT actions_type_valid CHECK (action_type IN (
        'gather', 'build', 'research', 'protect', 'trade', 'special'
    )),
    CONSTRAINT actions_status_valid CHECK (status IN ('submitted', 'resolved'))
);

-- Create indexes for optimal query performance
CREATE INDEX IF NOT EXISTS actions_session_id_idx ON public.actions(session_id);
CREATE INDEX IF NOT EXISTS actions_player_id_idx ON public.actions(player_id);
CREATE INDEX IF NOT EXISTS actions_turn_number_idx ON public.actions(turn_number);
CREATE INDEX IF NOT EXISTS actions_action_type_idx ON public.actions(action_type);
CREATE INDEX IF NOT EXISTS actions_status_idx ON public.actions(status);
CREATE INDEX IF NOT EXISTS actions_submitted_at_idx ON public.actions(submitted_at);
CREATE INDEX IF NOT EXISTS actions_session_turn_idx ON public.actions(session_id, turn_number);
CREATE INDEX IF NOT EXISTS actions_session_player_turn_idx ON public.actions(session_id, player_id, turn_number);

-- Create GIN index for JSONB action_data for efficient querying
CREATE INDEX IF NOT EXISTS actions_data_gin_idx ON public.actions USING GIN (action_data);

-- Enable Row Level Security
ALTER TABLE public.actions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Players can view actions for sessions they're participating in
CREATE POLICY "Players can view session actions" ON public.actions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.session_players 
            WHERE session_players.session_id = actions.session_id 
            AND session_players.player_id IN (
                SELECT id FROM public.players WHERE user_id = auth.uid()
            )
        )
    );

-- Players can insert their own actions
CREATE POLICY "Players can create own actions" ON public.actions
    FOR INSERT WITH CHECK (
        player_id IN (
            SELECT id FROM public.players WHERE user_id = auth.uid()
        )
        AND EXISTS (
            SELECT 1 FROM public.session_players 
            WHERE session_players.session_id = actions.session_id 
            AND session_players.player_id = actions.player_id
        )
    );

-- Players can update their own actions (only if still submitted)
CREATE POLICY "Players can update own submitted actions" ON public.actions
    FOR UPDATE USING (
        player_id IN (
            SELECT id FROM public.players WHERE user_id = auth.uid()
        )
        AND status = 'submitted'
    ) WITH CHECK (
        player_id IN (
            SELECT id FROM public.players WHERE user_id = auth.uid()
        )
        AND status IN ('submitted', 'resolved')
    );

-- Only service role can delete actions (admin only) 
CREATE POLICY "Only service role can delete actions" ON public.actions
    FOR DELETE USING (auth.role() = 'service_role');