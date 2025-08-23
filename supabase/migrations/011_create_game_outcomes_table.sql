-- Game outcomes table to store victory/defeat results
CREATE TABLE game_outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  outcome_type TEXT NOT NULL CHECK (outcome_type IN ('victory', 'defeat')),
  victory_type TEXT CHECK (victory_type IN ('project_completion', 'mini_goals')),
  defeat_reason TEXT CHECK (defeat_reason IN ('famine', 'instability', 'destruction', 'timeout')),
  final_turn INTEGER NOT NULL,
  faction_goals JSONB DEFAULT '{}',
  project_progress JSONB DEFAULT '{}', 
  survival_metrics JSONB DEFAULT '{}',
  session_duration INTERVAL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for efficient queries
CREATE INDEX idx_game_outcomes_session_id ON game_outcomes(session_id);
CREATE INDEX idx_game_outcomes_outcome_type ON game_outcomes(outcome_type);
CREATE INDEX idx_game_outcomes_victory_type ON game_outcomes(victory_type);
CREATE INDEX idx_game_outcomes_defeat_reason ON game_outcomes(defeat_reason);

-- RLS policies
ALTER TABLE game_outcomes ENABLE ROW LEVEL SECURITY;

-- Policy: Players can view outcomes for sessions they participated in
CREATE POLICY "Players can view session outcomes" ON game_outcomes
  FOR SELECT USING (
    session_id IN (
      SELECT session_id FROM session_players 
      WHERE player_id = auth.uid()::TEXT
    )
  );

-- Policy: Only service role can insert/update outcomes
CREATE POLICY "Service role can manage outcomes" ON game_outcomes
  FOR ALL USING (auth.role() = 'service_role');

-- Comments
COMMENT ON TABLE game_outcomes IS 'Stores the final results and analysis for completed game sessions';
COMMENT ON COLUMN game_outcomes.outcome_type IS 'Whether the game ended in victory or defeat';
COMMENT ON COLUMN game_outcomes.victory_type IS 'Type of victory achieved (if applicable)';
COMMENT ON COLUMN game_outcomes.defeat_reason IS 'Reason for defeat (if applicable)';
COMMENT ON COLUMN game_outcomes.faction_goals IS 'Individual faction achievement status at game end';
COMMENT ON COLUMN game_outcomes.project_progress IS 'Final shared project completion state';
COMMENT ON COLUMN game_outcomes.survival_metrics IS 'Final resource/stability levels that determined survival';