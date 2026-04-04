-- Areas and Amenities Tables
-- Neighborhoods/communities within cities with associated amenities and FAQs

-- ============================================
-- Auto-update updated_at timestamp function
-- (Already exists in previous migrations, keeping for reference)
-- ============================================
-- CREATE OR REPLACE FUNCTION update_updated_at_column()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   NEW.updated_at = NOW();
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- ============================================
-- 1. Amenities Table
-- ============================================
CREATE TABLE IF NOT EXISTS amenities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  logo_url JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_amenities_slug ON amenities(slug);
CREATE INDEX IF NOT EXISTS idx_amenities_name ON amenities(name);

-- Comments
COMMENT ON TABLE amenities IS 'Area amenities reference table (schools, malls, metro, parks)';
COMMENT ON COLUMN amenities.logo_url IS 'Amenity logo as ImageObject {url, alt_tag}';

-- Auto-update updated_at
DROP TRIGGER IF EXISTS update_amenities_updated_at ON amenities;
CREATE TRIGGER update_amenities_updated_at
  BEFORE UPDATE ON amenities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 2. Areas Table
-- ============================================
CREATE TABLE IF NOT EXISTS areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id UUID NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  photos TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE (city_id, name),
  UNIQUE (slug)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_areas_city_id ON areas(city_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_areas_slug ON areas(slug);
CREATE INDEX IF NOT EXISTS idx_areas_name ON areas(name);

-- Comments
COMMENT ON TABLE areas IS 'Neighborhoods/communities within cities';
COMMENT ON COLUMN areas.photos IS 'Array of photo URLs (like properties table)';

-- Auto-update updated_at
DROP TRIGGER IF EXISTS update_areas_updated_at ON areas;
CREATE TRIGGER update_areas_updated_at
  BEFORE UPDATE ON areas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 3. Areas-Amenities Junction Table
-- ============================================
CREATE TABLE IF NOT EXISTS areas_amenities (
  area_id UUID NOT NULL REFERENCES areas(id) ON DELETE CASCADE,
  amenity_id UUID NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
  PRIMARY KEY (area_id, amenity_id)
);

-- Index for reverse lookup
CREATE INDEX IF NOT EXISTS idx_areas_amenities_amenity_id ON areas_amenities(amenity_id);

COMMENT ON TABLE areas_amenities IS 'Junction table linking areas to amenities';

-- ============================================
-- 4. Areas FAQs Table
-- ============================================
CREATE TABLE IF NOT EXISTS areas_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area_id UUID NOT NULL REFERENCES areas(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_areas_faqs_area_id ON areas_faqs(area_id);

COMMENT ON TABLE areas_faqs IS 'General FAQs about areas';

-- ============================================
-- 5. Areas Amenities FAQs Table
-- ============================================
CREATE TABLE IF NOT EXISTS areas_amenities_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area_id UUID NOT NULL REFERENCES areas(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_areas_amenities_faqs_area_id ON areas_amenities_faqs(area_id);

COMMENT ON TABLE areas_amenities_faqs IS 'FAQs about amenities within areas';

-- ============================================
-- 6. Areas-Properties Junction Table
-- ============================================
CREATE TABLE IF NOT EXISTS areas_properties (
  area_id UUID NOT NULL REFERENCES areas(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  PRIMARY KEY (area_id, property_id)
);

-- Index for reverse lookup
CREATE INDEX IF NOT EXISTS idx_areas_properties_property_id ON areas_properties(property_id);

COMMENT ON TABLE areas_properties IS 'Junction table linking areas to properties for display';

-- ============================================
-- Row Level Security
-- ============================================

-- Enable RLS on all tables
ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE areas_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE areas_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE areas_amenities_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE areas_properties ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Amenities are publicly readable" ON amenities;
DROP POLICY IF EXISTS "Admins can manage amenities" ON amenities;

DROP POLICY IF EXISTS "Areas are publicly readable" ON areas;
DROP POLICY IF EXISTS "Admins can manage areas" ON areas;

DROP POLICY IF EXISTS "Areas amenities are publicly readable" ON areas_amenities;
DROP POLICY IF EXISTS "Admins can manage areas amenities" ON areas_amenities;

DROP POLICY IF EXISTS "Areas FAQs are publicly readable" ON areas_faqs;
DROP POLICY IF EXISTS "Admins can manage areas FAQs" ON areas_faqs;

DROP POLICY IF EXISTS "Areas amenities FAQs are publicly readable" ON areas_amenities_faqs;
DROP POLICY IF EXISTS "Admins can manage areas amenities FAQs" ON areas_amenities_faqs;

DROP POLICY IF EXISTS "Areas properties are publicly readable" ON areas_properties;
DROP POLICY IF EXISTS "Admins can manage areas properties" ON areas_properties;

-- Amenities policies
CREATE POLICY "Amenities are publicly readable" ON amenities
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage amenities" ON amenities
  FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'service_role'));

-- Areas policies
CREATE POLICY "Areas are publicly readable" ON areas
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage areas" ON areas
  FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'service_role'));

-- Areas-Amenities policies
CREATE POLICY "Areas amenities are publicly readable" ON areas_amenities
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage areas amenities" ON areas_amenities
  FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'service_role'));

-- Areas FAQs policies
CREATE POLICY "Areas FAQs are publicly readable" ON areas_faqs
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage areas FAQs" ON areas_faqs
  FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'service_role'));

-- Areas Amenities FAQs policies
CREATE POLICY "Areas amenities FAQs are publicly readable" ON areas_amenities_faqs
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage areas amenities FAQs" ON areas_amenities_faqs
  FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'service_role'));

-- Areas-Properties policies
CREATE POLICY "Areas properties are publicly readable" ON areas_properties
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage areas properties" ON areas_properties
  FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'service_role'));

-- ============================================
-- Storage Buckets
-- ============================================

-- Create storage bucket for area photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('area-photos', 'area-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for amenity logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('amenity-logos', 'amenity-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Public read access for area photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload area photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update area photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete area photos" ON storage.objects;

DROP POLICY IF EXISTS "Public read access for amenity logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload amenity logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update amenity logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete amenity logos" ON storage.objects;

-- Storage policies for area photos
CREATE POLICY "Public read access for area photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'area-photos');

CREATE POLICY "Authenticated users can upload area photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'area-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update area photos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'area-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete area photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'area-photos' AND auth.role() = 'authenticated');

-- Storage policies for amenity logos
CREATE POLICY "Public read access for amenity logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'amenity-logos');

CREATE POLICY "Authenticated users can upload amenity logos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'amenity-logos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update amenity logos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'amenity-logos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete amenity logos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'amenity-logos' AND auth.role() = 'authenticated');
