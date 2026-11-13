import "server-only";
import { readySmsBody } from "./orders";
import { toUsE164 } from "./phone";

export async function sendReadySms(input: {
  to: string;
  name: string;
  number: string;
}) {
  const sid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const token = process.env.TWILIO_AUTH_TOKEN?.trim();
  const from = process.env.TWILIO_FROM_NUMBER?.trim();
  if (!sid || !token || !from) {
    throw new Error("Twilio is not configured");
  }
  const to = toUsE164(input.to);
  const fromE164 = toUsE164(from) || (from.startsWith("+") ? from : null);
  if (!to || !fromE164) {
    throw new Error("Twilio from/to number must be E.164");
  }

  const body = new URLSearchParams({
    To: to,
    From: fromE164,
    Body: readySmsBody(input.name, input.number),
  });
  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(sid)}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
      cache: "no-store",
    },
  );
  const payload = (await response.json().catch(() => null)) as {
    sid?: string;
    message?: string;
  } | null;
  if (!response.ok || !payload?.sid) {
    throw new Error(payload?.message || "Twilio did not accept the message");
  }
  return payload.sid;
}
