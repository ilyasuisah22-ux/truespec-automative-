This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

# TrueSpec Automotive — operations notes

## Demo / prototype inventory

The repository ships a **prototype fleet of 8 vehicles** with photographs in
`public/demo/vehicles/`. Those same records live in
`src/lib/demo/demo-data.ts` (public fields) and
`src/lib/demo/demo-records.ts` (invented cost figures), which are the single
source of truth for both the application fallback and the database seeder.

There are two ways the showroom can be served:

| Situation | What the app reads |
| --- | --- |
| `DEMO_DATA=true`, or no Supabase configured | The in-repo prototype fleet |
| Supabase connected **and `vehicles` is empty** | The in-repo prototype fleet (with an admin "Prototype inventory" notice) |
| Supabase connected with at least one vehicle | Real database rows only — the prototype fleet is never mixed in |

The last row is the important one: as soon as you add a real vehicle in
`Admin → Inventory`, the public showroom switches to database rows on its own.
The demo fallback is a *bootstrap* state, not a permanent overlay. A real
inventory that simply has no `landed` vehicles still shows a genuinely empty
"Landed" section rather than borrowing prototype cars.

## Seeding the prototype fleet into Supabase

```
npm run db:seed-demo
```

This upserts the 8 prototype vehicles, their 16 image rows, their 8 cost
records and the singleton settings row, using the same ids, slugs and columns
as `supabase/seed.sql`. It is idempotent, never deletes, and only ever touches
those fixed demo ids. It requires `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`
because anonymous clients are not allowed to write inventory.

Cost rows are written only to the RLS-protected `vehicle_finances` table; they
are never readable by anonymous callers and are never part of `PublicVehicle`.

## Removing demo data

Run once, before going live:

```
psql "<your connection string>" -f supabase/scripts/remove_demo_data.sql
```

Then set `DEMO_DATA=false` in your environment and add your first real vehicle
through `Admin → Inventory`.

## Setting the real WhatsApp number

The seeded number `2340000000000` is a clearly-marked development placeholder.
Until it is replaced, every enquiry CTA explains that WhatsApp is not
configured rather than linking to a dead number. Set the real number in
`Admin → Settings`; do not edit it in code.

