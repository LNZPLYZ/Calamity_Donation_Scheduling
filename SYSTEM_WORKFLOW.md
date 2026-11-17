# System Workflow

This guide describes behavior implemented in the current source. It covers
signup/login and donation management; it does not treat the transaction schema
as a completed pickup-scheduling feature.

## Application startup

1. Vite serves `user-management/frontend/index.html`, which loads
   `src/main.jsx`.
2. `main.jsx` renders `App` inside `DonationContextProvider`.
3. `App.jsx` uses React Router to show:
   - `/donations` — `src/pages/Donations/Donations.jsx`
   - `/login` — `src/pages/Authentication/UserLoginForm.jsx`
   - `/signup` — `src/pages/Authentication/UserSignupForm.jsx`
4. The backend `user-management/backend/server.js` configures Express JSON
   parsing and logging, mounts `/api/auth` and `/api/donations`, and connects
   Mongoose using `MONGODB_URL`.
5. Express listens on `PORT` after MongoDB connects. During development, Vite
   forwards `/api` requests to `http://localhost:8000`; the backend must use
   that port for this proxy setting to work unchanged.

## Signup

1. `UserSignupForm.jsx` collects profile fields and credentials.
2. On submit, it sends JSON with `POST /api/auth/signup`. It checks
   `response.ok` and navigates to `/donations` only after a successful response.
3. `server.js` mounts `authRoute.js` at `/api/auth`; `authRoute.js` maps
   `/signup` to the `signup` handler in `authController.js`.
4. The handler validates the required fields, checks for an existing email,
   hashes the password using `passwordUtils.js`, and creates the user with
   role `Donor` and status `Active`. The role is assigned on the server, not
   accepted from the public form.
5. The backend responds with HTTP 201 and a limited user profile. The password
   hash is not included in the response.

## Login

1. `UserLoginForm.jsx` sends email and password as JSON to
   `POST /api/auth/login`.
2. `authRoute.js` maps `/login` to the `login` handler in `authController.js`.
3. The handler normalizes the email, finds the user with Mongoose, checks that
   the account is active, and verifies the password with `passwordUtils.js`.
4. On success, the backend returns HTTP 200 and a limited profile. The frontend
   then navigates to `/donations`; invalid credentials show an error instead.

Login currently confirms credentials only. It does not create a session or
token, and the frontend does not retain an authenticated-user state.

## Listing donations

1. `src/pages/Donations/Donations.jsx` calls `GET /api/donations` when the
   donation page loads.
2. Vite proxies the request to Express. The donation router maps its `/` path
   to `getDonations`, producing the full URL `/api/donations`.
3. `donationController.js` queries `Donation`, sorts newest first, populates
   selected donor and calamity fields, and calls `attachItems` to fetch and
   group related `DonationItem` records.
4. The controller returns the enriched list as JSON. The page dispatches
   `SET_DONATIONS` to `DonationContext`, which causes React to render one
   `DonationDetails.jsx` card per donation.

## Creating a donation

1. `src/pages/Donations/DonationForm.jsx` collects a donor ID, optional
   calamity ID, pickup details, and one or more items.
2. The form sends JSON to `POST /api/donations`.
3. `donationRoute.js` maps the request to `createDonation` in
   `donationController.js`.
4. The controller filters donation fields through a whitelist, requires a
   donor and at least one item, checks that the donor is active with role
   `Donor`, and checks an optional calamity reference.
5. Mongoose saves the donation and item documents in a MongoDB session
   transaction so the records are created together.
6. The controller returns the created donation, populated references, and
   items. The form dispatches `CREATE_DONATION` to update shared state.

## Deleting a donation

1. `src/pages/Donations/DonationDetails.jsx` sends
   `DELETE /api/donations/:id`.
2. `donationRoute.js` maps the request to `deleteDonation`.
3. The controller checks for transaction history. If any exists, deletion is
   rejected with HTTP 409. Otherwise, it deletes the donation's items and the
   donation inside a transaction.
4. On success, the component dispatches `DELETE_DONATION`; on failure, it
   keeps the donation visible and shows an error.

## Other donation API operations

| Method | Path | Handler | Current frontend use |
| --- | --- | --- | --- |
| `GET` | `/api/donations` | `getDonations` | Called by the donations page |
| `GET` | `/api/donations/:id` | `getDonation` | Not called by current UI |
| `POST` | `/api/donations` | `createDonation` | Called by `DonationForm.jsx` |
| `PATCH` | `/api/donations/:id` | `updateDonation` | Not called by current UI |
| `DELETE` | `/api/donations/:id` | `deleteDonation` | Called by `DonationDetails.jsx` |

`updateDonation` filters changes to allowed donation fields, validates
replacement donor/calamity references, asks Mongoose to run schema validators,
and returns the updated donation with its items. It does not edit item records.

## Error handling and limitations

- Signup validation failures return HTTP 400; duplicate email returns HTTP 409.
- Login rejects unknown, inactive, or incorrect credentials with HTTP 401.
- Missing donations return HTTP 404. Donations with transaction history cannot
  be deleted and return HTTP 409.
- Other controller errors go to the Express error middleware in `server.js`,
  which logs the error and returns JSON.
- Signup and login do not establish persistent authentication. Donation APIs
  are not protected by authentication or authorization middleware.
- The frontend currently has no update-donation UI, although a PATCH API route
  exists. `DonatorDashboard.jsx` is empty and is not registered as a route.
- User, calamity, and transaction models exist, but there are no complete CRUD
  APIs for those collections. Pickup-scheduling fields alone do not implement
  a scheduling workflow.

## Current navigation note

`App.jsx` defines `/donations`, `/login`, and `/signup`. The title link in
`src/components/Navbar.jsx` currently points to `/`, which has no matching
route; adjust that link or add a root route separately if desired.
