# Specification

## Summary
**Goal:** Add per-story media support (optional thumbnail uploads and optional YouTube embeds) and improve admin discoverability and mobile usability.

**Planned changes:**
- Extend the backend story model to store an optional YouTube URL and an optional thumbnail image (bytes + content type) per story, with admin-only write and public read by story id.
- Update the admin create-story page to allow uploading an optional image thumbnail and entering an optional YouTube URL, including validation, clear English errors, and saving media during story creation.
- Update public story UI to display thumbnails on story cards and the story page (fallback to the existing placeholder when none) and embed YouTube videos on the story page with a responsive, mobile-friendly layout.
- Add a clearly visible “Add Story” entry/button in the admin area linking to `/admin/story/new`, and improve mobile layout/spacing for key admin pages (including media controls).

**User-visible outcome:** Admins can create stories with an optional thumbnail and optional YouTube link; readers see thumbnails on listings and story pages (or a placeholder) and see an embedded, mobile-friendly YouTube video when provided; the admin area has an obvious “Add Story” action and works better on small screens.
