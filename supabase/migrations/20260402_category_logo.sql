-- Category Logo Migration
-- Add logo_url column with ImageObject (JSONB) type for SEO-friendly image storage

-- ============================================
-- CATEGORIES TABLE: Add logo_url JSONB column
-- ============================================

-- Add logo_url column as JSONB (nullable)
ALTER TABLE categories ADD COLUMN IF NOT EXISTS logo_url JSONB;

-- Create index for logo_url queries (GIN for JSONB)
CREATE INDEX IF NOT EXISTS idx_categories_logo_url ON categories USING GIN (logo_url);

-- Add comment for documentation
COMMENT ON COLUMN categories.logo_url IS 'Logo image object with url and alt_tag for SEO';

-- ============================================
-- CREATE STORAGE BUCKET FOR CATEGORY LOGOS
-- ============================================

-- Create storage bucket for category logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('category-logos', 'category-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist (from previous runs)
DROP POLICY IF EXISTS "Public read access for category logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload category logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update category logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete category logos" ON storage.objects;

-- Storage policy: Public read access for category logos
CREATE POLICY "Public read access for category logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'category-logos');

-- Storage policy: Authenticated users can upload category logos
CREATE POLICY "Authenticated users can upload category logos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'category-logos' AND auth.role() = 'authenticated');

-- Storage policy: Authenticated users can update category logos
CREATE POLICY "Authenticated users can update category logos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'category-logos' AND auth.role() = 'authenticated');

-- Storage policy: Authenticated users can delete category logos
CREATE POLICY "Authenticated users can delete category logos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'category-logos' AND auth.role() = 'authenticated');
