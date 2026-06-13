# OS10 Document Pre-Check MVP

Web application for documentary pre-check of OS10 certificates and related documents. The product helps operations teams compare expected identity data and basic document consistency signals before a final human review.

## Product Positioning

This MVP is a pre-check assistant. It does not perform official OS10 validation and does not certify legal authenticity.

## Core Flow

1. User signs in.
2. User creates a review case.
3. User uploads a reference document and a submitted document.
4. The system extracts text and key identity fields.
5. The system compares identity and basic document consistency.
6. The result is stored and shown in the dashboard and case detail view.

## Documentation

- [Architecture](./docs/architecture.md)
- [MVP Scope](./docs/mvp-scope.md)
- [Data Model](./docs/data-model.md)
- [Validation Plan](./docs/validation-plan.md)
- [Destructive Testing](./docs/destructive-testing.md)

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase Postgres
- Prisma
- Supabase Storage
- Tesseract.js
- Zod
- Vitest

## Implemented Modules

- Landing page with product framing and CTA.
- Supabase Auth login and registration flows.
- Multi-user case isolation by `user_id`.
- Prisma data model for cases, documents, OCR output, comparisons, results, and audit logs.
- Case creation with reference and submitted document upload.
- OCR/text extraction using PDF parsing and Tesseract for images.
- Comparison engine for identity, RUT, reference structure, anomalies, and recommendation.
- Dashboard, new case, case detail, and validation pages.
- Basic automated tests for comparison logic.

## Local Setup

1. Copy `.env.example` into `.env`.
2. Configure Supabase project values and `DATABASE_URL`.
3. Install dependencies with `npm install`.
4. Run `npm run db:generate`.
5. Run `npm run db:migrate`.
6. Run `npm run storage:init`.
7. Start the app with `npm run dev`.

## Scripts

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run test`
- `npm run db:generate`
- `npm run db:migrate`
- `npm run db:seed`
- `npm run storage:init`

## Validation Status

- `lint`: passing
- `test`: passing
- `build`: passing

## Current Constraints

- Full runtime requires real Supabase and PostgreSQL configuration.
- OCR confidence depends on document quality.
- Document consistency checks are heuristic and intentionally non-forensic.

## Legal/Operational Note

All outputs must be interpreted as documentary pre-check signals such as match, inconsistency, anomaly, or manual-review recommendation.
