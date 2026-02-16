# Specification

## Summary
**Goal:** Fix the current build/deployment failure so the project reliably builds and redeploys successfully.

**Planned changes:**
- Identify the root cause of the current build/deploy error from logs and adjust code/config to resolve it.
- Ensure the standard build completes without errors and canisters deploy successfully on retry with no manual edits between attempts.
- Verify the app loads post-deploy and core routes (`/`, `/category/$categoryId`, `/story/$storyId`, `/search`) render without runtime errors, while respecting immutable frontend paths and keeping backend logic in `backend/main.mo`.

**User-visible outcome:** A successful redeploy results in a working app that loads and navigates the core routes without errors.
