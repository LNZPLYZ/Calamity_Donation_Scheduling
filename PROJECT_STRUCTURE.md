# Project Structure

This guide describes the reorganized source tree and how its parts connect.
Installed dependencies and generated build output are not source files.

## Repository layout

```text
.
├── .gitignore
├── README.md
├── PROJECT_STRUCTURE.md
├── SYSTEM_WORKFLOW.md
├── indexcss.md
├── package.json
├── package-lock.json
├── assets/
│   ├── ERD.png
│   └── image.png
└── user-management/
    ├── backend/
    │   ├── .env
    │   ├── package.json
    │   ├── package-lock.json
    │   ├── server.js
    │   ├── controllers/
    │   │   ├── authController.js
    │   │   ├── donationController.js
    │   │   └── signupController.js
    │   ├── models/
    │   │   ├── calamityModel.js
    │   │   ├── donationItemModel.js
    │   │   ├── donationModel.js
    │   │   ├── transactionModel.js
    │   │   └── userModel.js
    │   ├── routes/
    │   │   ├── authRoute.js
    │   │   └── donationRoute.js
    │   └── utils/
    │       ├── generateDocumentId.js
    │       └── passwordUtils.js
    └── frontend/
        ├── index.html
        ├── package.json
        ├── package-lock.json
        ├── vite.config.js
        └── src/
            ├── App.jsx
            ├── main.jsx
            ├── index.css
            ├── components/
            │   └── Navbar.jsx
            ├── context/
            │   └── DonationContext.jsx
            ├── hooks/
            │   └── useDonationContext.js
            └── pages/
                ├── Authentication/
                │   ├── UserLoginForm.jsx
                │   └── UserSignupForm.jsx
                ├── Dashboard/
                │   └── DonatorDashboard.jsx
                └── Donations/
                    ├── DonationDetails.jsx
                    ├── DonationForm.jsx
                    └── Donations.jsx
```

`node_modules/` and `user-management/frontend/dist/` are generated folders.
The backend `.env` file contains local settings such as `PORT` and
`MONGODB_URL`; never copy its values into source files or documentation.

## Root files and assets

- **`.gitignore`** — excludes local environment files, dependencies, and build
  outputs.
- **`README.md`** — repository landing page; currently contains the project
  title.
- **`PROJECT_STRUCTURE.md`** — this source and folder guide.
- **`SYSTEM_WORKFLOW.md`** — describes application request flows.
- **`indexcss.md`** — saved CSS notes. It is documentation and is not imported
  by React.
- **`package.json` / `package-lock.json`** — root dependency metadata. The
  frontend and backend also have their own manifests. Leave dependencies in
  their current manifests unless dependency management is intentionally changed.
- **`assets/ERD.png`** — database entity/relationship diagram.
- **`assets/image.png`** — signup UI concept image; it is not an implemented
  page and is not imported by the application.

## Backend: `user-management/backend/`

### Startup and configuration

- **`server.js`** — creates the Express app, parses JSON bodies, logs requests,
  mounts auth and donation routers, handles forwarded errors, connects
  Mongoose using `MONGODB_URL`, and starts listening on `PORT`.
- **`.env`** — local backend configuration. Keep secrets private and out of
  source control.
- **`package.json` / `package-lock.json`** — backend dependencies and scripts.
  `start` runs `node server.js`; `dev` invokes `nodemon`.

### Routes and controllers

- **`routes/authRoute.js`** — maps `POST /signup` and `POST /login` within the
  `/api/auth` prefix to `authController.js`.
- **`controllers/authController.js`** — implements signup and login. Signup
  validates input, hashes passwords, assigns public users the `Donor` role,
  and returns a limited user profile. Login verifies an active user's
  credentials and returns a limited profile.
- **`routes/donationRoute.js`** — maps donation HTTP methods and optional IDs
  beneath `/api/donations` to donation controller functions.
- **`controllers/donationController.js`** — implements donation list/detail
  reads, create, update, and delete. It validates selected fields, checks
  donor/calamity references, combines separately stored donation items into
  responses, and prevents deletion when transaction history exists.
- **`controllers/signupController.js`** — empty and not imported by a route.
  Signup logic currently lives in `authController.js`; preserve this file
  unless its removal is separately approved.

### Models and utilities

- **`models/userModel.js`** — Mongoose schema for `users`, including profile
  fields, `password_hash`, role, account status, timestamps, and a generated
  string ID. Auth and donation controllers query this model.
- **`models/donationModel.js`** — Mongoose schema for `donations`; used by the
  donation controller.
- **`models/donationItemModel.js`** — schema for `donation_items`; each item
  refers to its parent donation through `donation_id`.
- **`models/calamityModel.js`** — schema for `calamities`; donation operations
  check optional calamity references and populate display names.
- **`models/transactionModel.js`** — schema for `transactions`; donation
  deletion checks it for history.
- **`utils/passwordUtils.js`** — generates and verifies salted scrypt password
  hashes for signup and login.
- **`utils/generateDocumentId.js`** — generates prefixed IDs using the year and
  a random UUID; the Mongoose models use it for document IDs.

## Frontend: `user-management/frontend/`

### Application setup and shared UI

- **`index.html`** — contains the root HTML element where React mounts.
- **`src/main.jsx`** — imports the stylesheet, wraps the app in
  `DonationContextProvider`, and renders `App`.
- **`src/App.jsx`** — sets up `BrowserRouter` and maps `/donations`, `/login`,
  and `/signup` to their pages.
- **`src/components/Navbar.jsx`** — shared title and navigation links used by
  `App`. Its title currently links to `/`, while no `/` route is defined;
  the donation page route is `/donations`.
- **`src/index.css`** — currently empty but imported by `main.jsx`; keep it as
  the app's stylesheet entry point.

### Feature pages

- **`src/pages/Donations/Donations.jsx`** — page for listing donations. It
  fetches the list on mount, reads shared context, and renders the form and
  donation detail components from this feature folder.
- **`src/pages/Donations/DonationForm.jsx`** — donation entry form. It submits
  a donation and its item list to the donation API, then updates shared state.
- **`src/pages/Donations/DonationDetails.jsx`** — displays a donation and its
  items. It requests deletion and dispatches a context update on success.
- **`src/pages/Authentication/UserLoginForm.jsx`** — submits credentials to
  `/api/auth/login` and navigates to `/donations` after a successful response.
- **`src/pages/Authentication/UserSignupForm.jsx`** — submits profile and
  credential data to `/api/auth/signup` and navigates to `/donations` after a
  successful response.
- **`src/pages/Dashboard/DonatorDashboard.jsx`** — currently empty and not
  connected to a route. Keep it as an unfinished placeholder.

### Shared state and build configuration

- **`src/context/DonationContext.jsx`** — owns the shared donation list and
  handles set/create/delete actions. The donation page and its components use
  this state.
- **`src/hooks/useDonationContext.js`** — reads the donation context and
  reports an error if used outside its provider.
- **`vite.config.js`** — configures Vite and proxies `/api` requests to
  `http://localhost:8000` during development.
- **`package.json` / `package-lock.json`** — frontend dependencies and Vite
  scripts (`dev`, `build`, and `preview`). The UI uses React, React Router,
  Material UI, and its Emotion styling dependencies.

## API route inventory

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/signup` | Create an active Donor account |
| `POST` | `/api/auth/login` | Verify an active user's credentials |
| `GET` | `/api/donations` | List donations |
| `GET` | `/api/donations/:id` | Read one donation |
| `POST` | `/api/donations` | Create a donation with items |
| `PATCH` | `/api/donations/:id` | Update allowed donation fields |
| `DELETE` | `/api/donations/:id` | Delete a donation if it has no transaction history |

## Request flow

The browser renders React from `src/main.jsx`. `App.jsx` selects a page from
the current URL. The forms and donation page send requests to `/api/...`;
during Vite development, `vite.config.js` proxies those requests to Express.
`server.js` mounts the route, the route calls a controller, and the controller
uses Mongoose models to read or write MongoDB documents. JSON responses then
drive page navigation, messages, or donation context updates.

## Implemented behavior and limits

- Signup and login endpoints exist. Signup stores a scrypt hash and assigns
  `Donor`; login verifies credentials for active accounts.
- Login does not create a persistent session or token. Donation routes do not
  currently require authentication or authorization.
- The frontend currently lists, creates, and deletes donations. Backend
  single-record GET and PATCH operations exist but are not used by the current
  donation page.
- User, calamity, and transaction models exist, but there are no complete CRUD
  routes for those entities.
- Pickup and transaction fields exist in schemas, but a full pickup scheduling
  workflow is not implemented.
