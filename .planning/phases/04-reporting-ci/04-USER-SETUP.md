# Phase 04: User Setup Required

**Generated:** 2026-05-14
**Phase:** 04-reporting-ci
**Status:** Incomplete

Complete these items before publishing CircuitGate as a reusable GitHub Action. Local CLI, report generation and post-processing are implemented and verified; public release still requires repository and release configuration outside the codebase.

## Environment Variables

None for normal PR execution. The action uses `github.token` automatically when `comment: true`.

## Account Setup

- [ ] **Confirm the publishing GitHub repository**
  - URL: the CircuitGate repository that will host `action.yml`
  - Skip if: this repository is already the canonical public action repository

## Dashboard Configuration

- [ ] **Create a release tag for action consumers**
  - Location: GitHub repository -> Releases -> Draft a new release
  - Set to: a stable tag such as `v0.1.0`
  - Notes: external users should reference `uses: owner/repo@v0.1.0`, not a moving branch, for reproducible CI behavior.

- [ ] **Optional Marketplace publishing**
  - Location: GitHub repository -> Releases / Marketplace metadata
  - Set to: action name, description, branding and supported inputs
  - Notes: not required for private pilot use.

## Verification

After publishing a release tag, verify from a separate test repository with:

```yaml
name: CircuitGate Review

on:
  pull_request:

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: owner/repo@v0.1.0
        with:
          project: "."
          profile: "jlcpcb"
          comment: "true"
          upload-artifact: "true"
          fail-on-severity: "critical"
```

Expected results:
- Markdown and JSON reports are uploaded as the configured artifact.
- PR comment shows the critical/high finding summary when `comment: true`.
- The workflow fails only when findings meet or exceed `fail-on-severity`.

---

**Once all items complete:** Mark status as "Complete" at top of file.
