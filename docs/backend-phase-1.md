# Backend phase update

## Done
- Prisma/PostgreSQL models for users, addresses, products, orders, order_items.
- Secure auth (bcrypt + JWT httpOnly cookies).
- Login rate limit and password-strength checks.
- Inventory fields on products: `sku`, `sizes`, `colors`, `stock`.
- Checkout stock/options validation in `POST /api/orders`.
- Order lifecycle transition API in `PATCH /api/orders/:orderId`:
  - `PENDING -> PAID -> SHIPPED -> DELIVERED`
- Customer order history with pagination: `GET /api/orders?page=&pageSize=`.
- Order details endpoint: `GET /api/orders/:orderId`.
- Admin Excel export: `GET /api/admin/export/customers` (`exceljs`).
- Basic admin page: `/admin` with "Export customers to Excel" and product create/list.

## Notes
- Data should stay in DB; Excel is export-only.
- Admin-only endpoints require a user with `role=ADMIN`.
