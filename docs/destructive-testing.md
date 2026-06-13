# OS10 Document Pre-Check MVP Destructive Testing

## Purpose

Run basic negative tests that demonstrate the system fails safely and reports uncertainty instead of inventing certainty.

## Destructive Test Set

### 1. Missing submitted document

- Action: create a case without uploading the submitted file.
- Expected result: validation error, no review execution, no false result generated.

### 2. Unsupported file type

- Action: upload a non-PDF, non-image file.
- Expected result: upload is rejected with clear guidance.

### 3. Illegible or low-quality scan

- Action: upload a blurred or partial image.
- Expected result: low OCR confidence, anomalies raised, recommendation shifted toward manual review.

### 4. Name mismatch

- Action: expected name does not match extracted name.
- Expected result: `identity_match = false`, anomaly logged, non-approvable outcome.

### 5. RUT mismatch

- Action: expected RUT does not match extracted RUT.
- Expected result: `rut_match = false`, anomaly logged, recommendation at least `observe` or `manual_review`.

### 6. Format inconsistency

- Action: use a document with clearly different text block structure from the reference.
- Expected result: `reference_layout_match = false`, anomaly raised, manual review favored.

## Failure Handling Principles

- Never fabricate extracted values.
- Never imply official validation.
- Surface uncertainty clearly.
- Preserve the uploaded case and error state for auditability when useful.

## Evidence to Record

- Screenshot or log for each destructive scenario.
- Stored review case status.
- Comparison payload showing anomalies.

## Exit Criteria

- At least one destructive test executed end-to-end and documented in README.
- All destructive scenarios have defined expected behavior before demo.
