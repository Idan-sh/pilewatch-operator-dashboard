# Pilewatch Operator Dashboard

Web UI for grain storage staff to monitor **sites**, **piles**, **live-style sensor readings**, and **open alerts** in one place. The app is a single-page React client with **mock data** so layouts and workflows can be reviewed without connecting to real hardware or APIs. Operators can switch **light**, **dark**, or **system** theme; the choice persists in the browser.

## Live demo

**[https://pilewatch-dashboard.idansh.dev](https://pilewatch-dashboard.idansh.dev)** - same UI as running locally, data is still mock-only.

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

### Intro

Landing view with the app shell: wordmark, **Sites** / **Alerts** navigation, theme control, and the start of the main content area.

<img width="1363" height="938" alt="Intro - app shell and landing content" src="https://github.com/user-attachments/assets/4363d402-0d29-4085-a6a0-5d58b943366b" />

### Sites

**Sites** workspace: pick a storage site, filter piles by status, choose a pile, and inspect sensor tiles and detail for the selection.

<img width="1363" height="938" alt="Sites - site selector, pile list, and sensor detail" src="https://github.com/user-attachments/assets/424e1ead-532a-4c42-b791-4f3eed47604e" />

### Alerts

**Alerts** page with a sortable table of active issues, severity cues, and expandable **Next steps** for each row.

<img width="1363" height="938" alt="Alerts - sortable table and next steps" src="https://github.com/user-attachments/assets/41cc9bf3-64d0-44ef-be83-e8e2be7a1531" />

### Alert filters

Filter and triage alerts (e.g. by severity and context) without losing sight of how many items match.

<img width="1363" height="938" alt="Alerts - filters and summary" src="https://github.com/user-attachments/assets/de8eee48-8714-41da-94cb-8cbfa454e707" />

## Scripts

| Command           | Description                            |
| ----------------- | -------------------------------------- |
| `npm run dev`     | Development server (Vite)              |
| `npm run build`   | Typecheck + production build → `dist/` |
| `npm run preview` | Serve `dist/` locally                  |
| `npm run lint`    | ESLint                                 |

## Stack

React 19, TypeScript, Vite, Tailwind CSS v4, react-router-dom. Styling uses semantic tokens and `dark:` mode (class on `html`) with light, dark, and system options.
