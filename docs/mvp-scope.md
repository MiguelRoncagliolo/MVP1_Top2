# OS10 Document Pre-Check MVP Scope

## Problem Statement

Companies that hire or manage private-security-related personnel often review OS10 certificates manually. This is slow, repetitive, and error-prone, especially when checking identity consistency and document format before a final human decision.

## Core Value Proposition

The MVP pre-checks OS10-related documents by comparing expected identity data and basic document consistency signals, helping teams prioritize which cases require manual review.

## In Scope

- Public landing page that explains the problem and product clearly.
- User registration and login.
- Persistent multi-user data.
- Case creation with expected name, RUT, and optional document type.
- Upload of one reference document and one submitted document per case.
- OCR extraction of raw text and key fields.
- Basic comparison engine with:
  - identity match,
  - RUT match,
  - reference layout consistency heuristic,
  - anomaly list,
  - confidence score,
  - structured summary.
- Review history and case detail pages.
- Validation and destructive testing documentation.
- Vercel-ready deployment structure.

## Out of Scope

- Official OS10 verification.
- Legal authenticity certification.
- Biometric face matching.
- Advanced forgery detection.
- Bulk case import.
- Team admin roles and permissions beyond user-level isolation.
- Real-time async processing infrastructure beyond MVP needs.

## Happy Path

1. User signs in.
2. User creates a review case.
3. User uploads a reference file and a submitted file.
4. User enters expected identity data.
5. System extracts text and candidate fields.
6. System compares the two documents and expected values.
7. System returns a structured pre-check result.
8. System stores the case and result for later review.

## Minimum Edge Cases

- Missing file.
- Unsupported file type.
- Low OCR confidence.
- Incomplete OCR extraction.
- Name mismatch.
- RUT mismatch.
- Visible inconsistency between reference and submitted structure.

## Success Criteria

- The main flow works live end-to-end.
- Users can sign in and see only their cases.
- A review case persists after reload.
- The system returns a non-hardcoded structured result.
- The landing page clearly explains the operational pain and non-legal scope.

## Non-Negotiable Product Language

All outputs must be framed as:

- match / no match,
- consistency / inconsistency,
- anomaly detected,
- requires manual review.

The product must always display:

`This result is a documentary pre-check and does not replace official validation.`
