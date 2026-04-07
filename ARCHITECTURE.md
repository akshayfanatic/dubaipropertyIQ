# DubaiPropertyIQ - Architecture Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Directory Structure](#directory-structure)
4. [Architecture Patterns](#architecture-patterns)
5. [Routing Architecture](#routing-architecture)
6. [Data Layer](#data-layer)
7. [Component Architecture](#component-architecture)
8. [Authentication & Authorization](#authentication--authorization)
9. [Form Handling & Validation](#form-handling--validation)
10. [State Management](#state-management)
11. [API Design](#api-design)
12. [Type System](#type-system)
13. [Key Design Patterns](#key-design-patterns)
14. [Deployment Configuration](#deployment-configuration)

---

## Project Overview

**DubaiPropertyIQ** is a real estate intelligence platform for Dubai properties, featuring:

- **Customer-facing frontend**: Property browsing, search, and filtering
- **Admin dashboard**: Full CRUD operations for properties, categories, developers, cities, areas, and amenities
- **Multi-user support**: Authentication system with role-based access planning
- **Modern tech stack**: Built with Next.js 16, React 19, TypeScript 5, and Supabase

---

## Technology Stack

### Core Framework

- **Next.js**: 16.1.6 (App Router with RSC)
- **React**: 19.2.3
- **TypeScript**: 5.x

### Styling & UI

- **Tailwind CSS**: v4
- **shadcn/ui**: Component library
- **Fonts**: Geist Sans & Geist Mono (next/font/google)

### Backend & Database

- **Supabase**: PostgreSQL database, Auth, Storage
- **Server Actions**: Next.js server actions for mutations

### Form Handling

- **React Hook Form**: Form state management
- **Zod**: Schema validation

### Data Fetching

- **SWR**: Client-side data fetching and caching
- **Server Components**: Server-side data fetching

### Development Tools

- **ESLint**: Code linting
- **TypeScript**: Static type checking
- **Chrome DevTools MCP**: Browser automation for testing

---

## Directory Structure

```
dubaipropertyiq/
├── app/                                    # Next.js App Router
│   ├── (auth)/                            # Auth route group (login, signup, etc.)
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   ├── forgot-password/
│   │   │   └── reset-password/
│   │   └── layout.tsx                     # Auth-specific layout
│   │
│   ├── (dashboard)/                       # Protected dashboard routes
│   │   └── dashboard/
│   │       ├── (admin)/                   # Admin dashboard route group
│   │       │   └── admin/
│   │       │       ├── properties/        # Property management
│   │       │       │   ├── (list)/        # List view with layout
│   │       │       │   ├── new/           # Create new
│   │       │       │   └── [id]/          # Edit existing
│   │       │       ├── categories/        # Category CRUD
│   │       │       ├── cities/            # City CRUD
│   │       │       ├── areas/             # Area CRUD (with FAQ tabs)
│   │       │       ├── developers/        # Developer CRUD
│   │       │       ├── amenities/         # Amenity CRUD
│   │       │       └── profile/           # User profile
│   │       │
│   │       ├── (agent)/                   # Agent dashboard (planned)
│   │       └── layout.tsx                 # Dashboard layout with auth
│   │
│   ├── (frontend)/                        # Customer-facing routes
│   │   ├── (customer)/                    # Customer pages
│   │   └── layout.tsx                     # Frontend layout
│   │
│   ├── api/                               # API routes
│   │   ├── admin/
│   │   │   └── {entity}/options/          # Dropdown options endpoints
│   │   └── user/                          # User-specific endpoints
│   │
│   ├── layout.tsx                         # Root layout
│   ├── page.tsx                           # Home page
│   └── globals.css                        # Global styles
│
├── components/                             # React components
│   ├── auth/                              # Authentication components
│   │   ├── forms/                         # Login, signup forms
│   │   ├── inputs/                        # Email, password inputs
│   │   ├── layout/                        # Auth layouts
│   │   └── ui/                            # Auth-specific UI
│   │
│   ├── dashboard/                         # Dashboard components
│   │   └── admin/
│   │       ├── admin-sidebar.tsx          # Main navigation
│   │       ├── admin-header.tsx           # Top bar
│   │       ├── {entity}/                  # Entity-specific components
│   │       │   ├── columns.tsx            # Table columns definition
│   │       │   ├── {Entity}List.tsx       # List view
│   │       │   ├── {Entity}Form.tsx       # Form component
│   │       │   └── {Entity}SearchFilter.tsx # Search/filter
│   │       └── properties/
│   │           └── filter/                # Property filtering
│   │
│   ├── form/                              # Form components
│   ├── layout/                            # Header, footer, nav
│   ├── shared/                            # Shared UI components
│   │   ├── forms/                         # Reusable form elements
│   │   ├── page-header.tsx
│   │   ├── pagination.tsx
│   │   └── no-item-found.tsx
│   │
│   ├── ui/                                # Base UI components (shadcn)
│   ├── providers/                         # React context providers
│   └── home/                              # Home page components
│
├── lib/                                   # Core business logic
│   ├── auth/                              # Authentication logic
│   │   ├── guards.ts                      # Auth guard functions
│   │   ├── roles.ts                       # Role definitions
│   │   └── types.ts                       # Auth types
│   │
│   ├── db/                                # Database layer
│   │   └── {entity}/                      # Per-entity modules
│   │       ├── queries.ts                 # Read operations
│   │       └── actions.ts                 # Write operations (server actions)
│   │
│   ├── supabase/                          # Supabase clients
│   │   ├── client.ts                      # Browser client
│   │   ├── server.ts                      # Server client
│   │   └── admin.ts                       # Admin client (elevated privileges)
│   │
│   ├── validations/                       # Zod schemas
│   │   └── {entity}.ts                    # Entity validation schemas
│   │
│   ├── utils/                             # Utility functions
│   │   └── response.ts                    # API response factory
│   │
│   └── storage/                           # Storage utilities
│
├── types/                                 # TypeScript definitions
│   ├── db/                                # Database-generated types
│   ├── {entity}.ts                        # Domain entity types
│   ├── shared.ts                          # Shared types
│   └── index.ts                           # Type exports
│
├── hooks/                                 # Custom React hooks
├── public/                                # Static assets
└── scripts/                               # Build/seed scripts
```

---

## Architecture Patterns

### 1. **Layered Architecture**

The application follows a clear separation of concerns:

```
┌─────────────────────────────────────────────┐
│           Presentation Layer                │
│  (Components, Pages, UI)                    │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│         Business Logic Layer                │
│  (Validations, Guards, Utilities)           │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│           Data Access Layer                 │
│  (Queries, Actions, API Routes)             │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│         Database / External Services        │
│  (Supabase - DB, Auth, Storage)            │
└─────────────────────────────────────────────┘
```

### 2. **Feature-Based Organization**

Each entity (properties, categories, cities, etc.) has its own self-contained module:

- **Types**: Domain type definitions
- **Validations**: Zod schemas
- **Queries**: Read operations
- **Actions**: Write operations (server actions)
- **Components**: UI components

### 3. **Server-First Architecture**

- **Server Components**: Default for all pages
- **Server Actions**: Used for all mutations
- **Client Components**: Only when interactivity is needed

---

## Routing Architecture

### Route Groups

| Route Group           | Purpose              | Auth Required                        |
| --------------------- | -------------------- | ------------------------------------ |
| `(auth)`              | Authentication pages | Guest only                           |
| `(dashboard)`         | Protected dashboard  | Authenticated                        |
| `(dashboard)/(admin)` | Admin dashboard      | Authenticated + Admin role (planned) |
| `(dashboard)/(agent)` | Agent dashboard      | Authenticated + Agent role (planned) |
| `(frontend)`          | Customer pages       | Public                               |

### Layout Hierarchy

```
app/layout.tsx (Root)
├── app/(auth)/layout.tsx (Auth layout - minimal UI)
├── app/(dashboard)/layout.tsx (Dashboard layout - sidebar + header)
│   ├── app/(dashboard)/(admin)/layout.tsx (Admin auth guard)
│   └── app/(dashboard)/(agent)/layout.tsx (Agent auth guard)
└── app/(frontend)/layout.tsx (Customer layout - header + footer)
```

### Dynamic Routes

- `[id]`: Edit pages for individual entities
- Example: `/dashboard/admin/properties/[id]` edits a specific property

### Nested Routes

Some entities use nested layouts for shared UI:

- `(list)/layout.tsx`: Shared layout for list + filter views

---

## Data Layer

### Supabase Clients

```typescript
// lib/supabase/

client.ts; // Browser client - uses anon key
// Usage: Client components, client-side data fetching

server.ts; // Server client - uses service role
// Usage: Server components, server-side auth

admin.ts; // Admin client - elevated privileges
// Usage: Admin operations, bypassing RLS
```

### Database Module Pattern

Each entity follows a consistent pattern:

```typescript
// lib/db/{entity}/
├── queries.ts     // Read operations (SELECT)
│   ├── get{Entity}Admin()           // List with pagination
│   ├── get{Entity}ByIdAdmin()       // Single by ID
│   ├── get{Entity}OptionsAdmin()    // For dropdowns
│   └── search{Entities}Admin()      // Search functionality
│
└── actions.ts     // Write operations (INSERT, UPDATE, DELETE)
    ├── create{Entity}()             // Create new
    ├── update{Entity}()             // Update existing
    ├── delete{Entity}()             // Delete
    └── bulk{Operation}()            // Bulk operations (where applicable)
```

### API Response Wrapper

All API responses use a consistent format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  status: number; // HTTP status code
  message: string;
  data: T | null;
  error?: {
    code: string;
    details?: string;
  };
}
```

### Query Patterns

**Pagination**:

```typescript
const page = filters?.page || 1;
const pageSize = filters?.pageSize || 10;
const from = (page - 1) * pageSize;
const to = from + pageSize - 1;

query = query.range(from, to);
```

**Filtering**:

```typescript
// Text search
query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);

// Exact match
query = query.eq('status', status);

// Range filters
query = query.gte('price_aed', minPrice).lte('price_aed', maxPrice);
```

**Joins**:

```typescript
// Using Supabase's join syntax
select(`
  id,
  title,
  category:categories!inner (
    id,
    name,
    slug
  )
`);
```

---

## Component Architecture

### Component Categories

1. **UI Components** (`components/ui/`)
   - Base components from shadcn/ui
   - Fully reusable, context-agnostic
   - Examples: Button, Input, Dialog, etc.

2. **Layout Components** (`components/layout/`)
   - Header, Footer, Navigation
   - Page structure components

3. **Dashboard Components** (`components/dashboard/`)
   - Admin-specific UI
   - Sidebar, Header, Data Tables

4. **Auth Components** (`components/auth/`)
   - Login/signup forms
   - Auth-specific UI elements

5. **Shared Components** (`components/shared/`)
   - Cross-feature components
   - Page headers, pagination, empty states

### Component Patterns

**1. Server vs Client Components**

```typescript
// Server Component (default)
export default async function Page() {
  const data = await getData();
  return <View data={data} />;
}

// Client Component (with directive)
'use client';
export function InteractiveForm() {
  const [state, setState] = useState();
  // ...
}
```

**2. Compound Components**

Used for complex UIs like forms:

```typescript
<AreaForm>
  <AreaBasicInfo />
  <AreaAmenitiesFAQs />
</AreaForm>
```

**3. Forward Ref Pattern**

For form inputs that need ref access:

```typescript
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return <input ref={ref} {...props} />;
  }
);
```

---

## Authentication & Authorization

### Auth Flow

```
┌─────────────┐
│ User visits │
│ protected   │
│   route     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────┐
│ Layout calls requireAuth()  │
│ (lib/auth/guards.ts)        │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Check Supabase session      │
│ serverClient().auth.getUser()│
└──────┬──────────────────────┘
       │
       ├─ Authenticated ──► Continue
       │
       └─ Not Authenticated ──► Redirect to login
```

### Auth Guards

```typescript
// lib/auth/guards.ts

requireAuth(); // Redirects to home if not authenticated
getAuthUser(); // Returns user or undefined (no redirect)
requireGuest(); // Redirects to dashboard if authenticated
```

### Role-Based Access (Planned)

```typescript
// lib/auth/roles.ts
// Role definitions and checks (currently planned)
```

---

## Form Handling & Validation

### Form Architecture

```
Zod Schema ──► React Hook Form ──► Server Action
    │                │                   │
    │                │                   ▼
    │                │            Database Mutation
    │                │                   │
    │                ▼                   ▼
    │         Client-side         API Response
    │         Validation             Wrapper
    │
    ▼
Server-side Validation (re-check)
```

### Validation Pattern

**1. Define Zod Schema** (`lib/validations/{entity}.ts`)

```typescript
export const propertyFormSchema = z.object({
  title: z.string().min(3).max(200),
  price_aed: z.number().positive(),
  // ...
});
```

**2. Use in Form Component**

```typescript
const form = useForm<PropertyFormData>({
  resolver: zodResolver(propertyFormSchema),
});
```

**3. Server-Side Validation**

```typescript
// Re-validate before database operation
const validated = propertyInsertSchema.parse(data);
```

### Form Structure

Each entity form typically has:

- **Form Component**: Main form with React Hook Form
- **Tab Structure**: For complex forms (e.g., AreaForm with Basic Info + Amenities + FAQs)
- **Form Actions**: Submit, cancel, delete buttons
- **Error Display**: Field-level and form-level errors

---

## State Management

### Approach

The application uses **no global state management library**. Instead:

1. **Server State**: Fetched on server, passed as props
2. **URL State**: Filters, search params in URL
3. **Local Component State**: useState for UI state
4. **React Context**: For theme and sidebar state

### Providers

```typescript
// components/providers/
AdminProvider
├── ThemeProvider      (dark/light mode)
└── SidebarProvider    (sidebar open/close state)
```

### Data Fetching

**Server-Side** (default):

```typescript
// In Server Component
const data = await getPropertiesAdmin(filters);
```

**Client-Side** (with SWR):

```typescript
// For interactive data that updates frequently
const { data, error, mutate } = useSWR('/api/properties', fetcher);
```

---

## API Design

### Server Actions vs API Routes

| Method             | Usage                           | Example                                |
| ------------------ | ------------------------------- | -------------------------------------- |
| **Server Actions** | Mutations, form submissions     | `createProperty()`, `updateProperty()` |
| **API Routes**     | Client data fetching, dropdowns | `/api/admin/properties/options`        |

### API Route Pattern

```typescript
// app/api/admin/{entity}/options/route.ts
export async function GET() {
  const result = await get{Entity}OptionsAdmin();
  return Response.json(result);
}
```

### Server Action Pattern

```typescript
'use server';

export async function create{Entity}(data: {Entity}Insert) {
  try {
    const supabase = adminClient();
    const { data, error } = await supabase
      .from('{entities}')
      .insert(data)
      .select()
      .single();

    if (error) {
      return ApiResponse({ success: false, /* ... */ });
    }

    return ApiResponse({ success: true, data });
  } catch (error) {
    // Error handling
  }
}
```

---

## Type System

### Type Organization

```
types/
├── db/                          # Database-generated types
│   ├── supabase-generated.ts    # Auto-generated from Supabase
│   └── db.ts                     # Database type exports
│
├── {entity}.ts                   # Domain entity types
│   ├── {Entity}                 # Full entity with relations
│   ├── {Entity}Insert           # For creation (no id, timestamps)
│   ├── {Entity}Update           # Partial, for updates
│   ├── {Entity}Filters          # Filter parameters
│   └── {Entity}Option           # For dropdowns
│
├── shared.ts                     # Shared types
│   ├── PaginatedResult          # Pagination wrapper
│   ├── SelectOption             # Dropdown option type
│   └── ApiResponse              # API response type
│
└── index.ts                      # Central type exports
```

### Type Patterns

**1. Domain Types**

```typescript
interface Property {
  id: string;
  slug: string;
  title: string;
  // ... full definition
}
```

**2. Insert/Update Types**

```typescript
type PropertyInsert = Omit<Property, 'id' | 'created_at' | 'updated_at'>;
type PropertyUpdate = Partial<PropertyInsert>;
```

**3. List Item Types**

```typescript
interface PropertyListItem {
  // Subset of fields for list views
  id: string;
  title: string;
  // ... minimal fields
}
```

---

## Key Design Patterns

### 1. **Repository Pattern**

Database operations abstracted behind query/action functions:

```typescript
// Instead of direct Supabase calls
const { data } = await supabase.from('properties').select();

// Use repository function
const result = await getPropertiesAdmin(filters);
```

### 2. **Factory Pattern**

API Response factory ensures consistent responses:

```typescript
ApiResponse({ success: true, status: 200, message: 'OK', data });
```

### 3. **Guard Pattern**

Authentication checks encapsulated in guard functions:

```typescript
await requireAuth(); // Protects the route
```

### 4. **Compound Component Pattern**

Complex forms use compound components:

```typescript
<AreaForm>
  <AreaBasicInfo />
  <AreaAmenitiesFAQs />
</AreaForm>
```

### 5. **Tabs Pattern for Complex Forms**

Area CRUD uses tab-based form structure:

- Basic Info
- Amenities
- FAQs

Each tab is a separate component with its own validation.

---

## Deployment Configuration

### Next.js Config

```typescript
// next.config.ts
{
  images: {
    remotePatterns: [
      { hostname: '*.supabase.co' } // Supabase storage
    ]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb' // For form uploads
    }
  }
}
```

### Environment Variables (Required)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=xxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# App
NEXT_PUBLIC_APP_URL=xxx
```

### Build Output

- **Static**: Where possible
- **Server**: For authenticated routes and API routes
- **Hybrid**: Mixed static and server rendering

---

## Database Schema (Key Entities)

| Entity       | Description                             | Key Relations            |
| ------------ | --------------------------------------- | ------------------------ |
| `properties` | Property listings                       | → categories, developers |
| `categories` | Property types (apartment, villa, etc.) | ← properties             |
| `developers` | Property developers                     | ← properties             |
| `cities`     | Dubai cities/communities                | ← areas                  |
| `areas`      | Areas within cities                     | → city, amenities        |
| `amenities`  | Property/area amenities                 | ↔ areas (many-to-many)   |

---

## Future Considerations

1. **Role-Based Access Control**: Implement admin/agent/customer roles
2. **Internationalization**: Add multi-language support
3. **Search Engine**: Implement advanced search with Algolia/Meilisearch
4. **Caching**: Add Redis for frequently accessed data
5. **Analytics**: Integrate property view tracking
6. **Notifications**: Email/SMS notifications for inquiries

---

## Summary

DubaiPropertyIQ follows modern Next.js patterns with:

- **Server-first** architecture leveraging RSC
- **Clean separation** between presentation, business logic, and data layers
- **Type safety** throughout with TypeScript
- **Consistent patterns** for CRUD operations
- **Scalable structure** ready for future enhancements

The architecture prioritizes developer experience, maintainability, and scalability while leveraging the latest Next.js features for optimal performance.
