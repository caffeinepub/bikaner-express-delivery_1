# Specification

## Summary
**Goal:** Build a mobile-first PWA delivery app for Bikaner Express Delivery with role-based access (Customer/Rider/Admin), core delivery workflow (orders, assignment, status), photo uploads, and an Android-friendly install experience.

**Planned changes:**
- Implement Internet Identity login with backend-enforced role-based authorization (Customer, Rider, Admin) and role-based routing/route protection.
- Create backend Order models and APIs for: customer order creation, admin rider assignment, status progression, and role-scoped order retrieval.
- Build Customer UI with bottom navigation: book delivery (pickup address + optional notes), order confirmation, orders list, and order detail (status + photos).
- Add parcel photo upload (Customer) and delivery proof photo upload (Rider) with backend storage and role-scoped retrieval; enable Admin viewing of both photo types.
- Add WhatsApp action on customer order detail to open WhatsApp/WhatsApp Web with a prefilled message (order ID + pickup address) plus a copyable fallback.
- Build Rider UI with bottom navigation: assigned orders list, order detail, Google Maps navigation action for pickup address, proof photo upload, and mark-delivered status update.
- Build Admin panel: dashboard overview, orders list/table with status filters, order detail, assign rider from rider list, and view status + uploaded photos.
- Implement PWA installability: web app manifest, installable icons, and an in-app “Install App” button when the install prompt is available.
- Apply a consistent Android-inspired, colorful branded theme (no plain white backgrounds) with smooth animations across all role areas; include generated static brand/PWA assets and reference them in UI and manifest.

**User-visible outcome:** Users can sign in with Internet Identity as Customer, Rider, or Admin and access a role-specific mobile-first experience: customers book deliveries and track status (with WhatsApp sharing and parcel photos), riders manage assigned orders with navigation and delivery proof, and admins assign riders, track statuses, and view order photos; the app is installable as an Android PWA.
