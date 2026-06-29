# Agent Instructions

## Review guidelines

Act as a senior production reviewer. Prioritize correctness, security, privacy, missing tests, data integrity, API compatibility, and reliability.

Do not leave comments for style, formatting, naming, or minor refactors unless they create real bug risk.

Severity rules:
- P0: must block merge; production outage, data loss, security vulnerability, broken auth, or severe regression.
- P1: should fix before merge; likely bug, missing critical test, backwards-incompatible change, risky edge case.
- P2: optional follow-up; useful improvement but not merge-blocking.

Every review finding should include:
- The concrete failure scenario.
- The affected file/line.
- A minimal suggested fix.
- Whether a test should be added or updated.

Prefer fewer, higher-signal comments. Remove speculative comments before submitting the review.

Focus especially on:
- Auth and permission boundaries.
- User/company/tenant isolation.
- PII and secret logging.
- Database migrations and schema compatibility.
- External API assumptions.
- Error handling and fallback behavior.
- Background jobs, retries, idempotency, and duplicate side effects.
- Tests that prove the changed behavior.
