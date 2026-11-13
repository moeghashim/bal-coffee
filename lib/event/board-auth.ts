import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const BOARD_COOKIE = "bal_event_board";

export function boardPasscode() {
  const value = process.env.EVENT_BOARD_PASSCODE?.trim();
  return value || null;
}

export function boardSessionToken(passcode: string) {
  return createHmac("sha256", passcode)
    .update("bal-event-board-v1")
    .digest("base64url");
}

export function passcodeMatches(input: string, expected: string) {
  const left = createHash("sha256").update(input).digest();
  const right = createHash("sha256").update(expected).digest();
  return timingSafeEqual(left, right);
}

export function boardCookieMatches(cookie: string | undefined) {
  const passcode = boardPasscode();
  if (!passcode || !cookie) return false;
  const expected = boardSessionToken(passcode);
  const left = Buffer.from(cookie);
  const right = Buffer.from(expected);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function boardCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 14,
  };
}
