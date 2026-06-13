# OS10 Document Pre-Check MVP Validation Plan

## Goal

Validate that the MVP reduces manual triage time and produces outputs that users understand as a pre-check, not an official verification.

## Target Evaluators

- Professor or academic evaluator.
- Operations or recruiting stakeholder.
- Administrative reviewer who currently checks documents manually.

## Validation Hypotheses

1. Users understand the product as a pre-check assistant.
2. Users can complete the happy path without guidance.
3. The review output is clearer and faster than a manual first pass.
4. Users trust the anomaly framing enough to decide which cases deserve manual review first.

## Demo Validation Script

1. Create a new account.
2. Sign in.
3. Create a case with expected name and RUT.
4. Upload a clean reference document and a candidate document.
5. Run the review.
6. Inspect the result summary, anomalies, and recommendation.
7. Open case history and confirm persistence.

## Metrics to Capture

- Time to complete first case.
- Time to understand the result.
- Number of user questions about product scope.
- Whether the user can distinguish between:
  - identity mismatch,
  - OCR uncertainty,
  - document inconsistency,
  - official validation.

## Acceptance Signals

- User can explain the product value in one sentence.
- User can interpret the review result without technical help.
- User sees the history as useful for operations traceability.
- User does not confuse the system with an official legal validator.

## Evidence to Collect

- Screenshots of happy path.
- One completed case record in the database.
- Build and lint results.
- Notes from stakeholder walkthrough.

## Risks During Validation

- OCR quality may vary with sample quality.
- Sample documents may not cover enough variation.
- Users may over-trust recommendations if disclaimer placement is weak.

## Mitigation

- Keep the disclaimer visible near all result summaries.
- Show OCR confidence and anomalies explicitly.
- Use at least one low-quality document in demo prep.
