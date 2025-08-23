-- Faction goals table to track progress toward faction-specific mini-goals
CREATE TABLE faction_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  faction_type TEXT NOT NULL CHECK (faction_type IN ('provisioner', 'guardian', 'mystic', 'explorer')),
  goal_type TEXT NOT NULL,
  target_value INTEGER NOT NULL CHECK (target_value > 0),
  current_progress INTEGER DEFAULT 0 CHECK (current_progress >= 0),
  is_completed BOOLEAN DEFAULT FALSE,
  completed_turn INTEGER CHECK (completed_turn > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for efficient queries
CREATE INDEX idx_faction_goals_session_id ON faction_goals(session_id);
CREATE INDEX idx_faction_goals_player_id ON faction_goals(player_id);
CREATE INDEX idx_faction_goals_faction_type ON faction_goals(faction_type);
CREATE INDEX idx_faction_goals_goal_type ON faction_goals(goal_type);
CREATE INDEX idx_faction_goals_is_completed ON faction_goals(is_completed);

-- Unique constraint to prevent duplicate goals per player/session
ALTER TABLE faction_goals ADD CONSTRAINT unique_player_session_goal 
  UNIQUE (session_id, player_id, goal_type);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_faction_goals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER faction_goals_updated_at_trigger
  BEFORE UPDATE ON faction_goals
  FOR EACH ROW
  EXECUTE FUNCTION update_faction_goals_updated_at();

-- RLS policies
ALTER TABLE faction_goals ENABLE ROW LEVEL SECURITY;

-- Policy: Players can view goals for sessions they're in
CREATE POLICY "Players can view session goals" ON faction_goals
  FOR SELECT USING (
    session_id IN (
      SELECT session_id FROM session_players 
      WHERE player_id = auth.uid()::TEXT
    )
  );

-- Policy: Players can update their own goals
CREATE POLICY "Players can update own goals" ON faction_goals
  FOR UPDATE USING (player_id = auth.uid()::TEXT);

-- Policy: Service role can manage all goals
CREATE POLICY "Service role can manage goals" ON faction_goals
  FOR ALL USING (auth.role() = 'service_role');

-- Comments
COMMENT ON TABLE faction_goals IS 'Tracks progress toward faction-specific mini-goals for each player';
COMMENT ON COLUMN faction_goals.faction_type IS 'Type of faction this goal belongs to';
COMMENT ON COLUMN faction_goals.goal_type IS 'Specific type of goal (e.g., food_security, fortress_builder)';
COMMENT ON COLUMN faction_goals.target_value IS 'The value that needs to be reached to complete this goal';
COMMENT ON COLUMN faction_goals.current_progress IS 'Current progress toward the target value';
COMMENT ON COLUMN faction_goals.completed_turn IS 'Turn number when the goal was completed';