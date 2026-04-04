# Areas Schema Design

**Date:** 2026-04-03
**Status:** Approved
**Author:** DubaiPropertyIQ Team

## Overview

Design a database schema for managing areas (neighborhoods/communities) within cities in the DubaiPropertyIQ platform. Areas organize properties and provide detailed information about specific locations.

## Data Hierarchy

```
City → Area → Properties
  ↓       ↓
  └───────┴──→ Amenities
           ↓
           FAQs (General + Amenities-specific)
```

## Schema Design

### 1. Amenities Table

Central reference table for area amenities (schools, malls, metro stations, parks, etc.).

```sql
CREATE TABLE amenities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  logo_url JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE UNIQUE INDEX idx_amenities_slug ON amenities(slug);

-- Comments
COMMENT ON TABLE amenities IS 'Area amenities reference table (schools, malls, metro, parks)';
COMMENT ON COLUMN amenities.logo_url IS 'Amenity logo as ImageObject {url, alt_tag}';

-- Auto-update updated_at
DROP TRIGGER IF EXISTS update_amenities_updated_at ON amenities;
CREATE TRIGGER update_amenities_updated_at
  BEFORE UPDATE ON amenities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 2. Areas Table

Main table for neighborhoods/communities within a city.

```sql
CREATE TABLE areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id UUID NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  photos TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE (city_id, name),
  UNIQUE (slug)
);

-- Indexes
CREATE INDEX idx_areas_city_id ON areas(city_id);
CREATE UNIQUE INDEX idx_areas_slug ON areas(slug);
CREATE INDEX idx_areas_name ON areas(name);

-- Comments
COMMENT ON TABLE areas IS 'Neighborhoods/communities within cities';
COMMENT ON COLUMN areas.photos IS 'Array of photo URLs (like properties table)';

-- Auto-update updated_at
DROP TRIGGER IF EXISTS update_areas_updated_at ON areas;
CREATE TRIGGER update_areas_updated_at
  BEFORE UPDATE ON areas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 3. Areas-Amenities Junction Table

Many-to-many relationship between areas and amenities.

```sql
CREATE TABLE areas_amenities (
  area_id UUID NOT NULL REFERENCES areas(id) ON DELETE CASCADE,
  amenity_id UUID NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
  PRIMARY KEY (area_id, amenity_id)
);

-- Index for reverse lookup
CREATE INDEX idx_areas_amenities_amenity_id ON areas_amenities(amenity_id);

COMMENT ON TABLE areas_amenities IS 'Junction table linking areas to amenities';
```

### 4. Areas FAQs Table

Frequently asked questions about an area.

```sql
CREATE TABLE areas_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area_id UUID NOT NULL REFERENCES areas(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_areas_faqs_area_id ON areas_faqs(area_id);

COMMENT ON TABLE areas_faqs IS 'General FAQs about areas';
```

### 5. Areas Amenities FAQs Table

Frequently asked questions specifically about amenities in an area.

```sql
CREATE TABLE areas_amenities_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area_id UUID NOT NULL REFERENCES areas(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_areas_amenities_faqs_area_id ON areas_amenities_faqs(area_id);

COMMENT ON TABLE areas_amenities_faqs IS 'FAQs about amenities within areas';
```

### 6. Areas-Properties Junction Table

Many-to-many relationship for showcasing properties in an area.

```sql
CREATE TABLE areas_properties (
  area_id UUID NOT NULL REFERENCES areas(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  PRIMARY KEY (area_id, property_id)
);

-- Index for reverse lookup
CREATE INDEX idx_areas_properties_property_id ON areas_properties(property_id);

COMMENT ON TABLE areas_properties IS 'Junction table linking areas to properties for display';
```

## Row Level Security

All tables will have RLS enabled with:
- **Public read access** - Anyone can view areas, amenities, FAQs
- **Authenticated write access** - Admin users can manage content

## Storage Buckets

- `area-photos` bucket for storing area photos (public access)
- `amenity-logos` bucket for storing amenity logos (public access)

## Type Definitions

TypeScript types will be generated in separate files:

**`types/areas.ts`** (imports `ImageObject` from `types/images`):
```typescript
interface Area {
  id: string;
  city_id: string;
  name: string;
  slug: string;
  description?: string;
  photos: string[];
  created_at: string;
  updated_at: string;
}

export type AreaInsert = Omit<Area, 'id' | 'created_at' | 'updated_at'>;
export type AreaUpdate = Partial<AreaInsert>;
export type AreaFilters extends PaginationFilters, SearchFilters {
  city_id?: string;
}

interface AreaFAQ {
  id: string;
  area_id: string;
  question: string;
  answer: string;
  created_at: string;
}

// Amenities FAQ has the same shape as general Area FAQ
// Reusing the same type for both (DRY principle)
type AreaAmenityFAQ = AreaFAQ;
```

**`types/amenities.ts`** (imports `ImageObject` from `types/images`):
```typescript
interface Amenity {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url: ImageObject | null;
  created_at: string;
  updated_at: string;
}

export type AmenityInsert = Omit<Amenity, 'id' | 'created_at' | 'updated_at'>;
export type AmenityUpdate = Partial<AmenityInsert>;
export type AmenityFilters extends PaginationFilters, SearchFilters {}

export type AmenityOption = {
  label: string;
  value: string;
  logo_url?: ImageObject | null;
};
```

## CRUD Implementation Pattern

Following the same CRUD pattern as Categories/Cities.

### File Structure

**Types:**
- `types/amenities.ts` - Amenity interfaces
- `types/areas.ts` - Area interfaces

**Validation:**
- `lib/validations/amenity.ts` - Zod schemas for amenity forms
- `lib/validations/area.ts` - Zod schemas for area forms

**Database Operations:**
- `lib/db/amenities/queries.ts` - Read operations (getAmenitiesAdmin, getAmenityById, getAmenityOptionsAdmin)
- `lib/db/amenities/actions.ts` - Write operations (createAmenity, updateAmenity, deleteAmenity)
- `lib/db/areas/queries.ts` - Read operations for areas
- `lib/db/areas/actions.ts` - Write operations for areas

**Pages:**
- `app/(dashboard)/dashboard/(admin)/admin/amenities/(list)/page.tsx` - List page
- `app/(dashboard)/dashboard/(admin)/admin/amenities/new/page.tsx` - New page
- `app/(dashboard)/dashboard/(admin)/admin/amenities/[id]/page.tsx` - Edit page
- `app/(dashboard)/dashboard/(admin)/admin/areas/(list)/page.tsx` - Areas list page
- `app/(dashboard)/dashboard/(admin)/admin/areas/new/page.tsx` - New area page
- `app/(dashboard)/dashboard/(admin)/admin/areas/[id]/page.tsx` - Edit area page

**Components:**
- `components/dashboard/admin/amenities/AmenitiesList.tsx`
- `components/dashboard/admin/amenities/AmenityForm.tsx`
- `components/dashboard/admin/amenities/columns.tsx`
- `components/dashboard/admin/areas/AreasList.tsx`
- `components/dashboard/admin/areas/AreaForm.tsx`
- `components/dashboard/admin/areas/columns.tsx`

**API Routes:**
- `app/api/admin/amenities/options/route.ts` - Amenity dropdown options
- `app/api/admin/areas/options/route.ts` - Area dropdown options

### Features

**Amenities CRUD:**
- Server-side pagination with search
- Logo upload with preview (single image)
- Slug auto-generation from name
- Form validation with Zod
- Empty state with "Add Amenity" CTA

**Areas CRUD:**
- Server-side pagination with search
- City selection dropdown
- Photos array upload (multiple images)
- Slug auto-generation from name
- Amenity multi-select
- Property multi-select for showcasing
- FAQ management (general + amenities)

## Navigation Structure

**Sidebar Accordion Pattern:**

Amenities will be nested under Areas in the sidebar navigation:

```
Management
├── Properties
├── Categories
├── Areas ▼ (accordion/collapsible)
│   ├── All Areas
│   └── Amenities (sub-item)
├── Cities
└── Developers
```

**Route Configuration** (`config/routes.ts`):
```typescript
{
  title: 'Areas',
  href: '/dashboard/admin/areas',
  icon: MapPin,
  children: [
    { title: 'All Areas', href: '/dashboard/admin/areas', icon: MapPin },
    { title: 'Amenities', href: '/dashboard/admin/amenities', icon: Layers }
  ]
}
```

**Sidebar Refactor:**
- Update `AdminSidebar` component to support accordion/collapsible items
- Add expand/collapse animation for parent items with children
- Show chevron icon for items with children
- Maintain active state highlighting for both parent and child items

## Success Criteria

1. Areas can be created and linked to cities
2. Multiple amenities can be associated with an area
3. Properties can be showcased across multiple areas
4. General and amenity-specific FAQs can be managed per area
5. All relationships support cascade deletion
6. Public read access via RLS policies
