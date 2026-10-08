# PostHog MCP answer (checkpoint Module 1, screenshot 4)

The PostHog MCP server (`https://mcp.posthog.com/mcp`) was called over streamable HTTP with a **read-only** personal API key (`kopi-kita-mcp-readonly`, scopes: `insight:read`, `query:read`, `feature_flag:read`, `session_recording:read`, `project:read`, `dashboard:read`, `person:read`, `organization:read`, `user:read`). No flag, insight or dashboard was changed — every call below is a read.

## 1. Funnel `menu_viewed -> booking_started -> booking_submitted`, last 7 days

Tool: `query-funnel`, date range `-7d` (resolved to 2026-10-01 00:00 - 2026-10-08 23:59, Asia/Jakarta).

```
Metric                           | menu_viewed | booking_started | booking_submitted
Total person count               | 1           | 1               | 1
Conversion rate                  | 100%        | 100%            | 100%
Dropoff rate                     | 0%          | 0%              | 0%
Average conversion time          | -           | 17s             | 11s
Median conversion time           | -           | 17s             | 11s
```

**At which step is the biggest drop?** None is measurable at this sample size: one session (the developer's production test) walked all three steps in 28 seconds total. The funnel itself is proven to work — data flows from the live site — but no UX conclusion can be drawn from a single session.

## 2. `cta-landing` exposures and clicks per variant

Tool: `execute-sql` (HogQL).

```sql
SELECT properties.$feature_flag_response AS variant, count() AS exposures,
       count(DISTINCT person_id) AS people
FROM events
WHERE event = '$feature_flag_called' AND properties.$feature_flag = 'cta-landing'
  AND timestamp > now() - INTERVAL 7 DAY
GROUP BY variant ORDER BY exposures DESC
```

```
variant  | exposures | people
(null)   | 1         | 1
test     | 1         | 1
```

```sql
SELECT properties.cta_variant AS variant, count() AS clicks
FROM events WHERE event = 'cta_clicked' AND timestamp > now() - INTERVAL 7 DAY
GROUP BY variant ORDER BY clicks DESC
```

```
(no rows)
```

**Reading:** two flag evaluations exist (one resolved to `test`, one unresolved `null` before flags loaded), `control` has not been served yet, and `cta_clicked` has **zero** events. PostHog's taxonomy check also reported the event `cta_clicked` as not yet present in the project's event taxonomy, which matches the empty result. The experiment cannot be read yet; it needs real visitors.

## 3. Replay comparison and three fixes, biggest impact first

Replay facts via MCP (`query-session-recordings-list`, `session-recording-get`), last 7 days:

| Recording | Duration | Active | Keypresses | Clicks | Console errors | Start URL |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| `01a11a3c-935c-7584-9af4-db4475e53271` | 78s | 2.2s | 27 | 1 | **1** | landing page (walked to `/booking` and submitted) |
| `01a11a3d-f527-7f9b-aefe-951828d47149` | 317s | 0.17s | 0 | 1 | 0 | landing page, PostHog marked it "Skipped: too inactive" |

1. **Get real visitors into the funnel before drawing any conclusion.** With n=1 funnel and 0 `cta_clicked`, every other ranking here is speculation. Highest impact, and it is on the owner: the five-tester run.
2. **Reproduce the console error that fired during the booking session** (<https://us.posthog.com/project/652575/replay/01a11a3c-935c-7584-9af4-db4475e53271>). A client-side error on `/booking` is the classic silent conversion killer, and the booking step is the metric's critical step (`booking_started -> booking_submitted`).
3. **Make the landing page earn the visit.** The 317s recording with 0.17s of activity and a single click says the visitor stayed but did not engage; the same pattern as the module's own example ("scrolled looking for prices, did not find them"). Surface the CTA and prices earlier on the landing page, then re-check the funnel's first step.

Owner's note: the developer test booking is in the PostHog funnel as 1 person; it should be excluded from the final numbers (`filterTestAccounts` or a test-account filter) once real testers arrive.
