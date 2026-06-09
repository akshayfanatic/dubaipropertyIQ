# Releases

Curated release notes for Dubai Property IQ, generated from `CHANGELOG.md`.

Each version includes a simple overview for non-technical readers, followed by technical highlights.

## 0.9.1 - 2026-06-08

[Compare changes](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.9.0...v0.9.1)

### Overview

This release improved communication, search, and Golden Visa discovery. Users can now interact with a dedicated Golden Visa page, while the team has better email support and cleaner filtering.

### Highlights

- Integrated Resend as the third-party email API.
- Added a dedicated Golden Visa page with server-side filtering.
- Added new search filter fields on the filter page.
- Improved developer page filters, lead filtering in admin, and calculator page design.

### Fixes

- Updated favicon and site title.
- Fixed loading suspense skeleton issue.
- Prevented Golden Visa-only fields from appearing on the Golden Visa page.

## 0.9.0 - 2026-06-04

[Compare changes](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.8.0...v0.9.0)

### Overview

This release added building pages and building management. The platform can now show building-level information publicly and manage building data from the backend.

### Highlights

- Added full building support: database migration, types, validation, server functions, forms, routes, and public display components.
- Added PDF package support.
- Added metadata support for single property pages.
- Redesigned dashboard components.

### Fixes

- Displayed dynamic area cards.
- Added reset-password success acknowledgement.
- Hid homepage banner stats on mobile.

## 0.8.0 - 2026-06-03

[Compare changes](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.7.4...v0.8.0)

### Overview

This release focused on capturing customer enquiries and improving public discovery. Visitors can submit leads from more pages, and property pages became stronger for search engines.

### Highlights

- Added lead capture system for public pages and admin.
- Redesigned homepage banner.
- Added SEO support for properties.
- Redesigned search page functionality and UI.
- Switched frontend font to Jakarta.

### Fixes

- Renamed homepage search param from `location` to `q`.
- Fixed mobile tabs responsiveness.

## 0.7.4 - 2026-06-02

[Compare changes](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.7.3...v0.7.4)

### Overview

This release made the website feel more complete for visitors. It added wishlist saving, newsletter signup, and many visual improvements across important public pages.

### Highlights

- Added newsletter section to homepage.
- Added property wishlist support.
- Redesigned footer, homepage banner, navigation, blog page, developer page, area page, and property sections.
- Added reusable quick-navigation hook.

## 0.7.3 - 2026-06-01

[Compare changes](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.7.2...v0.7.3)

### Overview

This release started the customer-side account experience and made admin property management faster. Admin users can update property status with fewer clicks.

### Highlights

- Added customer scaffolding with minimal UI.
- Added quick action button for changing property status from the filter view.
- Refined area editor comments UI and home property card design.

## 0.7.2 - 2026-05-28

[Compare changes](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.7.1...v0.7.2)

### Overview

This release added blog management foundations. The team can manage blog content from the backend, making the platform ready for news, guides, and SEO content.

### Highlights

- Added blog database migration, server functions, types, and backend display support.
- Updated frontend fonts.
- Added suggested links in category and amenity forms.
- Refactored Tiptap editor types.

## 0.7.1 - 2026-05-25

[Compare changes](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.7.0...v0.7.1)

### Overview

This release improved navigation and search behavior. It also made property uploads stricter so listings have enough images before submission.

### Highlights

- Added developer links to mega menu.
- Added `nuqs` support for query-param-based search components.
- Added upload validation requiring at least three images.

### Fixes

- Fixed mega menu responsiveness on desktop and mobile.
- Redesigned property cards and skeletons.

## 0.7.0 - 2026-05-22

[Compare changes](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.6.0...v0.7.0)

### Overview

This release expanded the public website with area, city, and About pages. Visitors can browse location-based content and contact the team about properties through WhatsApp.

### Highlights

- Added dynamic About page.
- Added city, areas, and city-related public property data.
- Added desktop mega menu.
- Added property and area query support by city.
- Added reusable WhatsApp property button.

### Fixes

- Fixed area photo column type issues.
- Fixed generated database type compatibility.

## 0.6.0 - 2026-05-18

[Compare changes](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.5.2...v0.6.0)

### Overview

This release added developer profile pages. Users can now view property developer information in a structured public layout.

### Highlights

- Added dynamic developer information pages and layout.
- Added developer page management components.
- Refactored public breadcrumb component props.

## 0.5.2 - 2026-05-18

[Compare changes](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.5.1...v0.5.2)

### Overview

This release improved maps and search page behavior. Property pages became smoother while loading, and map locations became easier to adjust.

### Highlights

- Added draggable map support.
- Added `nuqs` for query params.
- Added dynamic property skeletons.
- Centralized enum values for property status.

### Fixes

- Moved Codex skill instructions to `AGENTS.md`.

## 0.5.1 - 2026-05-16

[Compare changes](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.5.0...v0.5.1)

### Overview

This release refined the public property and developer browsing experience. It added better redirects, progress UI, and cleaner property styling.

### Highlights

- Added shadcn progress bar.
- Added redirects to public properties and developers.
- Removed unused property components.
- Updated frontend route-group CSS variables and property styling.

## 0.5.0 - 2026-05-14

[Compare changes](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.4.1...v0.5.0)

### Overview

This release introduced stronger public page structure. Visitors got better page layouts, breadcrumbs, maps, and search input behavior.

### Highlights

- Added public breadcrumb and public page layout.
- Added Leaflet map on the public side.
- Refactored calculator layouts and public search input.
- Moved SWR fetcher behavior into global SWR configuration.
- Refined shadcn primitives and component styling.

## 0.4.1 - 2026-04-30

[Compare changes](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.4.0...v0.4.1)

### Overview

This release made the homepage more useful and interactive. It added featured cities, tools, WhatsApp property enquiries, and a rent-versus-buy calculator.

### Highlights

- Added animation slider wrapper and reusable Swiper navigation.
- Added featured cities and homepage city display.
- Added homepage tools section.
- Added WhatsApp chat for property enquiries.
- Added rent vs buy calculator.
- Added settings caching to reduce network calls.

## 0.4.0 - 2026-04-24

[Compare changes](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.3.5...v0.4.0)

### Overview

This release built major homepage and search features. Users can discover properties by city, developer, and search filters, while admin and data handling became more secure.

### Highlights

- Added data access layer to protect auth-related proxy API routes.
- Added developer and city property sections to homepage.
- Added reusable base search form, search result components, and search page.
- Added featured property schema support.
- Added reusable tabs, slider wrapper, typewriter component, and price range component.
- Updated Supabase CLI package.

### Fixes

- Fixed developer form defaults and generated Supabase type consistency.
- Fixed search suspense boundary issue.
- Fixed navigation button tooltip and hydration concerns.

## 0.3.5 - 2026-04-18

[Compare changes](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.3.4...v0.3.5)

### Overview

This release added the foundation for editable content pages. Admin users can manage website pages with a rich text editor.

### Highlights

- Added Tiptap editor package.
- Added admin pages list and edit content flows.
- Added page types and shadcn switches.

### Fixes

- Added loading files and editor styling for pages.

## 0.3.4 - 2026-04-17

[Compare changes](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.3.3...v0.3.4)

### Overview

This release added site settings and profile image management. Admin users can manage website settings and upload avatars more easily.

### Highlights

- Added reusable avatar upload component.
- Added site settings table, types, queries, settings configuration, and dashboard navigation.
- Added avatar URL support for user updates.
- Reorganized profile, providers, settings, uploads, and UI widget structure.
- Added global SWR configuration.
- Added reusable tabs and widget cards.

## 0.3.3 - 2026-04-14

[Compare changes](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.3.2...v0.3.3)

### Overview

This release improved the admin dashboard. Admin users got dashboard statistics, better property sections, and cleaner error handling.

### Highlights

- Added group-level 404 handling.
- Added dashboard stats and supporting dashboard components.
- Added CRUD data access and mutation functions.
- Added property tabs and generated dashboard types.

### Fixes

- Fixed redirection, property type issues, select-field typing, and data-table hover style.

## 0.3.2 - 2026-04-09

[Compare changes](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.3.1...v0.3.2)

### Overview

This release added user management for admin. Admin users can view and manage users from the dashboard.

### Highlights

- Added admin users CRUD.
- Enabled users route in dashboard/admin.
- Added admin types, shadcn card, user list, and single user page flow.

## 0.3.1 - 2026-04-09

[Compare changes](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.3.0...v0.3.1)

### Overview

This release improved property details by connecting amenities, areas, and map locations. Property listings can now show richer location and amenity information.

### Highlights

- Added location JSONB column for areas.
- Added area amenity and area property migrations.
- Added property amenity relationships and selection support.
- Added map package support and project architecture documentation.
- Refactored dashboard forms into reusable dumb components.

### Fixes

- Fixed property filter popover responsiveness.
- Improved custom toaster styling.

## 0.3.0 - 2026-04-04

[Compare changes](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.2.7...v0.3.0)

### Overview

This release was a major admin foundation. It added management screens for properties, cities, areas, amenities, and developers, plus image upload support.

### Highlights

- Added full admin CRUD foundation for cities, areas, amenities, developers, and properties.
- Added filter/search page.
- Added database migrations for cities, areas, amenities, developers, and image storage.
- Added image upload, image object, alt tag, and Supabase storage helpers.
- Added CI workflow for lint, typecheck, and build.
- Added reusable form actions, filter controls, reset buttons, image gallery, and validation schemas.

### Fixes

- Fixed area shape, dynamic slug, image uploader state sync, migrations, lint, and generated type issues.

## 0.2.7 - 2026-03-31

[Compare changes](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.2.6...v0.2.7)

### Overview

This release added property categories. Admin users can create and manage categories, and visitors can use categories to browse properties.

### Highlights

- Added category CRUD with uncategorized protection.
- Added category types, validation schemas, filters, admin pages, and public category availability.
- Added reusable page-level suspense skeleton.
- Added `FORBIDDEN` HTTP status support.

## 0.2.6 - 2026-03-27

[Compare changes](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.2.5...v0.2.6)

### Overview

This release added the main property management system. Admin users can create, edit, upload photos, and view properties in a table.

### Highlights

- Added admin properties feature with create/edit form, photo uploads, data table, and pagination.
- Added category admin CRUD methods.
- Added toast notifications.
- Upgraded Supabase package.
- Added reusable animated table skeleton.

### Fixes

- Fixed property loading, migrations, server action upload size, property form, and property/category types.

## 0.2.5 - 2026-03-24

[Compare changes](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.2.4...v0.2.5)

### Overview

This release improved app reliability. It added better configuration handling and clearer error screens when something goes wrong.

### Highlights

- Added client configuration.
- Added global error handling.

### Fixes

- Improved environment validation error display in the browser.

## 0.2.4 - 2026-03-21

[Compare changes](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.2.3...v0.2.4)

### Overview

This release improved login and account access. Users can see a login button and profile menu, while the header and footer became cleaner.

### Highlights

- Added login button and profile popover.
- Shared profile dropdown across public frontend and dashboard.
- Modularized header and footer.

### Fixes

- Fixed version bump branch issue.
- Fixed theme toggle hydration issue.

## 0.2.3 - 2026-03-21

[Compare changes](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.2.2...v0.2.3)

### Overview

This release improved the user experience when pages are missing and added dark mode for admin users.

### Highlights

- Added global and group-level 404 handling.
- Added dark mode for admin dashboard.

## 0.2.2 - 2026-03-20

[Compare changes](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.2.1...v0.2.2)

### Overview

This release cleaned up the login and password reset screens. The auth pages became easier to maintain and more consistent.

### Highlights

- Reorganized public auth folder structure.
- Extracted reusable auth form fields and auth card.
- Refactored route configuration.

### Fixes

- Fixed reset-password token handling by checking token hash.

## 0.2.1 - 2026-03-19

[Compare changes](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.2.0...v0.2.1)

### Overview

This release fixed password change behavior and improved how the app connects to the server during secure actions.

### Fixes

- Added temporary session handling for password changes.
- Reused a single server client instance instead of creating one repeatedly.

## 0.2.0 - 2026-03-18

[Compare changes](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.1.13...v0.2.0)

### Overview

This release added authentication and the first protected admin dashboard. Users can sign in, reset passwords, and access role-based dashboard areas.

### Highlights

- Added authentication flow, callbacks, forgot-password, reset-password, email confirmation, and user API routes.
- Added middleware/proxy auth utilities and role-based access control for admin, agent, and customer.
- Added protected dashboard with profile page.
- Added admin dashboard using shadcn/ui.
- Added properties page and admin not-found page.
- Reorganized public/auth layouts.

### Fixes

- Fixed role lookup from JWT custom claims.
- Replaced `middleware.ts` with `proxy.ts` for Next.js 16.
- Removed unused auth proxy variable.

## 0.1.12 - 2026-03-03

[Compare changes](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.1.11...v0.1.12)

### Overview

This release added the first homepage hero section with a search form, giving visitors a clear starting point.

### Highlights

- Added homepage banner section with search form.

## 0.1.11 - 2026-03-02

[Compare changes](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.1.10...v0.1.11)

### Overview

This release improved mobile navigation and accessibility, making the site easier to use on small screens.

### Fixes

- Fixed WCAG issue in dialog/sheet title handling.
- Fixed mobile navigation menu issue.

## 0.1.10 - 2026-03-02

[Compare changes](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.1.8...v0.1.10)

### Overview

This release added the app footer and cleaned up project configuration.

### Highlights

- Added app footer.
- Refactored MCP JSON configuration.

## 0.1.9 - 2026-02-27

[Compare changes](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.1.8...v0.1.9)

### Overview

This release added footer integration so the website had a more complete page structure.

### Highlights

- Added footer integration.

## 0.1.8 - 2026-02-27

[Compare changes](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.1.7...v0.1.8)

### Overview

This release added user-friendly error and not-found pages so visitors do not see broken blank screens.

### Highlights

- Added error handling UI.
- Added not-found page component.

## 0.1.7 - 2026-02-27

[Compare changes](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.1.6...v0.1.7)

### Overview

This release improved the header design so the site looked more consistent.

### Highlights

- Improved header styling consistency.

## 0.1.6 - 2026-02-27

[Compare changes](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.1.5...v0.1.6)

### Overview

This version was kept as a release checkpoint. The changelog does not list user-facing changes for it.

### Highlights

- Version reserved in changelog with no notable entries.

## 0.1.5 - 2026-02-26

[Compare changes](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.1.4...v0.1.5)

### Overview

This release fixed version logging so releases could be tracked more clearly.

### Fixes

- Fixed version log issue.

## 0.1.4 - 2026-02-26

[Compare changes](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.1.3...v0.1.4)

### Overview

This version was kept as a release checkpoint. The changelog does not list user-facing changes for it.

### Highlights

- Version reserved in changelog with no notable entries.

## 0.1.3 - 2026-02-26

[Compare changes](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.1.2...v0.1.3)

### Overview

This release added project safety checks before pushing code, helping prevent broken builds from being shared.

### Fixes

- Added Husky v9 shebang and pre-push build hook.

## 0.1.2 - 2026-02-26

[Compare changes](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.1.1...v0.1.2)

### Overview

This version was kept as a release checkpoint. The changelog does not list user-facing changes for it.

### Highlights

- Version reserved in changelog with no notable entries.

## 0.1.1 - 2026-02-26

### Overview

This was the first project setup release. It prepared the design system and development environment for the Dubai Property IQ platform.

### Highlights

- Set up Claude project support.
- Initialized shadcn/ui with design tokens.
