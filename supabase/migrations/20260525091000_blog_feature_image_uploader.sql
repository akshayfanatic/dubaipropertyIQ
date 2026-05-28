-- Blog Featured Image Uploader Support
-- Converts the existing feature_image_url text field into the image object
-- shape used by ImageUploader and creates the blog-images storage bucket.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'blogs'
      AND column_name = 'feature_image_url'
      AND data_type = 'text'
  ) THEN
    ALTER TABLE blogs RENAME COLUMN feature_image_url TO feature_image_url_old;
    ALTER TABLE blogs ADD COLUMN feature_image_url JSONB;

    UPDATE blogs
    SET feature_image_url = jsonb_build_object(
      'url', feature_image_url_old,
      'alt_tag', title
    )
    WHERE feature_image_url_old IS NOT NULL
      AND trim(feature_image_url_old) <> '';

    ALTER TABLE blogs DROP COLUMN feature_image_url_old;
  END IF;
END $$;

COMMENT ON COLUMN blogs.feature_image_url IS 'Single featured image object for previews and blog detail page';

-- Create storage bucket for blog images
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist (from previous runs)
DROP POLICY IF EXISTS "Public read access for blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete blog images" ON storage.objects;

-- Storage policy for blog images (public read)
CREATE POLICY "Public read access for blog images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-images');

-- Storage policy for authenticated uploads
CREATE POLICY "Authenticated users can upload blog images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

-- Storage policy for authenticated updates
CREATE POLICY "Authenticated users can update blog images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

-- Storage policy for authenticated deletes
CREATE POLICY "Authenticated users can delete blog images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated');
