-- Add id column to junction tables (areas_amenities, areas_properties)
-- This allows direct reference to specific relationships and follows Supabase best practices

-- ============================================
-- 1. areas_amenities table
-- ============================================

-- Add id column (temporarily nullable to allow existing rows)
ALTER TABLE areas_amenities
  ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid() NOT NULL;

-- Drop the composite primary key
ALTER TABLE areas_amenities
  DROP CONSTRAINT areas_amenities_pkey;

-- Add id as primary key
ALTER TABLE areas_amenities
  ADD PRIMARY KEY (id);

-- Add unique constraint to prevent duplicate relationships
ALTER TABLE areas_amenities
  ADD CONSTRAINT areas_amenities_area_id_amenity_id_key
  UNIQUE (area_id, amenity_id);

-- ============================================
-- 2. areas_properties table
-- ============================================

-- Add id column (temporarily nullable to allow existing rows)
ALTER TABLE areas_properties
  ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid() NOT NULL;

-- Drop the composite primary key
ALTER TABLE areas_properties
  DROP CONSTRAINT areas_properties_pkey;

-- Add id as primary key
ALTER TABLE areas_properties
  ADD PRIMARY KEY (id);

-- Add unique constraint to prevent duplicate relationships
ALTER TABLE areas_properties
  ADD CONSTRAINT areas_properties_area_id_property_id_key
  UNIQUE (area_id, property_id);

-- ============================================
-- Comments
-- ============================================

COMMENT ON COLUMN areas_amenities.id IS 'Unique identifier for the area-amenity relationship';
COMMENT ON COLUMN areas_properties.id IS 'Unique identifier for the area-property relationship';
