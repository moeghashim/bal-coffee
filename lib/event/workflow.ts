import "server-only";
import { sendReadySms } from "./sms";
import { getEventStore } from "./store";
import { toUsE164 } from "./phone";

export async function markEventOrderMaking(id: string) {
  return getEventStore().markMaking(id);
}

export async function markEventOrderReady(id: string) {
  const store = getEventStore();
  const order = await store.getById(id);
  if (!order) return { httpStatus: 404, error: "Order not found" } as const;

  if (order.status === "ready" || order.smsSent) {
    return { httpStatus: 200, order, sms: "already_sent" } as const;
  }

  if (!order.consent) {
    const updated = await store.markReadyWithoutSms(id, "no_consent");
    return {
      httpStatus: 200,
      order: updated,
      sms: "skipped",
    } as const;
  }

  const phone = toUsE164(order.phone);
  if (!phone) {
    return {
      httpStatus: 422,
      order,
      error: "Customer phone is not a valid US number. No text sent.",
    } as const;
  }

  const claim = await store.claimSms(id);
  if (claim.state === "missing") {
    return { httpStatus: 404, error: "Order not found" } as const;
  }
  if (claim.state === "done") {
    return {
      httpStatus: 200,
      order: claim.order,
      sms: "already_sent",
    } as const;
  }
  if (claim.state === "busy") {
    return {
      httpStatus: 409,
      order: claim.order,
      error: "A text is already being sent for this order.",
    } as const;
  }

  try {
    const sid = await sendReadySms({
      to: phone,
      name: order.name,
      number: order.number,
    });
    const updated = await store.completeSms(id, sid);
    return { httpStatus: 200, order: updated, sms: "sent" } as const;
  } catch (error) {
    const message = error instanceof Error ? error.message : "SMS failed";
    const updated = await store.failSms(id, message);
    return { httpStatus: 502, order: updated, error: message } as const;
  }
}
