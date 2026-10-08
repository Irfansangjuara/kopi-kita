Metric: at least 30% of visitors who start the booking form submit it  
(booking_submitted / booking_started, over the last 7 days)

Metric insight: The PostHog dashboard insight link and measured result will be added after the project is connected and real visitor data is collected.

| Event | When it fires | Property | Question it answers |
| :---- | :---- | :---- | :---- |
| menu_viewed | Once when the /menu page loads | category (active tab) | How many people look at the menu? |
| booking_started | The user first changes a field in the /booking form during a visit | source_page | How many visitors are interested enough to start booking? |
| booking_submitted | The booking API saves the booking successfully | party_size, time_slot | How many visitors complete a booking? |
| cta_clicked | The landing page's main booking CTA is clicked | cta_variant | Which CTA variant gets more booking interest? |

The Metric depends directly on `booking_started` and `booking_submitted`.

## Week 2 Findings

No production session recordings are available yet. Add at least three findings with their PostHog recording links after five or more people complete the production test flow.
