# Specification

## Summary
**Goal:** Add engagement features to stories: make all stories public by default, show read counts, enable public name+message comments, and add a site-wide follow button with follower count.

**Planned changes:**
- Make newly created stories immediately publicly visible and included in the public latest stories feed with no publish/draft state.
- Add a persistent per-story view counter, incrementing once per story page load, and display “Total reads: N” on the story reading page.
- Update the story comments section to allow public comments (display name + message) readable and postable by unauthenticated visitors, with non-empty validation.
- Add a prominent site-wide Follow/Following button that requires Internet Identity to follow/unfollow, persists follow state per principal, and displays total follower count (no emails).
- Ensure all new UI elements match the existing dark horror theme and are fully responsive/mobile-friendly.

**User-visible outcome:** Visitors can read stories immediately after they’re created, see total reads on story pages, post and view public comments without signing in, and signed-in users can follow/unfollow the site and see the follower count.
