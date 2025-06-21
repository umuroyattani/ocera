-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add Reddit connection fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS reddit_connected BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS reddit_username TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS reddit_access_token TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS reddit_refresh_token TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS reddit_token_expires_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS reddit_connected_at TIMESTAMP WITH TIME ZONE;

-- Enable realtime for users table (only if not already added)
DO $
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'users'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE users;
    END IF;
END $;
