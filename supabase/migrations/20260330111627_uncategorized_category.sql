-- Uncategorized Default Category
-- Creates a protected "Uncategorized" category and updates foreign key constraint

-- Step 1: Insert the "Uncategorized" category with a fixed UUID
INSERT INTO categories (id, name, slug, description)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Uncategorized',
  'uncategorized',
  'Default category for properties without a specific category'
)
ON CONFLICT (id) DO NOTHING;

-- Step 2: Drop the existing foreign key constraint
ALTER TABLE properties
  DROP CONSTRAINT IF EXISTS properties_category_id_fkey;

-- Step 3: Set default value for category_id
ALTER TABLE properties
  ALTER COLUMN category_id SET DEFAULT '00000000-0000-0000-0000-000000000001'::uuid;

-- Step 4: Update any NULL category_id values to the default
UPDATE properties
SET category_id = '00000000-0000-0000-0000-000000000001'
WHERE category_id IS NULL;

-- Step 5: Add the new foreign key constraint with ON DELETE SET DEFAULT
ALTER TABLE properties
  ADD CONSTRAINT properties_category_id_fkey
  FOREIGN KEY (category_id)
  REFERENCES categories(id)
  ON DELETE SET DEFAULT;

-- Step 6: Add comment
COMMENT ON COLUMN properties.category_id IS 'Reference to categories table. Defaults to "Uncategorized" when category is deleted';
