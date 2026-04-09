-- Properties Table
-- Core entity for property listings

CREATE TABLE IF NOT EXISTS properties (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic Info
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',

  -- Property Details
  property_type TEXT NOT NULL CHECK (property_type IN ('apartment', 'villa', 'townhouse', 'penthouse', 'land')),
  bedrooms INTEGER NOT NULL DEFAULT 0,
  bathrooms INTEGER NOT NULL DEFAULT 0,
  size_sqft INTEGER NOT NULL,

  -- Pricing
  price_aed DECIMAL(15,2) NOT NULL,

  -- Status & Features
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold', 'reserved', 'off_plan')),
  golden_visa_eligible BOOLEAN DEFAULT FALSE,

  -- Media
  photos TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  floor_plan TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries (only if column exists)
DO $$
BEGIN
  -- Status index
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='properties' AND column_name='status') THEN
    CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
  END IF;

  -- Type index
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='properties' AND column_name='property_type') THEN
    CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(property_type);
  END IF;

  -- Price index
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='properties' AND column_name='price_aed') THEN
    CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price_aed);
  END IF;

  -- Bedrooms index
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='properties' AND column_name='bedrooms') THEN
    CREATE INDEX IF NOT EXISTS idx_properties_bedrooms ON properties(bedrooms);
  END IF;

  -- Golden visa index
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='properties' AND column_name='golden_visa_eligible') THEN
    CREATE INDEX IF NOT EXISTS idx_properties_golden_visa ON properties(golden_visa_eligible);
  END IF;

  -- Created at index
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='properties' AND column_name='created_at') THEN
    CREATE INDEX IF NOT EXISTS idx_properties_created ON properties(created_at DESC);
  END IF;
END $$;

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_properties_updated_at ON properties;
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relname = 'properties'
    AND c.relrowsecurity = true
  ) THEN
    ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Public read access (drop if exists first)
DROP POLICY IF EXISTS "Properties are publicly readable" ON properties;
CREATE POLICY "Properties are publicly readable" ON properties
  FOR SELECT USING (true);

-- Admin write access (drop if exists first)
DROP POLICY IF EXISTS "Admins can manage properties" ON properties;
CREATE POLICY "Admins can manage properties" ON properties
  FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'service_role'));

-- Comments for documentation (only if column exists)
COMMENT ON TABLE properties IS 'Property listings for Dubai real estate';

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='properties' AND column_name='property_type') THEN
    COMMENT ON COLUMN properties.property_type IS 'Type of property: apartment, villa, townhouse, penthouse, land';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='properties' AND column_name='status') THEN
    COMMENT ON COLUMN properties.status IS 'Current status: available, sold, reserved, off_plan';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='properties' AND column_name='golden_visa_eligible') THEN
    COMMENT ON COLUMN properties.golden_visa_eligible IS 'Whether property qualifies for UAE Golden Visa (AED 2M+)';
  END IF;
END $$;
