# Krisantus Collections

Krisantus Collections is a Vite + React + TypeScript web application for a creative printing and branding studio. It includes a public-facing website for services, showcase, about, and contact pages, plus an admin area protected with Supabase authentication.

## Prerequisites

Before you start, make sure you have the following installed:

- Node.js 18 or newer
- npm 9 or newer
- A Supabase project

## 1. Clone the repository

```bash
git clone <your-repository-url>
cd KRISANTUS_COLLECTIONS
```

## 2. Install dependencies

```bash
npm install
```

## 3. Set up environment variables

Create a `.env.local` file in the project root and add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-or-public-key
```

These variables are used in `src/lib/supabase.ts` and are required for the app to connect to Supabase.

> If the app is using auth-protected admin pages, make sure your Supabase project has an enabled authentication method and at least one valid user account.

## 4. Run the app locally

Start the development server:

```bash
npm run dev
```

Then open the app in your browser:

```text
http://localhost:5173/
```

If you need the app available on your local network, use:

```bash
npm run dev -- --host
```

## 5. Production build

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Available scripts

```bash
npm run dev      # Start the Vite development server
npm run build    # Type-check and build the app for production
npm run preview  # Preview the production build locally
npm run lint     # Run ESLint checks
```

## Admin access

The admin login page is protected by Supabase Auth. After signing in with a valid Supabase user, you can access the dashboard and CMS-related routes.

## Project structure

```text
src/
  components/     Shared UI components
  layouts/        Page layout wrappers
  lib/            Supabase and app utility setup
  pages/          Public and admin pages
  types/          Type definitions
public/           Static assets
```

## Troubleshooting

### The app does not start
- Confirm Node.js and npm are installed correctly.
- Run `npm install` again.
- Make sure no other service is already using port 5173.

### Supabase auth errors
- Check that `.env.local` exists and contains the correct values.
- Verify the keys match your Supabase project.
- Restart the Vite dev server after changing environment variables.

### Blank page or missing app data
- Confirm your Supabase project is active.
- Check browser console logs for runtime issues.
- Ensure your database tables and auth setup are configured if you are using data-backed pages.

## Notes

This project is built with:

- React
- Vite
- TypeScript
- Supabase
- React Router



