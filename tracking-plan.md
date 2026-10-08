Metric: at least 30% of visitors who start the booking form submit it  
(booking_submitted / booking_started, over the last 7 days)

**Metric insight (PostHog project "Kopi Kita", team 652575)**

- Funnel `menu_viewed -> booking_started -> booking_submitted`: <https://us.posthog.com/project/652575/insights/a1bQ2k97>
- Dashboard "Kopi Kita: Booking": <https://us.posthog.com/project/652575/dashboard/2184994>
- Trends, bookings per week (`booking_submitted`): <https://us.posthog.com/project/652575/insights/xHGhyg9V>
- Measured 2026-10-08, after the first production test booking: `booking_started` 1 -> `booking_submitted` 1 = **100%**, target >= 30% -> **target met, but the sample is a single session and not evidence yet**. Re-measure and update this line after the 5-person production run.

| Event | When it fires | Property | Question it answers |
| :---- | :---- | :---- | :---- |
| menu_viewed | Once when the /menu page loads | category (active tab) | How many people look at the menu? |
| booking_started | The user changes a field in the /booking form for the first time in a visit | source_page | **Metric:** how many visitors are interested enough to start booking? |
| booking_submitted | The booking API answers 201, i.e. the server saved the booking | party_size, time_slot | **Metric:** how many visitors actually complete a booking? |
| cta_clicked | The landing page's main booking CTA is clicked | cta_variant | Which CTA variant (control/test) gets more booking interest? |

The Metric depends directly on `booking_started` and `booking_submitted`. `cta_clicked` exists because the landing CTA text is being A/B tested with the `cta-landing` feature flag (control = "Booking Meja", test = "Reserve Your Table"), and the question is which variant pushes more people into the funnel.

## Privacy rules applied

- No `posthog.capture` sends a name, WhatsApp number, email, address, or free text typed by a visitor. The booking form sends only `party_size` and `time_slot` from the server response.
- Session replay keeps `maskAllInputs: true`, so form fields are not recorded as readable text.
- PostHog is not initialized on `/admin` (`instrumentation-client.ts` skips `posthog.init` when `window.location.pathname` starts with `/admin`), so the customer table is never recorded or tracked.

## Week 2 Findings

Recordings that exist on 2026-10-08: **two**, both from the developer's own production test sessions, so treat them as structural findings, not as evidence about real visitors. **Replace/extend them with the tester recordings once the 5-person run is done** (`07-cara-minta-5-tester.md`). Raw numbers below come from PostHog (`query-session-recordings-list`, `session-recording-get`, `query-funnel` via the PostHog MCP); the funnel timings come from insight `a1bQ2k97`.

1. **The CTA is never clicked, so the A/B experiment has no signal yet.** `cta_clicked` = 0 events in 7 days and the flag `cta-landing` has only 2 evaluations (1 resolved to `test`, 1 unresolved `null`); `control` was never served. The funnel session shows the visitor walking `/` -> `/menu` -> `/booking` without touching the landing CTA, and it took **17s** from `menu_viewed` to `booking_started`. Recording: <https://us.posthog.com/project/652575/replay/01a11a3c-935c-7584-9af4-db4475e53271>
   Backlog: get testers to enter through the landing page (not a direct link to `/booking`), otherwise the experiment cannot be read.

2. **A console error fired inside the booking session and Sentry has no browser issue for it.** Recording metadata reports `console_error_count: 1` on the session that completed a booking, while Sentry received no browser exception in that window — so it is most likely a handled/network error rather than a crash. `/booking` is the critical step of the metric (`booking_started -> booking_submitted`), so it is worth clearing. Recording: <https://us.posthog.com/project/652575/replay/01a11a3c-935c-7584-9af4-db4475e53271>
   Backlog: open the Console panel of that replay, reproduce locally, fix if it is ours.

3. **The global error screen is a dead end.** The second recording sits on `/sentry-example-page` for 317s with only **0.17s** of activity, 0 keypresses and a single click — PostHog labelled it "Skipped: too inactive" — after the deliberate error was thrown. The screen offers only "Something went wrong / Try again", with no way back to the menu or booking form. Recording: <https://us.posthog.com/project/652575/replay/01a11a3d-f527-7f9b-aefe-951828d47149>
   Backlog: add a link back to `/` and `/menu` in `src/app/global-error.tsx`.

## Demo/sample data

No synthetic visitors were sent to PostHog: the checkpoint asks for data from at least 5 real people, and fake sessions are easy to spot (one device, identical user agents, events seconds apart). If a populated-looking dashboard is needed for a demo (not for submission), the honest way is a separate, labelled run: send the synthetic visitors with a `demo` person property, then exclude them with PostHog's "Filter out internal and test accounts" so the reported metric stays real. Ask before doing it.
