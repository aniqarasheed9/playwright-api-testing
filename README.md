# API Test Automation — FakeStoreAPI

Automated API test suite built with **Playwright (API request context) + TypeScript**, targeting [fakestoreapi.com](https://fakestoreapi.com) — a public REST API for products, users, carts, and authentication.

This project is part of a larger QA portfolio. It sits alongside a separate [UI/E2E Playwright suite](../README.md) for SauceDemo, and demonstrates API-layer testing: CRUD coverage, schema validation, auth flows, and negative/edge-case handling — without a browser in the loop.

## Why this exists

A senior QA engineer is expected to test more than just the UI. This suite shows:

- **Functional CRUD coverage** across four resources (products, users, carts, auth)
- **Contract/schema validation** using [Ajv](https://ajv.js.org/) so breaking API changes are caught automatically, not just "status 200" happy-path checks
- **Negative & edge-case testing** — malformed input, non-existent resources, wrong HTTP methods, unknown routes
- **Real, verified assertions** — every response shape and status code in this suite was checked against the live API, not assumed (FakeStoreAPI has some quirks: `POST` returns `201`, `PUT /users/:id` doesn't echo an `id`, `limit=0` is ignored, non-existent product IDs return `200` with an empty body — the tests encode these real behaviors)

## Project Structure

```
api-test-automation/
├── tests/
│   ├── products.spec.ts          # Products CRUD + filtering/sorting
│   ├── auth.spec.ts              # Login flow, token issuance, invalid creds
│   ├── users.spec.ts             # Users CRUD
│   ├── carts.spec.ts             # Carts CRUD + user-scoped lookups
│   ├── schema-validation.spec.ts # Ajv-based contract tests for all resources
│   └── negative-cases.spec.ts    # Malformed input, 404s, unknown routes
├── utils/
│   └── validateSchema.ts         # Ajv schema validation helper
├── test-data/
│   ├── types.ts                  # TypeScript interfaces for API resources
│   ├── schemas.ts                # JSON Schemas used for contract testing
│   └── credentials.ts            # Test credentials & payloads
├── playwright.config.ts
└── tsconfig.json
```

## Features

- **No browser overhead** — uses Playwright's `request` fixture directly against the API, so the full suite runs in a few seconds
- **Schema/contract testing** — Ajv validates response shape, types, and required fields on every core resource
- **Data-driven test data** — credentials and payloads centralized in `test-data/`
- **Typed responses** — TypeScript interfaces for every resource, so test code gets autocomplete and type-checking on API responses
- **Parallel execution** — all specs run concurrently by default
- **HTML + JSON reports** — generated per run, uploaded as CI artifacts
- **CI on path-based trigger** — only runs when files under `api-test-automation/` change, so it doesn't fire on unrelated UI-suite commits in this same repo

## Setup

```bash
cd api-test-automation
npm install
```

No browser install is needed — this suite only exercises Playwright's HTTP `request` context, not a browser.

## Running Tests

| Command | Description |
|---|---|
| `npm test` | Run all API tests |
| `npm run test:headed` | N/A for API tests — kept for parity with the UI suite's script naming |
| `npm run test:debug` | Step-through debug mode |
| `npm run test:ui` | Playwright interactive UI |
| `npm run test:products` | Products suite only |
| `npm run test:auth` | Auth/login suite only |
| `npm run test:carts` | Carts suite only |
| `npm run test:users` | Users suite only |
| `npm run test:schema` | Schema/contract validation only |
| `npm run test:negative` | Negative/edge-case suite only |
| `npm run report` | Open the last HTML report |

## Test Coverage

- **Products** — list, get by id, filter by category, list categories, limit/sort query params, create, update, delete
- **Auth** — valid login returns a usable JWT, token works as a Bearer credential, wrong password rejected, unknown user rejected, missing/empty payload rejected
- **Users** — list, get by id, create, update, delete
- **Carts** — list, get by id, get by user id, create, update, delete
- **Schema validation** — product, product list, login response, user, and cart schemas validated with Ajv on every run
- **Negative/edge cases** — non-existent resource IDs, non-numeric IDs, malformed payloads, wrong field types, unsupported HTTP methods, unknown routes, boundary query params (`limit=0`, `limit=-1`)

## Notes on the target API

[FakeStoreAPI](https://fakestoreapi.com) is a mock service — writes (`POST`/`PUT`/`DELETE`) don't actually persist, and some endpoints return partial or inconsistent payloads. Where that's true, the tests assert on the *documented/observed* behavior rather than an idealized one, which is itself a realistic QA skill: testing the API you actually have, not the one you wish you had.
