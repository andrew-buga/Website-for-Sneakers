# Backend + DB (Phase 1 + Auth hardening)

This project now includes a server-side data layer with Prisma ORM and PostgreSQL schema, plus secure session authentication.

## Added database models

- `User`
- `Address`
- `Product`
- `Order`
- `OrderItem`
- `OrderStatus` enum

Schema source: `prisma/schema.prisma`.

## API route handlers

### E-commerce entities

- `GET/POST /api/users`
- `GET/POST /api/users/:userId/addresses`
- `PATCH/DELETE /api/users/:userId/addresses/:addressId`
- `GET/POST /api/products`
- `GET/POST /api/orders`
- `GET/PATCH /api/orders/:orderId`

### Auth (server-side)

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `PATCH /api/account/profile`

## Security policies now implemented

- Passwords are hashed on the server with `bcrypt` (no password storage in `localStorage`).
- Session token uses `httpOnly` cookie (`auth_token`) with JWT.
- Registration/login payload validation is performed on the server with `zod`.
- Password policy: min 8 chars + uppercase + lowercase + digit + special character.
- Login rate limiting: 5 attempts / 15 minutes per `ip + email` key.

## Local setup

1. Copy env:
   ```bash
   cp .env.example .env
   ```
2. Update `DATABASE_URL` and `JWT_SECRET`.
3. Generate Prisma client:
   ```bash
   pnpm prisma:generate
   ```
4. Apply migration:
   ```bash
   pnpm prisma:migrate --name init
   ```

## Notes

- Checkout/order-history UI is still being migrated from local mocks to full DB-backed user flows.
