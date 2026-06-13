import type { NewLeadInput } from "./types";

/**
 * Owner notification on a new lead.
 * Credential-free: if NOTIFY_WEBHOOK_URL is set (Zapier / Make / n8n / a WhatsApp
 * gateway), POSTs the lead there. Otherwise logs in dev. Never throws — a failed
 * notification must not break the booking.
 */
export async function notifyOwner(lead: NewLeadInput): Promise<void> {
  const url = process.env.NOTIFY_WEBHOOK_URL;
  if (url) {
    try {
      await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ type: "new_lead", lead, at: new Date().toISOString() }),
      });
    } catch {
      // swallow — booking already succeeded
    }
    return;
  }
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.info(`[lead] ${lead.name} (${lead.phone}) — ${lead.service} / ${lead.area} / ${lead.urgency}`);
  }
}
