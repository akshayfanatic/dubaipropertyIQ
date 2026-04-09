-- Categories Table
-- Dynamic property categories for admin management

CREATE TABLE IF NOT EXISTS categories (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Category Info
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,

  -- Ordering
  sort_order INTEGER DEFAULT 0,

  -- Status
  is_active BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create unique index on slug
CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Create index on sort order (only if column exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='categories' AND column_name='sort_order') THEN
    CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order);
  END IF;
END $$;

-- Comments for documentation
COMMENT ON TABLE categories IS 'Property categories for admin management';

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='categories' AND column_name='name') THEN
    COMMENT ON COLUMN categories.name IS 'Category name (e.g., Apartment, Villa)';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='categories' AND column_name='slug') THEN
    COMMENT ON COLUMN categories.slug IS 'URL-friendly slug for routing';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='categories' AND column_name='icon') THEN
    COMMENT ON COLUMN categories.icon IS 'Lucide icon name for UI display';
  END IF;
END $$;
