# Coding Standards - Dubai Property IQ

## Inline Comment Standards

### When to Write Comments

**DO comment:**
- Complex business logic or algorithms
- Non-obvious decisions or workarounds
- API integrations with external services
- TODO items for future improvements
- Performance considerations

**DON'T comment:**
- Obvious code (e.g., `// increment counter` for `i++`)
- Code that speaks for itself through good naming

### Comment Format

```typescript
// Single-line comment: Explain WHY, not WHAT

/**
 * Multi-line comment for functions/components
 *
 * @param param - Description of parameter
 * @returns Description of return value
 *
 * @example
 * const result = functionName(arg);
 */
```

### JSDoc Standards

```typescript
/**
 * Fetches property data from the Dubai API
 *
 * @param propertyId - Unique identifier for the property
 * @param includeHistory - Whether to include price history
 * @returns Promise resolving to property data or null if not found
 *
 * @throws {APIError} When the API request fails
 *
 * @example
 * const property = await fetchProperty('prop_123', true);
 */
export async function fetchProperty(
  propertyId: string,
  includeHistory = false
): Promise<PropertyData | null> {
  // Implementation
}
```

### TODO Comments

```typescript
// TODO: [AUTHOR] - Add input validation for property IDs
// FIXME: [AUTHOR] - Handle edge case when API returns empty array
// HACK: [AUTHOR] - Temporary workaround for API rate limiting
// NOTE: [AUTHOR] - This function will be deprecated in v2.0
```

### Component Documentation

```typescript
/**
 * PropertyCard Component
 *
 * Displays a property listing with key details including:
 * - Property image and title
 * - Price and location
 * - Key amenities
 *
 * @param property - The property data to display
 * @param onFavorite - Callback when favorite button is clicked
 */
export function PropertyCard({ property, onFavorite }: PropertyCardProps) {
  // Implementation
}
```

### TypeScript-Specific Guidelines

- Use JSDoc for exported functions and complex types
- Comment non-trivial type definitions
- Explain type assertions when necessary

```typescript
/** User role with permissions for property management */
export type UserRole = 'admin' | 'agent' | 'viewer';

/**
 * Property search filters
 * All fields are optional - undefined means "no filter"
 */
export interface PropertyFilters {
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  bedrooms?: number;
}
```

### File Header (For Complex Modules)

```typescript
/**
 * Property Data Service
 *
 * Handles all API interactions related to property data:
 * - Fetching individual properties
 * - Search and filtering
 * - Caching layer for performance
 *
 * @module services/propertyService
 * @author Dubai Property IQ Team
 * @created 2025-02-17
 */
```

## Code Style Principles

1. **Clarity over cleverness** - Write code that's easy to understand
2. **Fail fast** - Validate inputs early
3. **No dead code** - Remove unused imports, variables, and functions
4. **Meaningful names** - Variables/functions should self-document
5. **Small functions** - Keep functions focused and under 50 lines when possible
