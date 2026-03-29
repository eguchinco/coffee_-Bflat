# AGENTS.md

## Scope

- This file applies to the `coffee_-Bflat` repository only.
- This project is a Next.js App Router storefront for `Bflat` coffee subscriptions.
- Keep the implementation MVP-focused and consistent with the existing stack:
  - Next.js App Router
  - Tailwind CSS + shadcn/ui
  - Stripe
  - Supabase
  - Resend
  - microCMS

## Working Rules

- Prefer small, direct changes over broad refactors.
- Preserve user changes. Do not revert or overwrite unrelated work.
- Use `apply_patch` for manual file edits.
- Avoid adding new dependencies unless they materially reduce risk or complexity.
- Keep code ASCII unless the file already uses other characters.

## Clarify Before Guessing

- If a request affects product behavior, copy, pricing, deployment, secrets, or operational flow, ask a short QA question before editing.
- Do not invent values for credentials, price IDs, webhook secrets, or production settings.
- If a decision has multiple valid paths, surface the tradeoff and wait for confirmation.

## Verification

- After any code change, run the repo checks before finishing:
  - `npm run verify`
- If a check fails, fix the cause and rerun until it passes or the blocker is clearly external.
- If `npm run verify` is unavailable for some reason, run `npm run lint`, `npm run typecheck`, and `npm run build` individually.
- If the request is documentation-only, still run at least `npm run build` when the change can affect the shipped app.

## Delivery

- When asked to implement something, carry it through end-to-end instead of stopping at a plan.
- Report what changed, what was verified, and any remaining external setup the user must complete.
- If you need a judgment call from the user, ask the minimum number of questions needed to unblock the work.
