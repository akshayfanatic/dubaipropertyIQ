-- Properties Location & FAQs Feature
-- Adds location column (lat/lng coordinates) and properties_faqs table

-- ============================================
-- 1. Add location column to properties table
-- ============================================
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS location jsonb;

COMMENT ON COLUMN properties.location IS 'Location coordinates as {lat, lng} for map display';

-- ============================================
-- 2. Create properties_faqs table
-- ============================================
CREATE TABLE IF NOT EXISTS properties_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for queries
CREATE INDEX IF NOT EXISTS idx_properties_faqs_property_id ON properties_faqs(property_id);

COMMENT ON TABLE properties_faqs IS 'General FAQs about properties';

-- ============================================
-- 3. Row Level Security
-- ============================================

-- Enable RLS on properties_faqs
ALTER TABLE properties_faqs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Properties FAQs are publicly readable" ON properties_faqs;
DROP POLICY IF EXISTS "Admins can manage properties FAQs" ON properties_faqs;

-- Properties FAQs policies
CREATE POLICY "Properties FAQs are publicly readable" ON properties_faqs
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage properties FAQs" ON properties_faqs
  FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'service_role'));
