-- Property Status ENUM
-- Fixed values for property status

-- Create the ENUM type for property status (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'property_status_enum') THEN
    CREATE TYPE property_status_enum AS ENUM ('available', 'sold', 'reserved', 'off_plan');
  END IF;
END $$;

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

-- Step 2: Add category_id foreign key (if not exists)
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id);

-- Step 3: Migrate existing property_type values to category_id
-- First, insert categories if they don't exist (handle different column states)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='categories' AND column_name='sort_order')
     AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='categories' AND column_name='icon') THEN
    INSERT INTO categories (name, slug, sort_order, icon)
    VALUES
      ('apartment', 'apartment', 1, 'building-2'),
      ('villa', 'villa', 2, 'home'),
      ('townhouse', 'townhouse', 3, 'home-3'),
      ('penthouse', 'penthouse', 4, 'building'),
      ('land', 'land', 5, 'terrain')
    ON CONFLICT (slug) DO NOTHING;
  ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='categories' AND column_name='icon') THEN
    INSERT INTO categories (name, slug, icon)
    VALUES
      ('apartment', 'apartment', 'building-2'),
      ('villa', 'villa', 'home'),
      ('townhouse', 'townhouse', 'home-3'),
      ('penthouse', 'penthouse', 'building'),
      ('land', 'land', 'terrain')
    ON CONFLICT (slug) DO NOTHING;
  ELSE
    INSERT INTO categories (name, slug)
    VALUES
      ('apartment', 'apartment'),
      ('villa', 'villa'),
      ('townhouse', 'townhouse'),
      ('penthouse', 'penthouse'),
      ('land', 'land')
    ON CONFLICT (slug) DO NOTHING;
  END IF;
END $$;

-- Step 4: Update existing properties to use the category_id based on the mapped slugs
-- Only if property_type column exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='properties' AND column_name='property_type') THEN
    UPDATE properties p
    SET category_id = c.id
    FROM categories c
    WHERE c.slug = p.property_type::text;
  END IF;
END $$;

-- Step 5: Drop the old property_type column and its check constraint (if exists)
ALTER TABLE properties
  DROP COLUMN IF EXISTS property_type;

-- Step 6: Drop the old check constraints
ALTER TABLE properties
  DROP CONSTRAINT IF EXISTS properties_property_type_check;

ALTER TABLE properties
  DROP CONSTRAINT IF EXISTS properties_status_check;

-- Step 7: Create index on category_id (only if column exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='properties' AND column_name='category_id') THEN
    CREATE INDEX IF NOT EXISTS idx_properties_category_id ON properties(category_id);
  END IF;
END $$;

-- Step 8: Update the column comment
COMMENT ON COLUMN properties.status IS 'Current status: available, sold, reserved, off_plan';
COMMENT ON COLUMN properties.category_id IS 'Reference to categories table for dynamic category management';
