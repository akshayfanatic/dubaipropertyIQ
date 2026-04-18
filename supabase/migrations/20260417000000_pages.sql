-- Content Pages Table
-- Stores legal pages (Privacy Policy, Terms, Cookie Policy) with rich text content

CREATE TABLE IF NOT EXISTS pages (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Page Info
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,

  -- Content stored as Tiptap JSON
  content JSONB NOT NULL DEFAULT '{
    "type": "doc",
    "content": []
  }'::jsonb,

  -- Plain text excerpt for SEO/meta
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
CREATE UNIQUE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);

-- Create index for published pages
CREATE INDEX IF NOT EXISTS idx_pages_published ON pages(is_published) WHERE is_published = true;

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for pages table
DROP TRIGGER IF EXISTS update_pages_updated_at ON pages;
CREATE TRIGGER update_pages_updated_at
  BEFORE UPDATE ON pages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE pages IS 'Content pages for legal/info documents with rich text content';
COMMENT ON COLUMN pages.slug IS 'URL-friendly identifier, auto-generated from title';
COMMENT ON COLUMN pages.content IS 'Tiptap editor JSON output';
COMMENT ON COLUMN pages.excerpt IS 'Plain text summary for SEO';
