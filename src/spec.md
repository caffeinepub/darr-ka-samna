# Specification

## Summary
**Goal:** Add an authenticated admin page to create new horror stories (title, category, full text) and have new stories appear in the app without a hard reload.

**Planned changes:**
- Add a new admin route under `/admin` for creating stories that is always routable, but shows an auth-required state with Sign In when the user is not authenticated (matching the existing AdminLogoPage UX pattern).
- Build a responsive create-story form for authenticated users with fields: Title, Category (selected from existing categories list), and Full story text; ensure Hindi/Devanagari input is preserved and renders correctly.
- Implement frontend data-layer support to submit the form via the backend `addStory` method, surface readable errors (including unauthorized/admin-only), and invalidate/refetch latest, category, and search story queries after success.
- Add a visible navigation entry (desktop and mobile) to the new admin story creation page for authenticated users alongside the existing admin logo link.

**User-visible outcome:** Signed-in users can open an admin page to create a new horror story with title/category/full text (including Hindi text), submit it to the backend, and see it appear in the refreshed story lists without reloading the page; non-authenticated visitors see a Sign In required state.
