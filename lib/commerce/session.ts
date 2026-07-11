import "server-only";

/**
 * Cookie-backed session store for the Hydrogen route handlers. The new toolkit
 * (8a708a8+) removed Hydrogen's built-in session handling and requires an
 * app-owned `ShopifyRouteSessionManager` — this is ours. The cart handlers use
 * it to persist cart state (e.g. the cart id) across requests.
 *
 * One instance per request: it snapshots the incoming session cookie, exposes
 * get/set/remove over an in-memory map, and `commit()` serializes changes back
 * to a `Set-Cookie` header that the proxy/handler applies to the response.
 */
const COOKIE_NAME = "bal_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function parseCookie(header: string | null, name: string): string | undefined {
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return rest.join("=");
  }
  return undefined;
}

function decode(value: string | undefined): Record<string, unknown> {
  if (!value) return {};
  try {
    return JSON.parse(
      Buffer.from(decodeURIComponent(value), "base64").toString("utf8"),
    );
  } catch {
    return {};
  }
}

function encode(data: Record<string, unknown>): string {
  return encodeURIComponent(
    Buffer.from(JSON.stringify(data), "utf8").toString("base64"),
  );
}

export function createSessionManager(request: Request) {
  const origin = new URL(request.url).origin;
  const data = decode(parseCookie(request.headers.get("cookie"), COOKIE_NAME));
  let dirty = false;

  return {
    getSessionOrigin() {
      return origin;
    },
    getSessionItem(key: string) {
      return data[key];
    },
    setSessionItem(key: string, value: unknown) {
      data[key] = value;
      dirty = true;
    },
    removeSessionItem(key: string) {
      delete data[key];
      dirty = true;
    },
    commit(): HeadersInit | void {
      if (!dirty) return;
      const secure = origin.startsWith("https://") ? "; Secure" : "";
      return {
        "Set-Cookie":
          `${COOKIE_NAME}=${encode(data)}; Path=/; Max-Age=${MAX_AGE}; ` +
          `HttpOnly; SameSite=Lax${secure}`,
      };
    },
  };
}
