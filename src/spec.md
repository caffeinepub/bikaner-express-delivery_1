# Specification

## Summary
**Goal:** Update the app’s UI styling to closely match the look-and-feel of the reference website (https://bikaner-express-delivery-08l.caffeine.xyz), using the uploaded screenshots as visual guidance.

**Planned changes:**
- Introduce/adjust shared design tokens (colors, typography scale, spacing, surface colors, borders/shadows) so the app theme aligns with the reference website aesthetic.
- Apply the updated theme consistently across Customer, Rider, and Admin areas (including login/setup screens) without changing backend behavior or existing user flows.
- Refine mobile UI patterns to match the reference styling:
  - Bottom navigation bar styling (height, icon/label sizing, selected/unselected states, surface/border/shadow).
  - Page padding/safe-area handling so fixed bottom navigation does not obscure content.
  - Empty-state presentation for lists (e.g., “No orders yet” card) with cohesive card elevation, padding, and readable contrast.
- Prefer centralized, reusable styling via shared theme variables/Tailwind config and shared layout wrappers (avoid one-off page-by-page styling where possible), while composing around any immutable frontend paths.

**User-visible outcome:** The app’s screens (Customer, Rider, Admin) have a consistent, modern look aligned with the reference website, including updated cards, typography, buttons, bottom navigation, and polished empty states—without changing any visible UI text away from English.
