CREATE TABLE IF NOT EXISTS brain_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  session_key TEXT NOT NULL UNIQUE,
  context JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_brain_sessions_user_id
  ON brain_sessions (user_id);

CREATE INDEX IF NOT EXISTS idx_brain_sessions_session_key
  ON brain_sessions (session_key);
