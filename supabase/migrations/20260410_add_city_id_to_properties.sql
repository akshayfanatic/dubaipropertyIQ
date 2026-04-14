-- Add city_id to properties table
-- Follows same pattern as category_id and developer_id

-- Add city_id column (nullable, with foreign key)
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS city_id UUID REFERENCES cities(id) ON DELETE SET NULL;

-- Create index for queries on city_id
CREATE INDEX IF NOT EXISTS idx_properties_city_id ON properties(city_id);

-- Add comment for documentation
COMMENT ON COLUMN properties.city_id IS 'Reference to cities table for property location';
