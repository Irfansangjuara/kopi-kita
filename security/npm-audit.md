# npm audit — Kopi Kita (2026-10-08)

Command: `npm audit --json > security/npm-audit-raw.json` (raw output kept locally, not committed)
Production-only run: `npm audit --omit=dev --json`

## Result

| Scope | critical | high | moderate | low | total |
| :---- | :---- | :---- | :---- | :---- | :---- |
| All dependencies | 0 | 5 | 0 | 0 | 5 |
| **Production dependencies only** (`--omit=dev`) | 0 | **0** | 0 | 0 | **0** |

So nothing that ships to Vercel is affected. All five findings are one dev-only chain:

| Package | Severity | Direct? | Advisory | Fixed version |
| :---- | :---- | :---- | :---- | :---- |
| `braces` (<= 3.0.3) | high | no | GHSA-vfj7-8cjw-p6xm — stack-exhaustion DoS with deeply nested patterns | > 3.0.3 (not released in the `braces` 3.x line) |
| `micromatch` | high | no | via `braces` | needs `braces` fix |
| `fast-glob` | high | no | via `micromatch` | needs `braces` fix |
| `@next/eslint-plugin-next` | high | no | via `fast-glob` | needs `braces` fix |
| `eslint-config-next` | high | yes (devDependency) | via `@next/eslint-plugin-next` | needs `braces` fix |

## What `npm audit fix` would do

`npm audit fix` (no `--force`) cannot fix any of them: the only version npm offers as "fixed" is `eslint-config-next@14.2.35`, i.e. a **major downgrade** from the installed `16.3.8`. npm's fix suggestion comes from “a version exists that is outside the vulnerable range”, not from compatibility — adopting it would drag the whole lint stack back to Next 14 and break the Next 16 toolchain.

Decision: **do not apply it** (breaking change, and the risk is dev-only anyway).

## Fixed today

Nothing to fix: no production dependency is vulnerable, and there is no non-breaking upgrade that removes the dev-only chain.

## Postponed, with reason

- **`braces` / `fast-glob` / `micromatch` / `eslint-config-next` (5 high, dev-only).** Impact requires an attacker to control the glob patterns handed to the ESLint tooling while it runs on a developer machine or CI runner. Kopi Kita passes no user input to a glob, and these packages never load in the deployed app (they are not in the production dependency tree). Action: tracked by Dependabot, upgrade as soon as `eslint-config-next` ships a chain with `braces` > 3.0.3.
- Related housekeeping found while auditing: `npm run lint` still calls `next lint`, removed in Next 16, and a plain `npx eslint .` reports 4 pre-existing errors in the admin pages. Out of scope for this checkpoint, noted in the Module 4 findings table.

## Dependabot

- Dependabot alerts: **enabled** on the repository (`PUT /repos/Irfansangjuara/kopi-kita/vulnerability-alerts` → 204).
- Dependabot security updates: **enabled** (`PUT /repos/Irfansangjuara/kopi-kita/automated-security-fixes` → 204).
- `.github/dependabot.yml` added: weekly npm and github-actions version updates.
