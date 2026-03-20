# API Contract Matrix (Phase 1 Baseline)

This document captures the current as-is API contract for the existing Node.js handlers.
It is intentionally descriptive, not prescriptive, and includes known quirks that are
protected by tests during rearchitecture work.

## Backend API Routes

| Route | Methods | Required Headers | Required Query | Required Body | Typical Success | Typical Error Cases |
| --- | --- | --- | --- | --- | --- | --- |
| `/api/users` | `POST` `GET` `PUT` `DELETE` | `token` for `GET/PUT/DELETE` | `email` for `GET/PUT/DELETE` | `POST`: `firstName`, `lastName`, `email`, `address`, `passWord`, `tosAgreement=true`; `PUT`: one or more updatable fields (`firstName`,`lastName`,`passWord`) | `200` | `400` missing fields, `403` token mismatch, `405` method not allowed |
| `/api/tokens` | `POST` `GET` `PUT` `DELETE` | none | `id` for `GET/DELETE` | `POST`: `email`,`passWord`; `PUT`: `id`,`extend=true` | `200` | `400` validation/auth errors, `404` token not found on `GET`, `405` method not allowed |
| `/api/menuItems` | `GET` | `token` | `email` | none | `200` with `MenuItems` array | `400` missing email/token, `403` token mismatch/read error, `405` method not allowed |
| `/api/cart` | `POST` `GET` `PUT` `DELETE` | `token` | `email` for `GET/PUT/DELETE` | `POST`: `email`,`cart[]`; `PUT`: `cart[]` | `200` | `400` missing/invalid data, `403` token mismatch, `405` method not allowed |
| `/api/charge` | `POST` | `token` | none | `email`; optional `stripeID` | `200` | `400` missing token, token mismatch, missing cart, downstream charge/mail errors, `405` method not allowed |

## Frontend and Static Routes

| Route | Methods | Response Type | Notes |
| --- | --- | --- | --- |
| `/` | `GET` | HTML | Home page template |
| `/account/create` | `GET` | HTML | Account creation page |
| `/account/edit` | `GET` | HTML | Account edit page |
| `/menu` | `GET` | HTML | Menu page |
| `/cart` | `GET` | HTML | Cart page |
| `/checkout` | `GET` | HTML | Checkout page |
| `/session/create` | `GET` | HTML | Login page |
| `/session/deleted` | `GET` | HTML | Logged out page |
| `/favicon.ico` | `GET` | Favicon | Static asset |
| `/public/*` | `GET` | css/png/jpg/plain/favicon | Public assets |

## Notes on Current Behavior

- Email validation is simple (`@` and `.com` checks), not RFC-complete.
- Token IDs are effectively treated as 19-char strings by validators.
- Token auth is implemented per-handler, not centralized middleware.
- Storage is file-backed under `.data`, and charge logs are under `.logs/charges`.
