# Website-for-Sneakers

## Architecture
- **Frontend**: Next.js App Router pages/components.
- **Backend API**: Next.js Route Handlers under `app/api/*`.
- **Database**: PostgreSQL via Prisma ORM.
- **Auth**: JWT in `httpOnly` cookie + bcrypt password hashes.

## ER (simplified)
- `users (1) -> (n) addresses`
- `users (1) -> (n) orders`
- `orders (1) -> (n) order_items`
- `products (1) -> (n) order_items`

## Key features
- Secure register/login with password policy + login rate limit.
<<<<<<< ours
- Password reset flow with expiring reset token.
=======
>>>>>>> theirs
- Product inventory model with `sku`, `sizes`, `colors`, and `stock`.
- Checkout stock checks and option validation.
- Order lifecycle: `PENDING -> PAID -> SHIPPED -> DELIVERED` (+ `CANCELLED`).
- Customer order history API with pagination.
- Admin Excel export endpoint: `GET /api/admin/export/customers`.

## Local setup
1. Copy env: `cp .env.example .env`
2. Install: `pnpm install`
3. Migrate DB: `pnpm prisma:migrate`
4. Start: `pnpm dev`

## CI
<<<<<<< ours
GitHub Actions runs lint + typecheck + build on push/PR.
=======
GitHub Actions runs lint + typecheck on push/PR.
>>>>>>> theirs
