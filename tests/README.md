# QA Test Evidence

These Playwright tests intentionally assert the expected FuelPass behavior from
`CANDIDATE.md`, `project-overview.md`, and `design-system.md`. Failing tests
against the challenge build are evidence for the matching finding IDs.

Commands:

```bash
npm run test:api
npm run test:ui
npm run test:e2e
```

The backend stores data in memory. Run tests from a fresh Playwright-launched
server for the clearest baseline. Tests run serially to avoid mutating shared
state in parallel.
