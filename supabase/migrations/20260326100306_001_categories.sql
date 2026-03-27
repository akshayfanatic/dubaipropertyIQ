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
CREATE UNIQUE INDEX IF not exists idx_categories_slug ON categories(slug);

-- Create index on sort order
CREATE INDEX IF not exists idx_categories_sort_order on categories(sort_order);

-- Comments for documentation
COMMENT ON table categories IS 'Property categories for admin management';
comment on column categories.name is 'Category name (e.g., Apartment, Villa)';
comment on column categories.slug is 'URL-friendly slug for routing';
comment on column categories.icon is 'Lucide icon name for UI display';
