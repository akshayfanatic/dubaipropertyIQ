-- Adding new Columns in Area Table

ALTER TABLE areas
ADD COLUMN IF NOT EXISTS location jsonb;