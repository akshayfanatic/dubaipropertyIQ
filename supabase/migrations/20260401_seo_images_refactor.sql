-- SEO-Friendly Image Storage Refactor
-- Convert image URLs to structured objects with alt tags

-- ============================================
-- PROPERTIES TABLE: photos TEXT[] -> JSONB
-- ============================================

-- First, migrate existing data to new format
DO $$
DECLARE
  property_record RECORD;
  new_photos JSONB;
  photo_url TEXT;
  photo_object JSON;
BEGIN
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

    UPDATE properties SET photos = new_photos WHERE id = property_record.id;
  END LOOP;
END $$;

-- Alter column type from TEXT[] to JSONB
ALTER TABLE properties ALTER COLUMN photos DROP DEFAULT;
ALTER TABLE properties ALTER COLUMN photos TYPE JSONB USING photos::JSONB;
ALTER TABLE properties ALTER COLUMN photos SET DEFAULT '[]'::JSONB;

-- ============================================
-- DEVELOPERS TABLE: logo_url TEXT -> JSONB
-- ============================================

-- First, migrate existing data
DO $$
DECLARE
  developer_record RECORD;
  filename TEXT;
  alt_tag TEXT;
BEGIN
  FOR developer_record IN SELECT id, logo_url FROM developers WHERE logo_url IS NOT NULL LOOP
    -- Extract filename from URL
    filename := regexp_replace(developer_record.logo_url, '.*\/', '');

    -- Create alt_tag from filename or developer name
    alt_tag := CASE
      WHEN filename != '' THEN split_part(filename, '.', 1)
      ELSE developer_record.name || ' Logo'
    END;

    UPDATE developers
    SET logo_url = jsonb_build_object('url', developer_record.logo_url, 'alt_tag', alt_tag)
    WHERE id = developer_record.id;
  END LOOP;
END $$;

-- Alter column type from TEXT to JSONB
ALTER TABLE developers ALTER COLUMN logo_url TYPE JSONB USING logo_url::JSONB;

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
