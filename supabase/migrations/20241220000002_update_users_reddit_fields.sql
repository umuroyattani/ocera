-- Update users table to store Reddit account information persistently
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS reddit_user_id TEXT,
ADD COLUMN IF NOT EXISTS display_name TEXT,
ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive',
ADD COLUMN IF NOT EXISTS subscription_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMPTZ;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_reddit_user_id ON users(reddit_user_id);
CREATE INDEX IF NOT EXISTS idx_users_subscription_plan ON users(subscription_plan);