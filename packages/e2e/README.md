# CCUI E2E

Playwright browser tests for every public CCUI component and imperative UI entry.

The suite contains more than 350 component-tagged browser scenarios. Every public export has at least two scenarios, while complex components have higher minimums enforced by the coverage gate.

## Run

```bash
pnpm e2e:install
pnpm check:e2e-coverage
pnpm test:e2e
pnpm test:e2e:repeat
```

Use `pnpm test:e2e:ui` for Playwright's interactive runner.

The suite starts its own Vite fixture app. Fixtures and specs are grouped by domain:

- core interactions
- display and layout
- inputs and selection
- navigation and data display
- overlays, feedback, and providers

`coverage-manifest.mjs` maps all public UI exports to one of these suites. The coverage check discovers value exports directly from each tracked component `index.ts`, rejects duplicate or unknown assignments, and fails when a newly exported component has no E2E owner.

Each test title starts with one or more covered component names, for example `[Modal,Drawer]`. The coverage gate also rejects missing scenario minimums, committed skips/focus markers, and fixed `waitForTimeout` sleeps.

Fixtures can be loaded independently with `/?fixture=core`, `display`, `inputs`, `navigation-data`, or `overlays`. Tests use the shared automatic fixture to fail on browser `pageerror` and `console.error` events.

CI executes Chromium in four shards and merges the blob results into one HTML report. Failed tests retain screenshots, traces, and video. Use `pnpm test:e2e:repeat` to repeat every scenario three times when checking stability locally.
