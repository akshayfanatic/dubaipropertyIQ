-- Create developers table (only if not exists)
CREATE TABLE IF NOT EXISTS developers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  description TEXT,
  website_url TEXT,

  -- Trust Score Components (1-5 scale per PRD)
  delivery_timeliness_score INTEGER DEFAULT 1 CHECK (delivery_timeliness_score >= 1 AND delivery_timeliness_score <= 5),
  service_charge_score INTEGER DEFAULT 1 CHECK (service_charge_score >= 1 AND service_charge_score <= 5),
  build_quality_score INTEGER DEFAULT 1 CHECK (build_quality_score >= 1 AND build_quality_score <= 5),
  after_sales_score INTEGER DEFAULT 1 CHECK (after_sales_score >= 1 AND after_sales_score <= 5),

  -- Stats
  total_projects INTEGER DEFAULT 0,
  completed_projects INTEGER DEFAULT 0,
  ongoing_projects INTEGER DEFAULT 0,
  years_active INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add developer_id to properties table
ALTER TABLE properties ADD COLUMN IF NOT EXISTS developer_id UUID REFERENCES developers(id) ON DELETE SET NULL;

-- Create index for slug lookups
CREATE INDEX IF NOT EXISTS idx_developers_slug ON developers(slug);

-- Create index for properties developer lookup (only if column exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='properties' AND column_name='developer_id') THEN
    CREATE INDEX IF NOT EXISTS idx_properties_developer_id ON properties(developer_id);
  END IF;
END $$;

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for developers table
DROP TRIGGER IF EXISTS update_developers_updated_at ON developers;
CREATE TRIGGER update_developers_updated_at
  BEFORE UPDATE ON developers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for developer logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('developer-logos', 'developer-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist (from previous runs)
DROP POLICY IF EXISTS "Public read access for developer logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload developer logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update developer logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete developer logos" ON storage.objects;

-- Storage policy for developer logos (public read)
CREATE POLICY "Public read access for developer logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'developer-logos');

-- Storage policy for authenticated uploads
CREATE POLICY "Authenticated users can upload developer logos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'developer-logos' AND auth.role() = 'authenticated');

-- Storage policy for authenticated updates
CREATE POLICY "Authenticated users can update developer logos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'developer-logos' AND auth.role() = 'authenticated');

-- Storage policy for authenticated deletes
CREATE POLICY "Authenticated users can delete developer logos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'developer-logos' AND auth.role() = 'authenticated');
