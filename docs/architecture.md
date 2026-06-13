# OS10 Document Pre-Check MVP Architecture

## Objective

Build a deployable web application that helps operations teams reduce manual review time for OS10 certificates by automating identity checks and basic document-consistency checks. The system is a pre-check assistant, not an official validator.

## Technical Decisions

- Frontend and backend: Next.js 15 with App Router and TypeScript.
- Styling: Tailwind CSS for fast product iteration.
- Auth and persistence: Supabase Auth + Supabase Postgres.
- ORM: Prisma.
- File storage: Supabase Storage.
- Validation: Zod for request, form, and server-action validation.
- OCR: Tesseract.js in a server-side processing pipeline.
- Testing: Vitest for parser/comparison logic.
- Deployment target: Vercel.

## Why Prisma over raw Supabase client

- The MVP needs a relational data model with multiple linked entities and auditability.
- Prisma gives typed queries, migrations, and a clear schema for reviewable backend evolution.
- Supabase still provides the operational platform: PostgreSQL, Auth, Storage, and optional RLS.

## System Modules

### 1. Public product surface

- Landing page focused on the operational pain.
- CTA to sign in or start a demo account flow.
- Product framing that avoids legal overclaiming.

### 2. Authentication

- Email/password sign-up and sign-in through Supabase Auth.
- Persistent sessions.
- Multi-user isolation through `user_id`.

### 3. Case management

- Create review case.
- Upload reference document and submitted document.
- Store expected identity metadata.
- View case history and case detail.

### 4. Document processing

- Accept PDF or image uploads.
- Extract text with OCR.
- Normalize candidate fields: name, RUT, dates, certificate type.
- Compute OCR confidence and extraction warnings.

### 5. Comparison engine

- Compare expected vs extracted identity fields.
- Compare reference vs submitted extracted content.
- Run basic visual/layout heuristics from OCR blocks and file metadata.
- Produce structured anomalies and recommendation.

### 6. Review result presentation

- Human-readable summary.
- Identity consistency status.
- Document consistency status.
- Suggested decision.
- Legal disclaimer.

## High-Level Flow

1. User signs in.
2. User creates a review case with expected metadata.
3. User uploads a reference document and a submitted document.
4. Files are stored in Supabase Storage.
5. A processing action extracts text and key fields.
6. Comparison rules generate anomalies and a review result.
7. Result is persisted and shown in the dashboard and case detail view.

## Application Architecture

- `app/`: routes, server actions, layouts.
- `components/`: UI primitives and domain components.
- `lib/`: Supabase, Prisma, OCR, comparison, validation helpers.
- `docs/`: architecture and validation material.
- `tests/`: parser and comparison tests.

## Security and Compliance Positioning

- No claim of official OS10 validation.
- No claim of legal authenticity.
- Uploaded files are private per authenticated user.
- Secrets only in environment variables.
- Audit logs track key actions.

## Extensibility

- Organization model can be enabled later for team-level visibility.
- External official validation can be integrated behind a separate verification stage.
- Review pipeline can evolve from synchronous server action to async queue/job processing.

## Known MVP Constraints

- OCR quality depends on image quality.
- Layout consistency is heuristic, not forensic.
- The system prioritizes suspicious cases for manual review; it does not certify documents.
