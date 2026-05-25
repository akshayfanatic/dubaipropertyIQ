---
name: Dubai Property IQ
description: Premium Dubai real estate intelligence for property search, area research, developer context, and investment decisions.
colors:
  background: 'oklch(0.96 0.01 271.34)'
  foreground: 'oklch(0.21 0.03 263.61)'
  card: 'oklch(0.98 0.01 271.41)'
  popover: 'oklch(1 0 0)'
  primary: 'oklch(0.48 0.2 260.47)'
  primary-foreground: 'oklch(1 0 0)'
  primary-50: 'oklch(0.96 0.02 260.47)'
  primary-100: 'oklch(0.92 0.04 260.47)'
  primary-200: 'oklch(0.85 0.08 260.47)'
  primary-300: 'oklch(0.74 0.14 260.47)'
  primary-400: 'oklch(0.6 0.18 260.47)'
  primary-500: 'oklch(0.48 0.2 260.47)'
  primary-600: 'oklch(0.4 0.19 260.47)'
  primary-700: 'oklch(0.33 0.17 260.47)'
  primary-800: 'oklch(0.26 0.15 260.47)'
  primary-900: 'oklch(0.2 0.12 260.47)'
  secondary: 'oklch(0.91 0.02 260.47)'
  secondary-foreground: 'oklch(0.37 0.03 260.47)'
  muted: 'oklch(0.94 0.02 260.47)'
  muted-foreground: 'oklch(0.55 0.02 260.47)'
  accent: 'oklch(0.95 0.02 260.47)'
  accent-foreground: 'oklch(0.48 0.2 260.47)'
  border: 'oklch(0.89 0.02 260.47)'
  input: 'oklch(0.9 0.01 260.47)'
  ring: 'oklch(0.48 0.2 260.47)'
  destructive: 'oklch(0.58 0.22 27.29)'
  golden-visa-soft: '#fef3c7'
  golden-visa-text: '#92400e'
  golden-visa-border: '#fde68a'
typography:
  display:
    fontFamily: 'Inter, sans-serif'
    fontSize: 'clamp(2rem, 4vw, 3rem)'
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: '0'
  headline:
    fontFamily: 'Inter, sans-serif'
    fontSize: '1.5rem'
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: '0'
  title:
    fontFamily: 'Inter, sans-serif'
    fontSize: '1.125rem'
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: '0'
  body:
    fontFamily: 'Inter, sans-serif'
    fontSize: '0.875rem'
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: '0'
  label:
    fontFamily: 'Inter, sans-serif'
    fontSize: '0.875rem'
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: '0'
rounded:
  sm: 'calc(var(--radius) - 4px)'
  md: 'calc(var(--radius) - 2px)'
  lg: 'var(--radius)'
  xl: 'calc(var(--radius) + 4px)'
spacing:
  xs: '0.25rem'
  sm: '0.5rem'
  md: '0.75rem'
  lg: '1rem'
  xl: '1.5rem'
  '2xl': '2rem'
components:
  button-primary:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.primary-foreground}'
    typography: '{typography.label}'
    rounded: '{rounded.md}'
    padding: '0.5rem 1rem'
    height: '2.25rem'
  button-secondary:
    backgroundColor: '{colors.secondary}'
    textColor: '{colors.secondary-foreground}'
    typography: '{typography.label}'
    rounded: '{rounded.md}'
    padding: '0.5rem 1rem'
    height: '2.25rem'
  button-outline:
    backgroundColor: '{colors.background}'
    textColor: '{colors.foreground}'
    typography: '{typography.label}'
    rounded: '{rounded.md}'
    padding: '0.5rem 1rem'
    height: '2.25rem'
  input-default:
    backgroundColor: '{colors.background}'
    textColor: '{colors.foreground}'
    typography: '{typography.body}'
    rounded: '{rounded.lg}'
    padding: '0.5rem 0.75rem'
    height: '2.75rem'
  card-default:
    backgroundColor: '{colors.card}'
    textColor: '{colors.foreground}'
    rounded: '{rounded.xl}'
    padding: '1.5rem'
  badge-primary:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.primary-foreground}'
    typography: '{typography.label}'
    rounded: '{rounded.lg}'
    padding: '0.25rem 0.75rem'
---

# Design System: Dubai Property IQ

## 1. Overview

**Creative North Star: "The Quiet Valuation Desk"**

Dubai Property IQ should feel like a calm advisory workspace for high-value Dubai real estate decisions. The interface is premium because it is clear, disciplined, and data-aware, not because it is ornamental. The product should make property discovery, area research, developer review, calculators, and enquiry actions feel connected inside one trustworthy intelligence layer.

The physical scene is a buyer or investor comparing listings on a laptop in daylight, then checking the same shortlist on mobile between viewings. That scene points to a light, blue-tinted product system with compact hierarchy, stable controls, strong focus states, and restrained motion. Admin screens can be denser, but they should still inherit the same clarity and token discipline.

The system rejects aggressive brutalism, heavy gradients, playful rounded controls, excessive shadows, generic SaaS decoration, fake-glass surfaces, cluttered listing-portal layouts, and luxury clichés such as dark navy-and-gold overload. If the UI delays search, comparison, or decision support for decorative impact, it is off-brand.

**Key Characteristics:**

- Premium restraint with visible intelligence.
- Blue-tinted neutrality, not plain white or black.
- Compact hierarchy for search, filters, property cards, calculators, and dashboards.
- Subtle depth only where it clarifies interaction or grouping.
- Amber used only for Golden Visa and rare eligibility or luxury cues.

## 2. Colors

The palette is restrained: royal blue carries trust and action, blue-tinted neutrals carry most surfaces, and amber is reserved for Golden Visa significance.

### Primary

- **Royal Intelligence Blue** (`primary`): The main action and trust color. Use it for primary buttons, active filters, prices, focus rings, chart lead series, compact icon containers, and decisive enquiry actions.
- **Royal Blue Scale** (`primary-50` through `primary-900`): Use for hover states, passive emphasis, selected filters, charts, and small tonal backgrounds. Prefer existing token opacity such as `primary/10` or `primary/90` over new one-off blues.

### Secondary

- **Blue Mist Control Surface** (`secondary`): Use for secondary buttons, off-plan status badges, and low-emphasis controls. It supports the primary blue without competing for attention.

### Tertiary

- **Golden Visa Amber** (`golden-visa-soft`, `golden-visa-text`, `golden-visa-border`): Use only for Golden Visa eligibility, residency value, premium qualification, and rare luxury cues. It is not a general warning, highlight, or CTA color.

### Neutral

- **Blue-Tinted Canvas** (`background`): Main public product background. It is intentionally not pure white.
- **Lifted Card Surface** (`card`): Listing cards, calculators, utility panels, admin widgets, and framed content sections.
- **Ink Navy Text** (`foreground`): Main text color, tuned toward blue-black rather than pure black.
- **Muted Listing Copy** (`muted-foreground`): Descriptions, helper text, secondary metadata, placeholders, and subdued labels.
- **Quiet Divider Blue** (`border`, `input`): Borders, inputs, separators, filter panels, and card edges.
- **Destructive Red** (`destructive`): Errors, invalid form states, and destructive actions only.

### Named Rules

**The Amber Rarity Rule.** Amber is reserved for Golden Visa and eligibility significance. If amber appears on a generic button, chart, empty state, or marketing flourish, remove it.

**The Blue Trust Rule.** Primary blue guides action and decision: search, contact, active state, price emphasis, focus, and selected filters. Do not use it as broad decoration.

**The Tinted Neutral Rule.** Never use pure black or pure white for product surfaces. Neutrals stay slightly blue-tinted so the product remains cohesive and premium.

## 3. Typography

**Display Font:** Inter (with sans-serif fallback)  
**Body Font:** Inter (with sans-serif fallback)  
**Label/Mono Font:** JetBrains Mono for frontend code/data contexts where available, IBM Plex Mono where inherited in dashboard contexts.

**Character:** Typography is compact, direct, and operational. It supports comparison and decision-making, with weight and spacing doing more work than oversized type.

### Hierarchy

- **Display** (700, `clamp(2rem, 4vw, 3rem)`, `1.08`): Use for rare public page headings and major landing moments. Do not use display scale inside search results, property cards, calculators, admin tables, or sidebars.
- **Headline** (700, `1.5rem`, `1.2`): Use for page titles, calculator titles, area/developer headings, and major workflow sections.
- **Title** (600, `1.125rem`, `1.35`): Use for property names, cards, widgets, panel titles, and tab content sections.
- **Body** (400, `0.875rem`, `1.5`): Use for descriptions, field text, property details, support copy, and admin content. Keep long reading lines under 75ch.
- **Label** (500, `0.875rem`, `1.25`): Use for controls, filters, buttons, tabs, field labels, status badges, and metadata. Mobile labels and filter text should not drop below 14px.

### Named Rules

**The Comparison First Rule.** Prices, locations, amenities, developer signals, and eligibility information must remain more legible than decorative headings.

**The No Hero Inside Tools Rule.** Product workflows use compact hierarchy. Save display scale for true page-level context only.

## 4. Elevation

The system uses borders, tonal layers, and modest shadows. Clickable property cards may lift on hover; static calculators, forms, admin widgets, and filter panels should rely on border plus card background. Depth is a response to hierarchy or interaction, not a decorative layer.

### Shadow Vocabulary

- **Soft Resting Shadow** (`--shadow-sm: 0 1px 2px rgb(0 0 0 / 0.06)`): Use on standard cards, badges, and controls that need slight separation from the blue-tinted canvas.
- **Medium Product Shadow** (`--shadow-md: 0 4px 6px rgb(0 0 0 / 0.08)`): Use for clickable property result cards and elevated interactive panels.
- **Lifted Hover Shadow** (`--shadow-lg: 0 10px 15px rgb(0 0 0 / 0.1)`): Use sparingly on hover states such as property result cards.
- **Dashboard Shadow Scale** (`--shadow-xs` through `--shadow-2xl`): Available in dashboard styles, but lower shadows are the default. High shadows are for overlays, popovers, and clear stacking needs.

### Named Rules

**The Flat Until Useful Rule.** Resting surfaces are quiet. Add shadow only when it improves grouping, affordance, or hover feedback.

**The No Floating Stack Rule.** Do not nest cards or stack multiple framed containers to manufacture depth.

## 5. Components

Components are shadcn-style primitives adapted for a premium real estate intelligence product. They should be predictable, tokenized, keyboard-visible, and compact enough for repeated search and admin use.

### Buttons

- **Shape:** Gently squared controls (`rounded-md`, approximately `6px`). Avoid playful pills for primary product actions.
- **Primary:** Royal blue background with primary foreground text, medium label weight, `h-9` default height, `h-10` large height, and icon gaps of `0.5rem`.
- **Hover / Focus:** Hover darkens to `primary/90`. Focus uses visible ring treatment such as `ring-[3px] ring-ring/50` and must remain keyboard-visible.
- **Secondary / Ghost / Tertiary:** Secondary uses the blue mist surface. Ghost buttons are for toolbars, tabs, and quiet navigation. Link buttons are text-only and should not impersonate primary actions.

### Chips

- **Style:** Badges are compact, rounded, and high-signal. Default badges use `text-xs`, `font-medium`, transparent borders, and tokenized backgrounds.
- **State:** Available and active states use primary blue. Muted states use neutral surfaces. Golden Visa chips use the amber family only.

### Cards / Containers

- **Corner Style:** Property and UI cards use `rounded-xl`. Utility panels use the same family unless a local primitive requires `rounded-lg`.
- **Background:** Use `bg-card` for framed surfaces and `bg-background` for fields or inner controls.
- **Shadow Strategy:** Property results rest at `shadow-md` and can lift to `shadow-xl` on hover with `-translate-y-0.5`. Utility widgets rest at `shadow-sm`.
- **Border:** Use tokenized borders. Do not use colored side-stripe borders.
- **Internal Padding:** Standard cards use `1.5rem`; search and listing cards can compress to `1rem` on mobile and expand to `1.5rem` on desktop.

### Inputs / Fields

- **Style:** Inputs are `h-11`, full-width, `rounded-lg`, bordered with `border-input`, and use `bg-background`. Search fields may include a muted 16px icon at left with `pl-10`.
- **Focus:** Use visible focus rings without layout shift. Prefer `ring-2 ring-ring ring-offset-2` or the shadcn `ring-[3px] ring-ring/50` pattern.
- **Error / Disabled:** Error states use destructive border and destructive focus ring. Disabled fields use opacity reduction and a not-allowed cursor.

### Navigation

- **Style:** Navigation and tabs are compact, familiar, and state-driven. The line tab variant uses transparent active backgrounds with a 2px underline indicator.
- **Typography:** Active navigation uses semibold weight. Inactive navigation stays muted but readable.
- **Mobile Treatment:** Controls stack into full-width targets where needed. Primary mobile workflow controls must remain at least 44px tall.

### Property Cards

- **Structure:** Property results are image-led comparison rows on desktop and stacked cards on mobile. Keep the image stable, the price prominent, and the title no more than two lines.
- **Image Treatment:** Use subtle overlays only to preserve badge legibility. Image hover scale can run at `700ms`, but it must not distract from listing data.
- **Metadata:** Bed, bath, and size sit in a compact `primary/10` pill. Location uses a muted icon and truncates safely.
- **Action:** Contact actions must stay visually clear and tokenized, with enough width for mobile tapping.

### Detail Pages

- **Structure:** Property detail pages use gallery, quick navigation, overview, developer, key information, location, amenities, and FAQ sections. Each section should feel like due diligence, not brochure filler.
- **Sidebar:** Sidebar enquiry and summary content should remain visible, compact, and action-oriented on desktop, then stack cleanly on mobile.
- **Maps and Galleries:** Media should reveal the property or area clearly. Do not hide useful inspection detail under heavy overlays.

### Filter Panels

- **Structure:** Search filters use grid tracks that preserve input width. Sidebar filters group advanced controls with concise headers, border dividers, and stable spacing.
- **Golden Visa Toggle:** The toggle row may use an amber icon container. Keep the row itself calm with border, background, and hover `muted/50`.
- **Reset Action:** Reset is outline plus destructive text and border, not a filled destructive block unless the action is irreversible.

### Calculators

- **Structure:** Mortgage and rent-versus-buy calculators should feel like tools, not landing pages. Inputs, outputs, schedules, and explanations must align tightly.
- **Output Emphasis:** Use primary blue for the leading result and muted surfaces for secondary calculations. Do not use oversized hero metrics that crowd the actual form.

## 6. Do's and Don'ts

### Do:

- **Do** use the existing OKLCH token system in `app/(frontend)/globals.css` for public product UI.
- **Do** keep property discovery decisive: price, location, eligibility, amenities, and search refinement should be immediately scannable.
- **Do** use primary blue for action, focus, active state, price emphasis, selected filters, and enquiry actions.
- **Do** preserve 44px touch targets on mobile search, filters, pagination, and contact controls.
- **Do** use borders and tonal surfaces before adding more shadow.
- **Do** keep calculator outputs and schedules aligned, compact, and readable.
- **Do** keep explanatory copy short, concrete, and close to the field, result, or property data it supports.
- **Do** keep Golden Visa cues amber and rare.

### Don't:

- **Don't** use aggressive brutalism.
- **Don't** use heavy gradients.
- **Don't** use playful rounded controls.
- **Don't** use excessive shadows.
- **Don't** use generic SaaS decoration.
- **Don't** use fake-glass surfaces as a default treatment.
- **Don't** create cluttered listing-portal layouts that make comparison feel noisy.
- **Don't** make the product feel like a cheap lead-generation site.
- **Don't** use dark navy-and-gold overload as a luxury shortcut.
- **Don't** use border-left or border-right greater than 1px as a colored side-stripe accent.
- **Don't** use gradient text.
- **Don't** nest cards inside cards.
- **Don't** turn search pages, calculators, property detail pages, or admin screens into marketing landing pages.
