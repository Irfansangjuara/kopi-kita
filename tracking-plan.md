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

Recordings available as of 2026-10-08: two, both from the developer's own production test session (sessions are listed under <https://us.posthog.com/project/652575/replay>). The required five-tester run has not happened yet, so this section is still to be completed with tester recordings.

1. *(pending tester recording)*
2. *(pending tester recording)*
3. *(pending tester recording)*

Note for whoever fills this in: open the funnel step where people dropped, click through to the recordings of the people who did not continue, and link each finding to its recording URL (`https://us.posthog.com/project/652575/replay/<recording-id>`).
