import { NextResponse, type NextRequest } from "next/server";
import {
  BOARD_COOKIE,
  boardCookieOptions,
  boardPasscode,
  boardSessionToken,
  passcodeMatches,
} from "lib/event/board-auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const passcode = boardPasscode();
  if (!passcode) {
    return json(
      { error: "Set EVENT_BOARD_PASSCODE before using the board." },
      503,
    );
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Enter the passcode." }, 400);
  }
  const input =
    body &&
    typeof body === "object" &&
    typeof (body as { passcode?: unknown }).passcode === "string"
      ? (body as { passcode: string }).passcode
      : "";
  if (!input || !passcodeMatches(input, passcode)) {
    return json({ error: "Wrong passcode." }, 401);
  }
  const response = json({ ok: true });
  response.cookies.set(
    BOARD_COOKIE,
    boardSessionToken(passcode),
    boardCookieOptions(),
  );
  return response;
}

export async function DELETE() {
  const response = json({ ok: true });
  response.cookies.set(BOARD_COOKIE, "", {
    ...boardCookieOptions(),
    maxAge: 0,
  });
  return response;
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}
