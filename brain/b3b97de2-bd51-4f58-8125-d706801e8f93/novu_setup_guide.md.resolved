# Novu IG Reply Notifications — Setup Guide

## What Was Built

The full notification pipeline now exists. Here's what each piece does:

| File | Purpose |
|---|---|
| `src/lib/novu.ts` | Server-side Novu client + `triggerIgReplyNotification()` helper |
| `src/app/api/ig/reply/route.ts` | Webhook receiver — your IG bot POSTs here when an artist replies |
| `src/app/api/ig/test-notification/route.ts` | Dev-only test endpoint to fire a notification without a real reply |
| `src/components/NotificationInbox.tsx` | Client-side bell icon (already in Sidebar + mobile nav) ✅ |

---

## Step 1 — Get Your Novu Secret Key

1. Go to [https://dashboard.novu.co](https://dashboard.novu.co) → **API Keys**
2. Copy your **Secret Key** (starts with `ApiKey ` or similar)
3. Open `.env.local` and fill in:
   ```
   NOVU_SECRET_KEY=your_secret_key_here
   ```

---

## Step 2 — Create the Workflow in Novu Dashboard

> [!IMPORTANT]
> The workflow ID must exactly match `ig-reply-received` (or whatever you set in `NOVU_IG_REPLY_WORKFLOW_ID`).

1. Go to [https://dashboard.novu.co](https://dashboard.novu.co) → **Workflows**
2. Click **Create Workflow**
3. Name it anything — but set the **Workflow Identifier** (slug) to exactly: `ig-reply-received`
4. Click **Add Step** → select **In-App**
5. In the In-App step editor, set:
   - **Subject:** `Artist reply: {{artistName}}`
   - **Body:** `@{{instagramHandle}} replied: "{{messageSnippet}}" — [View lead]({{leadUrl}})`
6. Click **Save** then **Publish**

---

## Step 3 — Verify Your Subscriber ID

The `subscriber` prop in `NotificationInbox.tsx` and the `OPERATOR_SUBSCRIBER_ID` in `src/lib/novu.ts` both default to `69f9702caca4539eeab8f6bc`.

To confirm this is correct:
- Go to Novu Dashboard → **Subscribers**
- Your subscriber ID should be listed there
- If it's different, set it in `.env.local`:
  ```
  NOVU_OPERATOR_SUBSCRIBER_ID=your_actual_subscriber_id
  ```

---

## Step 4 — Test the Notification

Restart your dev server (so new env vars load), then run:

```bash
curl -X POST http://localhost:3000/api/ig/test-notification \
  -H "Content-Type: application/json" \
  -d '{"artistName":"Beach House","instagramHandle":"beachhouse","messageSnippet":"Hey! Would love to connect about mixing."}'
```

You should see the 🔔 bell badge appear in your sidebar immediately.

---

## Step 5 — Wire Up Your IG Bot

Point your IG DM bot's reply webhook to:
```
POST https://your-app-domain.com/api/ig/reply
```

Expected payload:
```json
{
  "instagramHandle": "artisthandle",
  "messageText": "The full reply text from the artist",
  "secret": "same value as IG_DM_WEBHOOK_SECRET"
}
```

The route will:
1. ✅ Verify the shared secret
2. ✅ Find the lead by Instagram handle
3. ✅ Log a `REPLY_RECEIVED` Activity
4. ✅ Update lead status `CONTACTED → FOLLOW_UP`
5. ✅ Fire a Novu in-app notification to the bell icon

---

## Flow Diagram

```
IG Bot receives artist reply
        │
        ▼
POST /api/ig/reply
        │
        ├─── Verify secret
        ├─── Lookup lead by @handle
        ├─── Log Activity (REPLY_RECEIVED)
        ├─── Update status → FOLLOW_UP
        │
        ▼
triggerIgReplyNotification()
        │
        ▼
Novu API → "ig-reply-received" workflow
        │
        ▼
🔔 Bell badge appears in your Sidebar
```
