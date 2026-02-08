# Specification

## Summary
**Goal:** Add a production-ready Admin Panel at `/admin` with secure username/password login and complete admin capabilities for managing orders, riders, reports, settings/rates, delivery proof enforcement, and WhatsApp deep-link messaging.

**Planned changes:**
- Create a separate Admin authentication flow at `/admin` (username + password), require an active admin session to access any admin screens, and enforce admin-only access in backend APIs.
- Add backend support for secure admin credential storage (salted+hashed), admin initialization, and server-verified login/logout sessions.
- Extend orders to support admin manual order creation and additional fields (Customer Name, Mobile Number, Pickup Location, Drop Location, Parcel Description, Payment Type: Cash/Online) while preserving existing customer order creation.
- Implement admin-controlled order status workflow with labels: New, Assigned, Picked, Delivered (mapped from existing internal status values), with admin status update UI.
- Add Rider Management in the Admin Panel (add/edit/delete) with fields Name, Phone Number, Vehicle Type (Bike), and use rider records for order assignment (no manual Principal ID in normal flow).
- Add rider location tracking via an optional stored Google Maps link per rider and render as a clickable “Open in Google Maps” action with an empty state when missing.
- Enforce delivery proof rules: require a proof photo before an order can be marked Delivered, store an automatic proof upload timestamp, and display photo + timestamp in admin order details.
- Add Admin Dashboard KPIs: Total Orders (Today/This Month), Pending Deliveries, Completed Deliveries, Active Riders, and Total Earnings (Daily/Monthly).
- Add Payments & Reports screens for Daily/Weekly/Monthly summaries (including payment type totals and earnings) with exports via CSV download and a print-friendly layout for browser PDF.
- Add WhatsApp automation as in-app deep links: message rider on assignment and message customer on delivery, with a fallback copy-message flow.
- Add Admin Settings: editable Company Name, Company Logo upload/update, Contact Numbers, and Rate List Management stored in backend and used for earnings calculations.
- Ensure the Admin Panel is responsive on mobile/desktop, uses existing brand theme/tokens, and does not break existing Customer and Rider areas; all admin copy in English.

**User-visible outcome:** Admins can visit `/admin`, log in with username/password, and use a responsive admin interface to manage orders and riders, assign deliveries, enforce delivery-proof requirements, view KPIs and reports with exports, configure settings/rates/logo, and open WhatsApp message links for riders/customers.
