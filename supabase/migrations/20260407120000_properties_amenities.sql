-- Properties and Amenities Junction Table
-- Links properties to amenities (schools, malls, metro, parks, etc.)

-- ============================================
-- 1. Properties-Amenities Junction Table
-- ============================================
CREATE TABLE IF NOT EXISTS properties_amenities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  amenity_id UUID NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE (property_id, amenity_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_properties_amenities_property_id ON properties_amenities(property_id);
CREATE INDEX IF NOT EXISTS idx_properties_amenities_amenity_id ON properties_amenities(amenity_id);

COMMENT ON TABLE properties_amenities IS 'Junction table linking properties to nearby amenities';

-- ============================================
-- Row Level Security
-- ============================================

-- Enable RLS
ALTER TABLE properties_amenities ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Properties amenities are publicly readable" ON properties_amenities;
DROP POLICY IF EXISTS "Admins can manage properties amenities" ON properties_amenities;

-- Policies
CREATE POLICY "Properties amenities are publicly readable" ON properties_amenities
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage properties amenities" ON properties_amenities
  FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'service_role'));
