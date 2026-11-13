import "server-only";
import {
  mergePaidOrder,
  type EventOrder,
  type EventOrderDraft,
} from "./orders";
import {
  MemoryEventStore,
  type EventStore,
  type SmsClaim,
} from "./store-memory";

const ORDER_PREFIX = "bal:event:v1:order:";
const REF_PREFIX = "bal:event:v1:ref:";
const SMS_PREFIX = "bal:event:v1:sms:";
const INDEX_KEY = "bal:event:v1:ids";

const memoryGlobal = globalThis as unknown as {
  __balEventStore?: MemoryEventStore;
};

export function eventStoreIsDurable() {
  return Boolean(redisConfig());
}

export function getEventStore(): EventStore {
  const config = redisConfig();
  if (config) return new UpstashEventStore(config.url, config.token);
  memoryGlobal.__balEventStore ??= new MemoryEventStore();
  return memoryGlobal.__balEventStore;
}

function redisConfig() {
  const url = (
    process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  )?.replace(/\/$/, "");
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return { url, token };
}

class UpstashEventStore implements EventStore {
  readonly mode = "redis" as const;

  constructor(
    private url: string,
    private token: string,
  ) {}

  async savePaid(draft: EventOrderDraft) {
    const existing = await this.readOrder(draft.id);
    const next = mergePaidOrder(existing, draft, new Date().toISOString());
    const score = Date.parse(next.createdAt);
    await this.command(["SET", orderKey(next.id), JSON.stringify(next)]);
    await this.command([
      "ZADD",
      INDEX_KEY,
      Number.isFinite(score) ? score : Date.now(),
      next.id,
    ]);
    if (next.ref) {
      await this.command(["SET", refKey(next.ref), next.id]);
    }
    return next;
  }

  async list() {
    const ids = await this.command(["ZRANGE", INDEX_KEY, -300, -1]);
    if (!Array.isArray(ids) || ids.length === 0) return [];
    const keys = ids.filter((id): id is string => typeof id === "string");
    if (keys.length === 0) return [];
    const values = await this.command(["MGET", ...keys.map(orderKey)]);
    if (!Array.isArray(values)) return [];
    return values
      .map((value) => asOrder(value))
      .filter((order): order is EventOrder => Boolean(order))
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  async getById(id: string) {
    return this.readOrder(id);
  }

  async getByRef(ref: string) {
    const id = await this.command(["GET", refKey(ref)]);
    if (typeof id !== "string" || !id) return null;
    return this.readOrder(id);
  }

  async markMaking(id: string) {
    const order = await this.readOrder(id);
    if (!order || order.status === "ready") return order;
    const next: EventOrder = {
      ...order,
      status: "making",
      updatedAt: new Date().toISOString(),
    };
    await this.command(["SET", orderKey(id), JSON.stringify(next)]);
    return next;
  }

  async claimSms(id: string): Promise<SmsClaim> {
    const order = await this.readOrder(id);
    if (!order) return { state: "missing" };
    if (order.smsSent || order.status === "ready") {
      return { state: "done", order };
    }
    const claimed = await this.command([
      "SET",
      smsKey(id),
      "inflight",
      "NX",
      "EX",
      120,
    ]);
    if (claimed === "OK") return { state: "send", order };
    const existing = await this.command(["GET", smsKey(id)]);
    if (existing === "sent") return { state: "done", order };
    return { state: "busy", order };
  }

  async completeSms(id: string, sid: string) {
    const order = await this.readOrder(id);
    if (!order) return null;
    const next: EventOrder = {
      ...order,
      status: "ready",
      smsSent: true,
      smsSid: sid,
      smsError: undefined,
      updatedAt: new Date().toISOString(),
    };
    await this.command(["SET", orderKey(id), JSON.stringify(next)]);
    await this.command(["SET", smsKey(id), "sent"]);
    return next;
  }

  async failSms(id: string, error: string) {
    const order = await this.readOrder(id);
    if (!order) return null;
    const claim = await this.command(["GET", smsKey(id)]);
    if (claim === "inflight") await this.command(["DEL", smsKey(id)]);
    const next: EventOrder = {
      ...order,
      smsError: error,
      updatedAt: new Date().toISOString(),
    };
    await this.command(["SET", orderKey(id), JSON.stringify(next)]);
    return next;
  }

  async markReadyWithoutSms(id: string, reason: string) {
    const order = await this.readOrder(id);
    if (!order) return null;
    if (order.status === "ready" || order.smsSent) return order;
    const next: EventOrder = {
      ...order,
      status: "ready",
      smsSent: false,
      smsError: reason,
      updatedAt: new Date().toISOString(),
    };
    await this.command(["SET", orderKey(id), JSON.stringify(next)]);
    await this.command(["SET", smsKey(id), "sent"]);
    return next;
  }

  private async readOrder(id: string) {
    return asOrder(await this.command(["GET", orderKey(id)]));
  }

  private async command(args: (string | number)[]) {
    const response = await fetch(this.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`Event store request failed (${response.status})`);
    }
    const body = (await response.json()) as {
      result?: unknown;
      error?: string;
    };
    if (body.error) throw new Error("Event store rejected the command");
    return body.result;
  }
}

function orderKey(id: string) {
  return `${ORDER_PREFIX}${id}`;
}

function refKey(ref: string) {
  return `${REF_PREFIX}${ref}`;
}

function smsKey(id: string) {
  return `${SMS_PREFIX}${id}`;
}

function asOrder(value: unknown): EventOrder | null {
  if (!value) return null;
  if (typeof value === "string") {
    try {
      return asOrder(JSON.parse(value));
    } catch {
      return null;
    }
  }
  if (typeof value !== "object") return null;
  const order = value as Partial<EventOrder>;
  if (!order.id || !order.number || !order.status) return null;
  return order as EventOrder;
}
