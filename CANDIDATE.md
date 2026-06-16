# FuelPass QA Challenge — Candidate Brief

Welcome, and thanks for taking the time. This is a **practical QA exercise**, not a trick test.
We want to see how you think, how you decide what matters, and how you prove a defect.

**Time-box: ≤ 3 hours.** Don't polish endlessly — we're more interested in your approach and
reasoning than in exhaustive coverage.

## The scenario

You've joined FuelPass as a QA engineer. Engineering has shipped the first version of the
**fuel order** feature (list orders → book fuel for an aircraft → view the order). Before it goes
to the pilot customers, **you** are the last line of defence.

The build **contains a number of deliberately planted defects**. They span several categories:

- **Functional / business logic** (e.g. calculations, sorting, filtering)
- **Input validation**
- **Backend / API behaviour**
- **Design-system compliance** (see `design-system.md`)
- **Accessibility**

We are **not telling you how many** there are. Find as many as you can.

## Your sources of truth

- `project-overview.md` — what FuelPass is and the product intent.
- `design-system.md` — the visual + interaction contract (colours, typography, status system, a11y rules).
- The running app itself (`npm run dev`).

If the app's behaviour contradicts these documents or basic common sense for a financial
marketplace, that's a candidate defect.

## What to deliver

1. **A `findings.md` file** listing each issue you found. For every issue include:
   - a short **title**
   - **severity** (e.g. critical / high / medium / low) and a one-line justification
   - **category** (functional / validation / API / design / accessibility)
   - **steps to reproduce**
   - **expected vs. actual** behaviour
   - **how you verified it** — the automated test that covers it (file + test name), or your
     documented manual steps

2. **Evidence for each issue — tested your way.** **How you test is entirely up to you.**
   There is **no pre-wired test runner** in this repo on purpose. You may:
   - **Introduce your own test suite(s)** with whatever framework(s) you prefer — backend
     (e.g. Jest, Vitest, supertest) and/or frontend/UI (e.g. Playwright, Cypress,
     Vitest + Testing Library). Automated, reproducible tests are great evidence.
   - **And/or test manually** — documented, repeatable manual steps (and screenshots where
     useful) are perfectly acceptable evidence too.

   Mix and match as you see fit. If you add automated tests, make sure we can **install and run
   them** — document the exact commands in `findings.md`.

## Rules

- **AI tools are explicitly allowed and encouraged** (Copilot, ChatGPT, Claude, etc.). Use whatever
  you'd use on the job.
- You may read and run anything in the repo. You do **not** need to fix the bugs — just find and
  prove them (though noting a likely root cause or fix is a nice bonus).
- Keep your changes in the repo (a branch or a zip is fine).

## How we'll assess

In a short follow-up conversation we'll ask you to **explain your approach**:

- How did you decide *what* to test first, and why?
- How did you prioritise the issues by severity/risk?
- Why did you choose the testing approach you did (automated vs manual, which tools, which levels)?
- What would you do with more time, and what did you consciously *not* do?

We value clear reasoning, good prioritisation, and solid evidence over raw count.

## Getting started

```bash
npm install
npm run dev          # app on http://localhost:5173, API on http://localhost:3001/api
```

There is no preset test command — set up and run whatever testing you choose (automated and/or
manual), and document any commands you add.

Good luck — have fun, and tell us what you find.
