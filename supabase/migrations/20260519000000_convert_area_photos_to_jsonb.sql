-- Store area photos in the same JSON object format used by properties.photos:
-- [{ "url": "...", "alt_tag": "..." }]
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'areas'
      AND column_name = 'photos'
      AND data_type = 'ARRAY'
  ) THEN
    ALTER TABLE public.areas
      ADD COLUMN photos_jsonb jsonb DEFAULT '[]'::jsonb;

    UPDATE public.areas
    SET photos_jsonb = COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'url', photo_url,
            'alt_tag', COALESCE(NULLIF(public.areas.name, ''), 'Area photo')
          )
        )
        FROM unnest(public.areas.photos) AS photo_url
        WHERE photo_url IS NOT NULL AND photo_url <> ''
      ),
      '[]'::jsonb
    );

    ALTER TABLE public.areas
      DROP COLUMN photos;

    ALTER TABLE public.areas
      RENAME COLUMN photos_jsonb TO photos;
  END IF;

  ALTER TABLE public.areas
    ALTER COLUMN photos SET DEFAULT '[]'::jsonb;
END $$;

COMMENT ON COLUMN public.areas.photos IS 'SEO-friendly area photos stored as JSON objects with url and alt_tag, matching properties.photos';
