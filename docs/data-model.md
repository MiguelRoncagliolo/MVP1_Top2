# OS10 Document Pre-Check MVP Data Model

## Modeling Principles

- Keep the schema small but extensible.
- Persist each review stage explicitly for auditability.
- Separate uploaded file metadata from extracted content and review result.

## Main Entities

### users

Managed by Supabase Auth. Application data references `auth.users.id`.

### organizations

Optional future model for shared visibility. Not required in MVP v1 implementation.

### review_cases

- `id`
- `user_id`
- `title`
- `expected_name`
- `expected_rut`
- `expected_document_type`
- `status`
- `created_at`
- `updated_at`

Purpose: root entity for each review workflow.

### documents

- `id`
- `review_case_id`
- `source_type` (`reference` | `submitted`)
- `storage_path`
- `file_name`
- `mime_type`
- `file_size`
- `uploaded_at`

Purpose: unify reference and submitted documents in one table while preserving source type.

### extracted_document_data

- `id`
- `review_case_id`
- `document_id`
- `source_type`
- `raw_text`
- `extracted_name`
- `extracted_rut`
- `extracted_dates` (JSON)
- `extracted_document_type`
- `text_blocks` (JSON)
- `ocr_confidence`
- `created_at`

Purpose: persist OCR output and normalized extraction results.

### document_comparisons

- `id`
- `review_case_id`
- `identity_match`
- `rut_match`
- `reference_layout_match`
- `detected_anomalies_json`
- `confidence_score`
- `summary`
- `created_at`

Purpose: store the structured comparison outcome.

### review_results

- `id`
- `review_case_id`
- `review_status`
- `recommendation`
- `notes`
- `created_at`

Purpose: store the user-facing decision layer derived from comparison signals.

### audit_logs

- `id`
- `user_id`
- `action`
- `entity_type`
- `entity_id`
- `metadata` (JSON)
- `created_at`

Purpose: trace key business operations.

## Suggested Status Enums

### review_cases.status

- `draft`
- `processing`
- `completed`
- `needs_attention`
- `failed`

### review_results.review_status

- `approvable`
- `observe`
- `reject`
- `manual_review`

## Relationship Summary

- One user has many review cases.
- One review case has many documents.
- One document can have one extraction record in MVP.
- One review case has one comparison result in MVP.
- One review case has one final review result in MVP.

## Future Extensions

- Multiple submitted documents per case.
- Team ownership through organizations.
- Async processing jobs.
- Official external verification event log.
