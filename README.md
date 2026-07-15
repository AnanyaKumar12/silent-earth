# Silent Earth 🌍

A full-stack, production-ready emergency community reporting platform.
No login, no passwords — just a name and a mobile number, so people can
start reporting emergencies immediately during a disaster.

**Stack:** React + Vite + Tailwind CSS (frontend) · Node.js + Express (backend)
· Firebase Firestore + Storage (database/media) · Gemini API (AI summaries)

---

## Features

- **No authentication** — users create a lightweight local profile (name +
  mobile number) once, stored in `localStorage`. It's remembered automatically
  on every future visit; there is no login/logout flow anywhere in the app.
- **Report Emergency** — submit category, location, description, and an
  optional photo. Every report is timestamped and stored in Firestore, with
  images uploaded to Firebase Storage.
- **Categories Dashboard** — six category cards (Critical Alert, Medical,
  Food, Shelter, Missing Person, Other) with live report counts.
- **Live Feed** — reverse-chronological feed with search and category
  filtering, responsive card grid.
- **AI Summary** — every report card has an "AI Summary" button that calls
  the Gemini API to generate a 1–2 sentence summary, which is then cached in
  Firestore so it's never regenerated for the same report.
- Fully responsive dark UI, loading/error states, and form validation
  throughout.

---

## Project Structure

```
silent-earth/
├── backend/                 # Node.js + Express REST API
│   ├── src/
│   │   ├── config/          # Firebase Admin initialization
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Multer upload + error handling
│   │   ├── routes/          # Express routers
│   │   ├── services/        # Firestore, Storage, Gemini logic
│   │   └── index.js         # App entrypoint
│   ├── .env.example
│   └── package.json
└── frontend/                 # React + Vite + Tailwind
    ├── src/
    │   ├── components/       # Reusable UI components
    │   ├── context/          # Local (no-auth) account context
    │   ├── pages/            # Route-level pages
    │   ├── services/         # Axios API client
    │   ├── utils/             # Category/icon styling helpers
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env.example
    └── package.json
```

---

## Prerequisites

- Node.js 18+
- A [Firebase](https://console.firebase.google.com) project with:
  - **Firestore Database** enabled (Native mode)
  - **Storage** enabled
  - A **Service Account** key (Project Settings → Service Accounts → Generate
    new private key)
- A [Gemini API key](https://ai.google.dev/) (Google AI Studio)

---

## Setup

### 1. Clone & install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure the backend

```bash
cd backend
cp .env.example .env
```

Fill in `.env` with your Firebase service account details and Gemini key:

```
PORT=5000
CORS_ORIGIN=http://localhost:5173

FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com

GEMINI_API_KEY=your-gemini-api-key
```

> Tip: copy `project_id`, `client_email`, and `private_key` directly from the
> downloaded service account JSON file. Keep the `\n` sequences in the
> private key exactly as-is, wrapped in double quotes.

If `GEMINI_API_KEY` is left empty, the AI Summary endpoint falls back to a
simple templated summary so the rest of the app remains fully testable
without a live API key.

### 3. Configure the frontend

```bash
cd frontend
cp .env.example .env
```

```
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Run both servers

In two terminals:

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

Visit **http://localhost:5173**.

---

## Firestore Security Rules (suggested)

Since there is no authentication, lock writes down at the API layer (the
backend uses the Admin SDK, which bypasses rules) and keep client-side
Firestore access disabled entirely — all reads/writes should go through
this Express API, not directly from the browser. If you ever expose
Firestore directly to the client, start from a deny-all rule set:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## API Reference

| Method | Endpoint                          | Description                                   |
|--------|------------------------------------|-----------------------------------------------|
| GET    | `/api/health`                     | Health check                                  |
| POST   | `/api/users`                      | Create/update local user profile              |
| GET    | `/api/reports`                    | List reports (`?category=`, `?search=`)       |
| GET    | `/api/reports/category-counts`    | Report counts per category                    |
| POST   | `/api/reports`                    | Create a report (`multipart/form-data`)       |
| POST   | `/api/reports/:id/summary`        | Generate (or fetch cached) AI summary          |

---

## Notes on the "no login" model

This app intentionally has **no authentication system** by design — during a
disaster, requiring sign-up friction can cost lives. The "Create Account"
step only collects a name and mobile number, stored in the browser's
`localStorage`, and is used purely to pre-fill the reporter's name on future
reports. There are no passwords, sessions, or tokens anywhere in this
codebase.
