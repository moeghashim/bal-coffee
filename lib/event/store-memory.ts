import {
  mergePaidOrder,
  type EventOrder,
  type EventOrderDraft,
} from "./orders";

export type SmsClaim =
  | { state: "send"; order: EventOrder }
  | { state: "done"; order: EventOrder }
  | { state: "busy"; order: EventOrder }
  | { state: "missing" };

export type EventStore = {
  mode: "memory" | "redis";
  savePaid(draft: EventOrderDraft): Promise<EventOrder>;
  list(): Promise<EventOrder[]>;
  getById(id: string): Promise<EventOrder | null>;
  getByRef(ref: string): Promise<EventOrder | null>;
  markMaking(id: string): Promise<EventOrder | null>;
  claimSms(id: string): Promise<SmsClaim>;
  completeSms(id: string, sid: string): Promise<EventOrder | null>;
  failSms(id: string, error: string): Promise<EventOrder | null>;
  markReadyWithoutSms(id: string, reason: string): Promise<EventOrder | null>;
};

type SmsClaimState = "inflight" | "sent";

/**
 * Single-process store used by unit tests and local dev when Upstash is not
 * configured. On Vercel each lambda has its own memory, so this is not durable.
 */
export class MemoryEventStore implements EventStore {
  readonly mode = "memory" as const;
  private orders = new Map<string, EventOrder>();
  private claims = new Map<string, SmsClaimState>();

  async savePaid(draft: EventOrderDraft) {
    const next = mergePaidOrder(
      this.orders.get(draft.id) ?? null,
      draft,
      new Date().toISOString(),
    );
    this.orders.set(draft.id, next);
    return next;
  }

  async list() {
    return [...this.orders.values()].sort((a, b) =>
      a.createdAt.localeCompare(b.createdAt),
    );
  }

  async getById(id: string) {
    return this.orders.get(id) ?? null;
  }

  async getByRef(ref: string) {
    for (const order of this.orders.values()) {
      if (order.ref === ref) return order;
    }
    return null;
  }

  async markMaking(id: string) {
    const order = this.orders.get(id);
    if (!order || order.status === "ready") return order ?? null;
    const next: EventOrder = {
      ...order,
      status: "making",
      updatedAt: new Date().toISOString(),
    };
    this.orders.set(id, next);
    return next;
  }

  async claimSms(id: string): Promise<SmsClaim> {
    const order = this.orders.get(id);
    if (!order) return { state: "missing" };
    if (
      order.smsSent ||
      order.status === "ready" ||
      this.claims.get(id) === "sent"
    ) {
      return { state: "done", order };
    }
    if (this.claims.get(id) === "inflight") return { state: "busy", order };
    this.claims.set(id, "inflight");
    return { state: "send", order };
  }

  async completeSms(id: string, sid: string) {
    const order = this.orders.get(id);
    if (!order) return null;
    const next: EventOrder = {
      ...order,
      status: "ready",
      smsSent: true,
      smsSid: sid,
      smsError: undefined,
      updatedAt: new Date().toISOString(),
    };
    this.orders.set(id, next);
    this.claims.set(id, "sent");
    return next;
  }

  async failSms(id: string, error: string) {
    const order = this.orders.get(id);
    if (!order) return null;
    if (this.claims.get(id) === "inflight") this.claims.delete(id);
    const next: EventOrder = {
      ...order,
      smsError: error,
      updatedAt: new Date().toISOString(),
    };
    this.orders.set(id, next);
    return next;
  }

  async markReadyWithoutSms(id: string, reason: string) {
    const order = this.orders.get(id);
    if (!order) return null;
    if (order.status === "ready" || order.smsSent) return order;
    const next: EventOrder = {
      ...order,
      status: "ready",
      smsSent: false,
      smsError: reason,
      updatedAt: new Date().toISOString(),
    };
    this.orders.set(id, next);
    return next;
  }
}
