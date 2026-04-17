-- Site Settings Table
-- Global site settings managed by admins (logo, name, contact, social links)

CREATE TABLE IF NOT EXISTS site_settings (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Setting Key and Value
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  "group" TEXT NOT NULL, -- 'general', 'contact', 'social'

  -- Metadata
  label TEXT NOT NULL,   -- Display name for admin UI
  type TEXT NOT NULL,    -- 'text', 'url', 'email', 'textarea', 'tel'

  -- Timestamps
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create unique index on key
CREATE UNIQUE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);

-- Create index on group for filtered queries
CREATE INDEX IF NOT EXISTS idx_site_settings_group ON site_settings("group");

-- Enable Row Level Security
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Admin-only read access
CREATE POLICY "Admins can read all settings" ON site_settings
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Admin-only update access
CREATE POLICY "Admins can update settings" ON site_settings
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Admin-only insert access (for initialization)
CREATE POLICY "Admins can insert settings" ON site_settings
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Comments for documentation
COMMENT ON TABLE site_settings IS 'Global site settings managed by admins';
COMMENT ON COLUMN site_settings.key IS 'Unique setting key (e.g., site_name, logo_url)';
COMMENT ON COLUMN site_settings.value IS 'Setting value stored as JSONB';
COMMENT ON COLUMN site_settings."group" IS 'Settings group: general, contact, or social';
COMMENT ON COLUMN site_settings.label IS 'Human-readable label for admin UI';
COMMENT ON COLUMN site_settings.type IS 'Input type for admin UI: text, url, email, textarea, tel';

-- Insert default settings
INSERT INTO site_settings (key, value, "group", label, type) VALUES
  -- General Settings
  ('site_name', '"Dubai Property IQ"', 'general', 'Site Name', 'text'),
  ('logo_url', '"/logo.png"', 'general', 'Logo URL', 'url'),

  -- Contact Settings
  ('email', '"info@dubaipropertyiq.com"', 'contact', 'Email Address', 'email'),
  ('phone', '"+971 4 123 4567"', 'contact', 'Phone Number', 'tel'),
  ('whatsapp', '"+971 50 123 4567"', 'contact', 'WhatsApp Number', 'tel'),
  ('address', '"Dubai Marina, Dubai, UAE"', 'contact', 'Address', 'textarea'),

  -- Social Settings
  ('facebook', '"https://facebook.com"', 'social', 'Facebook URL', 'url'),
  ('instagram', '"https://instagram.com"', 'social', 'Instagram URL', 'url'),
  ('linkedin', '"https://linkedin.com"', 'social', 'LinkedIn URL', 'url'),
  ('twitter', '"https://twitter.com"', 'social', 'Twitter/X URL', 'url')

ON CONFLICT (key) DO NOTHING;
