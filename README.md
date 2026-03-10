# Streater Sneakers — Full-Stack E-Commerce Portfolio

> **Live demo:** [sneakerportfolio.me](https://sneakerportfolio.me) &nbsp;|&nbsp; **Behance:** [behance.net/andrewbuga](https://www.behance.net/andrewbuga)

A fully functional sneaker store built as a portfolio piece to demonstrate production-ready full-stack web development skills — from authentication and database design to SEO and UI/UX.

![og-image](public/images/og-image.png)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database | PostgreSQL via Prisma ORM |
| Auth | JWT in httpOnly cookie + bcrypt |
| Email | Resend API |
| Deployment | Vercel |
| Package manager | pnpm |

---

## Features

- **Authentication** — register, login, logout, password reset via email, login rate limiting
- **Product catalog** — filtering by category (men/women), collection, trending
- **Product pages** — gallery, size/color selector, stock validation
- **Cart & Checkout** — persistent cart, address management, simulated payment (card/PayPal)
- **Order system** — full lifecycle `PENDING → PAID → SHIPPED → DELIVERED → CANCELLED`
- **Wishlist / Favorites** — add/remove with persistent context
- **Admin export** — Excel customer export at `GET /api/admin/export/customers`
- **SEO** — JSON-LD structured data, sitemap.xml, robots.txt, Open Graph, Twitter Cards, multilingual keywords (EN/UA/RU)
- **PWA ready** — web manifest, all icon sizes (16, 32, 180, 192, 512px)
- **Returns page** — user-friendly returns & refunds policy with FAQ
- **Responsive** — fully mobile-first, works on all screen sizes

---

## Database Schema (simplified)

```
users (1) ──→ (n) addresses
users (1) ──→ (n) orders
orders (1) ──→ (n) order_items
products (1) ──→ (n) order_items
```

---

## Local Setup

```bash
# 1. Clone
git clone https://github.com/andrew-buga/Website-for-Sneakers.git
cd Website-for-Sneakers

# 2. Install dependencies
pnpm install

# 3. Configure environment
cp .env.example .env
# Fill in: DATABASE_URL, JWT_SECRET, RESEND_API_KEY

# 4. Run migrations
pnpm prisma:migrate

# 5. Seed demo products (optional)
pnpm prisma db seed

# 6. Start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
app/                  # Next.js App Router pages
├── api/              # REST API route handlers
├── checkout/         # Checkout page
├── product/[id]/     # Dynamic product pages
├── returns/          # Returns & refunds page
├── men/ women/       # Category pages
└── ...
components/           # Reusable UI components
lib/                  # Business logic, contexts, Prisma client
prisma/               # Schema & migrations
public/               # Static assets, favicons, OG image
```

---

## CI / CD

GitHub Actions runs on every push and PR:
- ESLint
- TypeScript typecheck
- Next.js build

---

## Author

**Andrew Buga** — Full-Stack Web Developer

- Portfolio: [behance.net/andrewbuga](https://www.behance.net/andrewbuga)
- GitHub: [github.com/andrew-buga](https://github.com/andrew-buga)
- Email: [official.andrew.buga@gmail.com](mailto:official.andrew.buga@gmail.com)
- Phone: +40 740 116 669

> Want a website like this for your business? Feel free to reach out!

---

© 2026 Andrew Buga. Built for portfolio purposes.
