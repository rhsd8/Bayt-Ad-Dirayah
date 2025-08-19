# Harf Project

basic
A multilingual learning platform built with Next.js, featuring a responsive dashboard, mobile-first navigation, and an admin area. It includes a component library (Radix UI + shadcn-inspired components), Tailwind CSS styling, and Supabase integration scaffolding.

## Features

- Multilingual routing with locale middleware (`/en`, `/ar`, `/fr`)
- Responsive dashboard layout with desktop sidebar and mobile hamburger overlay
- Theming (light/dark) and language switcher
- Accessible UI components (Radix UI)
- Admin dashboard (with optional local bypass for development)
- Notifications, search, and rich dashboard widgets

## Tech Stack

- Next.js 15, React 19
- TypeScript
- Tailwind CSS + tailwindcss-animate
- Radix UI primitives
- Supabase client (optional; env required)

## Getting Started

### Prerequisites

- Node.js 18+
- npm (or pnpm/yarn). This repo contains both `package-lock.json` and `pnpm-lock.yaml`; use one package manager consistently.

### Install dependencies

```bash
# with npm
npm install

# or with pnpm
pnpm install
```

### Environment variables

Create a `.env.local` in the project root:

```bash
# Supabase (optional, required only if you use Supabase features)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Development-only: temporary bypass for Admin page guard
# Set to "true" to bypass role checks inside the Admin dashboard
NEXT_PUBLIC_ADMIN_BYPASS=false
```

If you don’t need Supabase right now, you can leave those values empty, but don’t import features that require them.

### Run the dev server

```bash
npm run dev
```

The app will be available at http://localhost:3000

### Build and start (production)

```bash
npm run build
npm run start
```

## Scripts

- `dev` – start Next.js in development mode
- `build` – build for production
- `start` – start a production server
- `lint` – run Next.js ESLint

## Project Structure (high level)

```
app/
  [lang]/
    admin/            # Admin route (SSR wrapper around AdminDashboard)
    ...               # Other localized routes
  globals.css         # Global styles (Tailwind)
  layout.tsx          # Root layout
components/
  ui/                 # Reusable UI components (Radix-based)
  app-layout.tsx      # App frame: header, sidebar integration
  admin-dashboard.tsx # Admin dashboard (client component)
  sidebar.tsx         # Sidebar navigation
  ...
hooks/
lib/
  supabase.ts         # Supabase client (reads NEXT_PUBLIC_* envs)
public/               # Static assets (logos, icons)
styles/
```

## Internationalization

- `middleware.ts` ensures a locale prefix exists in all routes and normalizes unsupported locales to the default.
- Supported locales: `en`, `ar`, `fr`. Default is `en`.

## Styling

- Tailwind CSS is used for styling. If your editor flags unknown `@tailwind` or `@apply` at-rules, ensure your Tailwind and PostCSS setup is active in your IDE and build tools.
  - Files: `tailwind.config.ts`, `postcss.config.mjs`, `app/globals.css`.

## Mobile Navigation

- On mobile (≤768px), the sidebar trigger is replaced with a hamburger icon in `components/app-layout.tsx`.
- Tapping the hamburger opens a full-screen overlay that slides in from the top with an "X" close button.

## Admin Access (Temporary Bypass)

- Admin UI is rendered by `components/admin-dashboard.tsx`.
- For local development without real auth, set `NEXT_PUBLIC_ADMIN_BYPASS=true` in `.env.local` and restart the dev server. This bypasses the role check inside the Admin dashboard component.
- Do not enable this in production.

## Troubleshooting

- Editor shows "Unknown at rule @tailwind/@apply": These are valid Tailwind at-rules. Ensure the Tailwind VS Code extension and your workspace is configured to use PostCSS/Tailwind processing. A production or `npm run dev` build will compile them correctly.
- Environment variables not picked up: Restart `npm run dev` after editing `.env.local`.

## Deployment

- Any Next.js-compatible platform (Vercel, Netlify, etc.). Ensure environment variables are configured in the hosting provider.
- Build command: `npm run build`
- Start command (Node server): `npm run start`

## Contributing

- Use TypeScript and keep components accessible.
- Prefer colocated components and keep UI primitives in `components/ui/`.
- Keep mobile/desktop behavior parity where applicable.

## License

See `LICENSE` for details.
