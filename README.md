# BookNest

Discover. Read. Learn. Buy.

A full-stack Next.js (App Router) + TypeScript + Tailwind + PostgreSQL (Prisma) bookstore and
reading platform: user auth, admin dashboard, book/PDF management, an in-browser PDF reader with
progress tracking, a store with cart/checkout, and a direct UPI QR payment flow with manual admin
verification.

## 1. Prerequisites

- Node.js 18.18+ (Node 20 recommended)
- A PostgreSQL database (local Postgres, or a hosted one like Supabase/Neon/Railway)
- npm

## 2. Setup

```bash
npm install
cp .env.example .env
```

Edit `.env`:

- `DATABASE_URL` — your Postgres connection string
- `AUTH_SECRET` — a long random string, e.g. `openssl rand -base64 48`
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — the admin account's login. **Set a real password here** —
  the admin account is created by the seed script below, never by public registration.
- `UPI_ID` / `UPI_MERCHANT_NAME` — your UPI payment ID and display name
- `STORAGE_MODE` — `local` works out of the box (files saved under `/public/uploads` for
  covers and `/private-storage/pdfs` for PDFs). Switch to `s3` and fill in the `STORAGE_*`
  variables once you're ready to use S3/R2/B2 — see the TODO in `lib/storage.ts`.
- `EMAIL_SERVER` / `EMAIL_USERNAME` / `EMAIL_PASSWORD` — optional. If left blank, password-reset
  links are printed to the server console instead of emailed, so local dev still works end-to-end.
- `PAYMENT_MODE` — `test` (default) flags every order as a test order; set to `production` when
  you're ready to accept real UPI payments.

Then create the database schema and seed the admin account + starter categories:

```bash
npx prisma migrate dev --name init
npm run prisma:seed
```

Run the dev server:

```bash
npm run dev
```

Visit `http://localhost:3000`. Log in to `/admin` with `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

## 3. Project layout

```
app/                 Pages and API routes (Next.js App Router)
  api/                 All backend endpoints (auth, books, cart, orders, payments, admin/*, ...)
  admin/               Admin dashboard UI
  (auth)/              Register / login / forgot / reset password
  book/[id]/           Public book detail page
  read/[id]/           In-browser PDF reader
  store/, cart/, checkout/, orders/, favorites/, profile/, contact/
components/          Shared and admin React components
lib/                 Prisma client, auth/session, validation (zod), UPI/QR, file storage, pricing
prisma/schema.prisma Full database schema
prisma/seed.ts       Creates the admin account + starter categories from .env
```

## 4. How key requirements are implemented

- **Passwords**: bcrypt-hashed (never stored in plaintext); sessions are signed JWTs in an
  httpOnly cookie.
- **Admin access**: the `ADMIN_EMAIL` address is *reserved* — public registration rejects it —
  and the only way to create the ADMIN-role account is `npm run prisma:seed`, which reads
  `ADMIN_PASSWORD` from `.env`. Admin routes are protected both in `middleware.ts` (redirect) and
  in every `/api/admin/*` route (`requireAdmin()`), so there's no client-only gate to bypass.
- **PDF security**: PDF files are stored *outside* `/public` (in `/private-storage/pdfs`, gitignored)
  and are only reachable through `app/api/books/[id]/pdf/route.ts`, which checks the book is
  published + reading-enabled before streaming bytes, and serves them `Content-Disposition: inline`
  so there's no plain download link. This is real access control, but — as the UI states — browser
  PDF viewing is not absolute DRM; a determined user can always capture what renders on their screen.
- **Cart/checkout never trusts the client**: `/api/orders` (POST) re-reads price and stock for every
  item from the database before creating the order; the frontend's numbers are for display only.
- **UPI QR is dynamic**: `lib/upi.ts` builds a fresh `upi://pay?...` URI (and a fresh QR image) per
  order from the *server-verified* order total — the amount is never taken from the client.
- **No fake payment success**: submitting a UTR (`/api/payments/confirm`) only records the buyer's
  claim; it never changes `paymentStatus`. Only an admin action
  (`/api/admin/orders/[id]/verify-payment` or `reject-payment`) changes it, and verification is
  wrapped in a transaction that re-checks and decrements stock at that moment (inventory only ever
  changes on a verified payment, per spec).
- **Audit trail**: `AuditLog` records who verified/rejected a payment (and book create/update/delete),
  with previous/new values and a timestamp.

## 5. Known limitations to be aware of

- **Stock reservation**: checkout checks current stock at the moment the order is created, but
  doesn't "reserve" it — under high concurrency two people could check out the last copy at nearly
  the same moment. Verification re-checks stock again before decrementing, so you can't oversell
  past a verified payment, but you could have two `PAYMENT_PENDING` orders for the last copy. For a
  small-scale store this is a reasonable tradeoff; for high traffic, add row-level locking
  (`SELECT ... FOR UPDATE`) or a reservations table.
- **Rate limiting** (`lib/api-helpers.ts`) is in-memory — fine for a single server instance; use a
  Redis-backed limiter if you deploy multiple instances.
- **S3 storage** is stubbed (`STORAGE_MODE=s3` throws with a TODO) — wire up your provider's SDK in
  `lib/storage.ts` before using it in production; `local` mode works for a single-server deployment.
- **Email** falls back to console-logging the reset link when SMTP isn't configured.

## 6. Manual test checklist (matches the project spec)

Admin: log in → create category → add a reading book (cover + PDF, enable reading, publish) → add
a store book (price, stock) → confirm both appear correctly.

User: register → log in → search/filter books → open a reading book → read, close, reopen, confirm
"Continue from page N" → favorite a book → add a store book to cart → change quantity → checkout →
see the dynamic QR and correct amount/UPI ID → submit a UTR → confirm order shows "payment pending".

Admin: see the pending order with its UTR → verify payment → confirm stock decremented → update
order status through to Delivered.

User: see the order status update → after Delivered, submit a review for that book.

## 7. Deployment notes

This app has no dependency on any particular host. A common path:

1. Push to GitHub.
2. Deploy to Vercel (or any Node host).
3. Provision Postgres (Neon, Supabase, Railway, RDS, ...) and set `DATABASE_URL`.
4. Set all `.env` variables in your host's environment settings — **never commit `.env`**.
5. Run `npx prisma migrate deploy` and `npm run prisma:seed` against the production database.
6. If deploying to a serverless/ephemeral filesystem host, switch `STORAGE_MODE=s3` and finish the
   S3 integration in `lib/storage.ts` first — `local` mode's `/public/uploads` and
   `/private-storage` won't persist across deployments on most serverless platforms.
