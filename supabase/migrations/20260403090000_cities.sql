-- Cities Table
-- UAE cities for property location management

CREATE TABLE IF NOT EXISTS cities (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- City Info
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,

  -- Media (SEO-friendly image with alt tag)
  logo_url JSONB,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create unique index on slug
CREATE UNIQUE INDEX IF NOT EXISTS idx_cities_slug ON cities(slug);

-- Comments for documentation
COMMENT ON TABLE cities IS 'UAE cities for property location management';
COMMENT ON COLUMN cities.name IS 'City name (e.g., Dubai, Abu Dhabi)';
COMMENT ON COLUMN cities.slug IS 'URL-friendly slug for routing';
COMMENT ON COLUMN cities.description IS 'City description for SEO and display';
COMMENT ON COLUMN cities.logo_url IS 'City logo as ImageObject {url, alt_tag}';

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_cities_updated_at ON cities;
CREATE TRIGGER update_cities_updated_at
  BEFORE UPDATE ON cities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Cities are publicly readable" ON cities;
DROP POLICY IF EXISTS "Admins can manage cities" ON cities;

-- Public read access
CREATE POLICY "Cities are publicly readable" ON cities
  FOR SELECT USING (true);

-- Admin write access (requires service role)
CREATE POLICY "Admins can manage cities" ON cities
  FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'service_role'));

-- Create storage bucket for city logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('city-logos', 'city-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist (from previous runs)
DROP POLICY IF EXISTS "Public read access for city logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload city logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update city logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete city logos" ON storage.objects;

-- Storage policy for city logos (public read)
CREATE POLICY "Public read access for city logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'city-logos');

-- Storage policy for authenticated uploads
CREATE POLICY "Authenticated users can upload city logos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'city-logos' AND auth.role() = 'authenticated');

-- Storage policy for authenticated updates
CREATE POLICY "Authenticated users can update city logos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'city-logos' AND auth.role() = 'authenticated');

-- Storage policy for authenticated deletes
CREATE POLICY "Authenticated users can delete city logos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'city-logos' AND auth.role() = 'authenticated');

-- Seed data for major UAE cities
INSERT INTO cities (name, slug, description) VALUES
  (
    'Dubai',
    'dubai',
    'The largest and most populous city in the United Arab Emirates, known for its modern architecture, luxury shopping, and vibrant nightlife. Home to the world''s tallest building, the Burj Khalifa.'
  ),
  (
    'Abu Dhabi',
    'abu-dhabi',
    'The capital of the United Arab Emirates, known for its stunning mosques, pristine beaches, and cultural landmarks. The city combines modern development with rich Arabian heritage.'
  ),
  (
    'Sharjah',
    'sharjah',
    'The cultural capital of the UAE, known for its museums, Islamic architecture, and commitment to arts and heritage. A UNESCO Cultural Capital of the Arab World.'
  ),
  (
    'Ajman',
    'ajman',
    'The smallest of the seven emirates, known for its beautiful beaches, traditional souks, and growing real estate market. Offers a more relaxed lifestyle close to Dubai.'
  ),
  (
    'Al Ain',
    'al-ain',
    'The Garden City of the UAE, known for its oasis, greenery, and cultural heritage. Home to the UAE''s first UNESCO World Heritage Site and one of the world''s oldest continuously inhabited settlements.'
  ),
  (
    'Ras Al Khaimah',
    'ras-al-khaimah',
    'The northernmost emirate, known for its stunning mountains, pristine beaches, and adventure tourism. A rapidly developing destination with rich history and natural beauty.'
  )
ON CONFLICT (name) DO NOTHING;
