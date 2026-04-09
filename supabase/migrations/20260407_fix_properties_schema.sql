-- Fix properties table schema mismatches
-- This migration handles cases where previous migrations weren't applied
-- It safely adds missing columns and migrates data if needed

-- ============================================
-- 1. Add category_id if missing (migrate from property_type if exists)
-- ============================================

DO $$
BEGIN
  -- Check if property_type column still exists (old schema)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'property_type'
  ) THEN
    -- Add category_id column
    ALTER TABLE properties ADD COLUMN IF NOT EXISTS category_id UUID;

    -- Create default categories if they don't exist
    INSERT INTO categories (name, slug, sort_order, icon)
    VALUES
      ('apartment', 'apartment', 1, 'building-2'),
      ('villa', 'villa', 2, 'home'),
      ('townhouse', 'townhouse', 3, 'home-3'),
      ('penthouse', 'penthouse', 4, 'building'),
      ('land', 'land', 5, 'terrain')
    ON CONFLICT (slug) DO NOTHING;

    -- Migrate property_type values to category_id
    UPDATE properties p
    SET category_id = c.id
    FROM categories c
    WHERE c.slug = p.property_type::text AND p.category_id IS NULL;

    -- Drop the old property_type column
    ALTER TABLE properties DROP COLUMN property_type;

    RAISE NOTICE 'Migrated property_type to category_id';
  ELSE
    -- Just add category_id if it doesn't exist
    ALTER TABLE properties ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id);
  END IF;

  -- Create index on category_id
  CREATE INDEX IF NOT EXISTS idx_properties_category_id ON properties(category_id);

END $$;

-- ============================================
-- 2. Add developer_id if missing
-- ============================================

ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS developer_id UUID REFERENCES developers(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_properties_developer_id ON properties(developer_id);

-- ============================================
-- 3. Add slug column
-- ============================================

ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create helper function to generate slugs
CREATE OR REPLACE FUNCTION generate_slug(text_param TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN regexp_replace(
    regexp_replace(
      lower(trim(text_param)),
      E'[^a-z0-9\\s-]', '', 'g'
    ),
    E'\\s+', '-', 'g'
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Generate slugs for existing records
UPDATE properties
SET slug = CASE
  WHEN EXISTS (
    SELECT 1 FROM properties p
    WHERE p.slug = generate_slug(properties.title)
    AND p.id != properties.id
  ) THEN generate_slug(properties.title) || '-' || substr(md5(random()::text), 1, 6)
  ELSE generate_slug(properties.title)
END
WHERE slug IS NULL;

-- Ensure all records have slug
UPDATE properties
SET slug = 'property-' || substr(id::text, 1, 8)
WHERE slug IS NULL;

-- Make slug NOT NULL and UNIQUE
ALTER TABLE properties
  ALTER COLUMN slug SET NOT NULL;

-- Add unique constraint (drop if exists first for rerun safety)
DO $$
BEGIN
  ALTER TABLE properties DROP CONSTRAINT IF EXISTS properties_slug_key;
  ALTER TABLE properties ADD CONSTRAINT properties_slug_key UNIQUE (slug);
EXCEPTION
  WHEN others THEN
    RAISE NOTICE 'Slug constraint handling: %', SQLERRM;
END $$;

CREATE INDEX IF NOT EXISTS idx_properties_slug ON properties(slug);

COMMENT ON COLUMN properties.slug IS 'URL-friendly unique identifier derived from title for SEO';

-- ============================================
-- 4. Create auto-generate slug trigger
-- ============================================

CREATE OR REPLACE FUNCTION generate_property_slug()
RETURNS TRIGGER AS $$
DECLARE
  new_slug TEXT;
  counter INTEGER := 0;
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    new_slug := generate_slug(NEW.title);

    WHILE EXISTS (SELECT 1 FROM properties WHERE slug = new_slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)) LOOP
      counter := counter + 1;
      new_slug := generate_slug(NEW.title) || '-' || counter;
    END LOOP;

    NEW.slug := new_slug;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if any
DROP TRIGGER IF EXISTS properties_generate_slug ON properties;
DROP TRIGGER IF EXISTS properties_update_slug_on_title_change ON properties;

-- Create new triggers
CREATE TRIGGER properties_generate_slug
  BEFORE INSERT ON properties
  FOR EACH ROW
  EXECUTE FUNCTION generate_property_slug();

CREATE TRIGGER properties_update_slug_on_title_change
  BEFORE UPDATE OF title ON properties
  FOR EACH ROW
  WHEN (OLD.title IS DISTINCT FROM NEW.title AND NEW.slug IS NULL)
  EXECUTE FUNCTION generate_property_slug();
