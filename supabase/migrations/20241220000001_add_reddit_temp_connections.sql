-- Create table for temporary Reddit connections during OAuth flow
CREATE TABLE IF NOT EXISTS reddit_temp_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  state TEXT UNIQUE NOT NULL,
  reddit_username TEXT NOT NULL,
  reddit_user_id TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  used BOOLEAN DEFAULT FALSE
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_reddit_temp_connections_state ON reddit_temp_connections(state);
CREATE INDEX IF NOT EXISTS idx_reddit_temp_connections_created_at ON reddit_temp_connections(created_at);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE reddit_temp_connections;

-- Clean up old temp connections (older than 1 hour)
CREATE OR REPLACE FUNCTION cleanup_old_reddit_temp_connections()
RETURNS void AS $$
BEGIN
  DELETE FROM reddit_temp_connections 
  WHERE created_at < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;
