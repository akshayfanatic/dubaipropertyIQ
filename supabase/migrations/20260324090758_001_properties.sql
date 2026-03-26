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

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price_aed);
CREATE INDEX IF NOT EXISTS idx_properties_bedrooms ON properties(bedrooms);
CREATE INDEX IF NOT EXISTS idx_properties_golden_visa ON properties(golden_visa_eligible);
CREATE INDEX IF NOT EXISTS idx_properties_created ON properties(created_at DESC);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Properties are publicly readable" ON properties
  FOR SELECT USING (true);

-- Admin write access (requires service role)
CREATE POLICY "Admins can manage properties" ON properties
  FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'service_role'));

-- Comments for documentation
COMMENT ON TABLE properties IS 'Property listings for Dubai real estate';
COMMENT ON COLUMN properties.property_type IS 'Type of property: apartment, villa, townhouse, penthouse, land';
COMMENT ON COLUMN properties.status IS 'Current status: available, sold, reserved, off_plan';
COMMENT ON COLUMN properties.golden_visa_eligible IS 'Whether property qualifies for UAE Golden Visa (AED 2M+)';
