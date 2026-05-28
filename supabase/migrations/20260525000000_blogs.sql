-- Blogs Table
-- Stores blog posts with rich text content

CREATE TABLE IF NOT EXISTS blogs (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Blog Info
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  feature_image_url TEXT,

  -- Content stored as Tiptap JSON
  content JSONB NOT NULL DEFAULT '{
    "type": "doc",
    "content": []
  }'::jsonb,

  -- Plain text excerpt for previews and SEO/meta
  excerpt TEXT,

  -- SEO
  meta_title TEXT,
  meta_description TEXT,

  -- Status
  is_published BOOLEAN DEFAULT false,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create unique index on slug
CREATE UNIQUE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);

-- Create index for published blogs
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(is_published) WHERE is_published = true;

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for blogs table
DROP TRIGGER IF EXISTS update_blogs_updated_at ON blogs;
CREATE TRIGGER update_blogs_updated_at
  BEFORE UPDATE ON blogs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE blogs IS 'Blog posts with rich text content';
COMMENT ON COLUMN blogs.slug IS 'URL-friendly identifier, auto-generated from title';
COMMENT ON COLUMN blogs.feature_image_url IS 'Single feature image URL for previews and blog detail page';
COMMENT ON COLUMN blogs.content IS 'Tiptap editor JSON output';
COMMENT ON COLUMN blogs.excerpt IS 'Plain text summary for previews and SEO';
