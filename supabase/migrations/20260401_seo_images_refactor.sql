-- SEO-Friendly Image Storage Refactor
-- Convert image URLs to structured objects with alt tags

-- ============================================
-- PROPERTIES TABLE: photos TEXT[] -> JSONB
-- ============================================

-- Step 1: Add new column with JSONB type
ALTER TABLE properties ADD COLUMN IF NOT EXISTS photos_new JSONB DEFAULT '[]'::JSONB;

-- Step 2: Migrate existing data to new format (only if photos is still TEXT[] type)
DO $$
DECLARE
  property_record RECORD;
  new_photos JSONB;
  photo_url TEXT;
  photo_object JSONB;
  photos_is_array BOOLEAN;
BEGIN
  -- Check if photos column is still an array type
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='properties' AND column_name='photos'
    AND data_type = 'ARRAY'
  ) INTO photos_is_array;

  IF photos_is_array THEN
    FOR property_record IN SELECT id, photos FROM properties WHERE photos IS NOT NULL AND photos != '{}' LOOP
      new_photos := '[]'::JSONB;

      -- Convert each URL to image object
      FOR photo_url IN SELECT unnest(property_record.photos) LOOP
        -- Extract filename from URL for alt_tag
        photo_object := jsonb_build_object(
          'url', photo_url,
          'alt_tag', COALESCE(
            -- Try to extract filename from URL path
            split_part(regexp_replace(photo_url, '.*\/', ''), '.', 1),
            -- Fallback to property name
            'Property Photo'
          )
        );

        new_photos := new_photos || photo_object;
      END LOOP;

      UPDATE properties SET photos_new = new_photos WHERE id = property_record.id;
    END LOOP;
  END IF;
END $$;

-- Step 3: Drop old column and rename new one (only if photos_new exists and has data)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='properties' AND column_name='photos_new') THEN
    ALTER TABLE properties DROP COLUMN IF EXISTS photos;
    ALTER TABLE properties RENAME COLUMN photos_new TO photos;
  END IF;
END $$;

ALTER TABLE properties ALTER COLUMN photos SET DEFAULT '[]'::JSONB;

-- ============================================
-- DEVELOPERS TABLE: logo_url TEXT -> JSONB
-- ============================================

-- Step 1: Add new column with JSONB type
ALTER TABLE developers ADD COLUMN IF NOT EXISTS logo_url_new JSONB;

-- Step 2: Migrate existing data (only if logo_url is still TEXT type)
DO $$
DECLARE
  developer_record RECORD;
  filename TEXT;
  alt_tag TEXT;
  logo_url_is_text BOOLEAN;
BEGIN
  -- Check if logo_url column is still TEXT type
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='developers' AND column_name='logo_url'
    AND data_type = 'text'
  ) INTO logo_url_is_text;

  IF logo_url_is_text THEN
    FOR developer_record IN SELECT id, logo_url, name FROM developers WHERE logo_url IS NOT NULL LOOP
      -- Extract filename from URL
      filename := regexp_replace(developer_record.logo_url, '.*\/', '');

      -- Create alt_tag from filename or developer name
      alt_tag := CASE
        WHEN filename != '' THEN split_part(filename, '.', 1)
        ELSE developer_record.name || ' Logo'
      END;

      UPDATE developers
      SET logo_url_new = jsonb_build_object('url', developer_record.logo_url, 'alt_tag', alt_tag)
      WHERE id = developer_record.id;
    END LOOP;
  END IF;
END $$;

-- Step 3: Drop old column and rename new one (only if logo_url_new exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='developers' AND column_name='logo_url_new') THEN
    ALTER TABLE developers DROP COLUMN IF EXISTS logo_url;
    ALTER TABLE developers RENAME COLUMN logo_url_new TO logo_url;
  END IF;
END $$;

-- ============================================
-- ADD INDEXES FOR JSONB QUERIES
-- ============================================

-- Index for properties photos array queries
CREATE INDEX IF NOT EXISTS idx_properties_photos ON properties USING GIN (photos);

-- Index for developers logo_url queries
CREATE INDEX IF NOT EXISTS idx_developers_logo_url ON developers USING GIN (logo_url);

-- ============================================
-- UPDATE COMMENTS
-- ============================================

COMMENT ON COLUMN properties.photos IS 'Array of image objects with url and alt_tag for SEO';
COMMENT ON COLUMN developers.logo_url IS 'Logo image object with url and alt_tag for SEO';
