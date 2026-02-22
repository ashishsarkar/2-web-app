# Feature Gap Analysis — Frontend Web App Only

Items relevant to **2_web-app** (Next.js web app) — pages, components, and user flows only.

---

## ✅ Implemented

| Feature | Status |
|---------|--------|
| Web App (Next.js 14, React, App Router) | ✅ |
| Flight Search & Results | ✅ |
| Flight Detail | ✅ Seat selection, baggage status |
| Hotel Search & Results | ✅ |
| Hotel Detail | ✅ Room picker, map placeholder |
| Checkout / Payment | ✅ Mock payment, coupon, insurance |
| Booking Confirmation | ✅ Itinerary & invoice download |
| Auth (Login, Register) | ✅ Mock |
| My Bookings | ✅ Check-in links, cancel, invoice download |
| Profile + Loyalty Tier | ✅ Tier, wallet balance & top-up |
| AI Chatbot / Virtual Agent | ✅ Mock responses |
| Partner White-Label SDK | ✅ BookingWidget, HotelWidget, partner-demo |
| Help Centre | ✅ |
| Contact Us | ✅ |
| Privacy Policy | ✅ |
| Terms of Service | ✅ |
| Coupon & Promo | ✅ Promo codes at checkout (SAVE10, FLAT500, WELCOME) |
| Insurance Add-on | ✅ Travel insurance at checkout |
| Recommendations | ✅ "You might also like" on flight & hotel detail |
| Wishlist / Saved Search | ✅ Save flights/hotels, wishlist page |
| Price Alerts | ✅ Set and manage alerts page |
| Multi-currency Display | ✅ INR, USD, EUR, GBP in header |
| Invoice / Receipt Download | ✅ Confirmation & My Bookings (text) |
| Refund / Cancellation UI | ✅ Cancel button on My Bookings |
| Flight + Hotel Bundle | ✅ Bundle tab, search, checkout |
| Itinerary Download | ✅ Confirmation page (text) |
| Wallet / Credits | ✅ Balance, top-up in profile (use at checkout not wired) |
| PWA | ⚠️ manifest, offline, sw scaffolded; install prompt added |
| SSR / SEO | ⚠️ Search pages use client fetch; no JSON-LD, ISR, SSG |

---

## ❌ Missing (Frontend Web App)

### Flight

| Feature | Notes |
|---------|-------|
| — | All listed features implemented |

### Hotel

| Feature | Notes |
|---------|-------|
| Maps (real) | Still placeholder; no Google/Mapbox integration |

### Customer Experience

| Feature | Notes |
|---------|-------|
| Wallet at checkout | Pay with credits option at checkout |
| Saved searches list | Wishlist has flights/hotels; not "saved search" criteria |

### Finance (user-facing)

| Feature | Notes |
|---------|-------|
| Invoice PDF | Currently text download; PDF export |
| Refund status | Cancel UI exists; refund status display |

### Cross-Domain

| Feature | Notes |
|---------|-------|
| Itinerary PDF | Currently text; PDF generation |

### PWA & SEO

| Feature | Notes |
|---------|-------|
| PWA (full) | Workbox, offline flows beyond scaffold |
| SSR / SSG / ISR | Destinations, deals pages; JSON-LD, sitemap |
