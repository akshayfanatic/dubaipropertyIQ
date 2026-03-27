-- Property Status ENUM
-- Fixed values for property status

-- Create the ENUM type for property status
CREATE TYPE property_status_enum AS ENUM ('available', 'sold', 'reserved', 'off_plan');

-- Update the properties table to use ENUM
-- Step 1: First drop the check constraint if it exists
ALTER TABLE properties
  DROP CONSTRAINT IF EXISTS properties_status_check;

-- Step 2: Drop the default value temporarily
ALTER TABLE properties
  ALTER COLUMN status DROP DEFAULT;

-- Step 3: Alter the status column to use the property_status_enum
ALTER TABLE properties
  ALTER COLUMN status TYPE property_status_enum USING status::property_status_enum;

-- Step 4: Set the new default value with the correct type
ALTER TABLE properties
  ALTER COLUMN status SET DEFAULT 'available'::property_status_enum;

-- Step 2: Add category_id foreign key
ALTER TABLE properties
  ADD COLUMN category_id UUID REFERENCES categories(id);

-- Step 3: Migrate existing property_type values to category_id
-- First, insert categories if they don't exist
INSERT INTO categories (name, slug, sort_order, icon)
VALUES
  ('apartment', 'apartment', 1, 'building-2'),
  ('villa', 'villa', 2, 'home'),
  ('townhouse', 'townhouse', 3, 'home-3'),
  ('penthouse', 'penthouse', 4, 'building'),
  ('land', 'land', 5, 'terrain')
ON CONFLICT (slug) DO NOTHING;

-- Step 4: Update existing properties to use the category_id based on the mapped slugs
UPDATE properties p
SET category_id = c.id
FROM categories c
WHERE c.slug = p.property_type::text;

-- Step 5: Drop the old property_type column and its check constraint
ALTER TABLE properties
  DROP COLUMN property_type;

-- Step 6: Drop the old check constraints
ALTER TABLE properties
  DROP CONSTRAINT IF EXISTS properties_property_type_check;

ALTER TABLE properties
  DROP CONSTRAINT IF EXISTS properties_status_check;

-- Step 7: Create index on category_id
CREATE INDEX IF NOT EXISTS idx_properties_category_id ON properties(category_id);

-- Step 8: Update the column comment
COMMENT ON COLUMN properties.status IS 'Current status: available, sold, reserved, off_plan';
COMMENT ON COLUMN properties.category_id IS 'Reference to categories table for dynamic category management';
