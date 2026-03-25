# agriQ Operator Dashboard

**Task 2 - Operator Dashboard** (agriQ full-stack take-home): a React frontend that uses **mock data only** (no backend). It shows storage sites, piles, sensor readings, and alerts.

![Intro — dashboard overview](./docs/screenshots/intro.png)

## Prerequisites

- **Node.js** 20 or later - [nodejs.org](https://nodejs.org/)
- **npm** (ships with Node)

## Install and run

```bash
npm install
npm run dev
```

Then open the URL from the terminal (usually **http://localhost:5173**). Use **Sites** and **Alerts** in the header. Use the **Theme** control (Light / Dark / System) to match your preference; the choice is saved in the browser.

If `npm install` hits permission errors on the global npm cache:

```bash
npm install --cache ./.npm-cache
```

## Screenshots

Add PNG or JPG files under [`docs/screenshots/`](./docs/screenshots/) with these names so the images above and below render on GitHub:

| File | Suggested content |
| --- | --- |
| `intro.png` | Wide hero shot: header + main area (any theme) |
| `sites.png` | **Sites** — site selector, piles, sensor grid |
| `alerts.png` | **Alerts** — summary, filters, table |

Until the files exist, GitHub may show a broken image icon.

### Sites

![Sites — storage, piles, sensors](./docs/screenshots/sites.png)

### Alerts

![Alerts — open issues and next steps](./docs/screenshots/alerts.png)

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Development server (Vite) |
| `npm run build` | Typecheck + production build → `dist/` |
| `npm run preview` | Serve `dist/` locally |
| `npm run lint` | ESLint |

## Stack

React 19, TypeScript, Vite, Tailwind CSS v4, react-router-dom. Styling uses semantic tokens and `dark:` mode (class on `html`) with light, dark, and system options.
