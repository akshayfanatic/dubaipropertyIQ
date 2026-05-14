# Design

## Visual Direction

Dubai Property IQ uses refined luxury minimalism for a real estate intelligence product. The design should feel premium, trustworthy, and task-focused, with generous white space, precise alignment, subtle depth, and clear comparison surfaces.

## Color

Use the existing OKLCH token system in `app/(frontend)/globals.css`.

- Primary: royal blue, mapped through `--primary` and the `--primary-*` scale.
- Neutrals: blue-tinted backgrounds, cards, borders, and muted text.
- Accent: amber or gold only for luxury and Golden Visa moments.
- Semantic states: use existing destructive, success, warning, and info conventions where available.

Prefer token classes such as `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `text-primary`, and `bg-primary`. Avoid hard-coded hex values in UI work.

## Typography

Use the existing app font stack and Tailwind type scale. Product screens should use compact, readable hierarchy rather than oversized marketing type.

- Page headings: semibold or bold, clear but not hero-scale.
- Labels and filter text: 14px minimum on mobile.
- Body copy: keep explanatory copy short and scannable.
- Data and property details: prioritize alignment and consistent weight.

## Layout

Use a 4px spacing rhythm and the existing max content width conventions. Search and dashboard surfaces should favor predictable grids, stable sidebars, and responsive reflow.

- Desktop search: filters should remain easy to scan without crowding the results.
- Mobile search: controls should stack cleanly with full-width touch targets.
- Avoid nested cards and decorative wrappers where a single panel or plain layout is clearer.

## Components

The project uses shadcn-style primitives and local shared components:

- `components/ui/*` for buttons, inputs, cards, tabs, switches, and skeletons.
- `WidgetCard` for framed utility panels.
- `PropertyCard` for search result rows.
- `SearchFilters` and `SidebarFilters` for search controls.

Prefer existing component APIs and tokenized class names. Keep button shapes, focus rings, borders, and control heights consistent with the current UI primitives.

## Motion

Use short state transitions around 150 to 250ms. Motion should clarify hover, focus, loading, and reveal states. Do not add decorative page-load choreography.

## Search Page Notes

The search page is a product workflow. It should open directly into search controls and results, with the filter layout supporting fast refinement. The page should avoid landing-page styling, excessive copy, and ornamental visual effects.
