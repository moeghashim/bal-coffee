# Bal Coffee

Bal Coffee is a Next.js App Router site for a naturally caffeine-free coffee made from roasted date seeds.

## Stack

- Next.js 15 canary
- React 19
- Tailwind CSS 4
- pnpm

## Local Development

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

The site runs at [localhost:3000](http://localhost:3000).

## Environment

Copy `.env.example` to `.env.local` and adjust values as needed:

```bash
SITE_NAME="Bal Coffee"
SHOPIFY_STORE_DOMAIN="bal-coffee.myshopify.com"
SHOPIFY_STOREFRONT_ACCESS_TOKEN=""
SHOPIFY_STOREFRONT_API_VERSION="2025-10"
```

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm test
pnpm prettier
pnpm prettier:check
```
