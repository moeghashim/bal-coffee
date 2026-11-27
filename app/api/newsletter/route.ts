import { NextResponse, type NextRequest } from "next/server";
import {
  NEWSLETTER_ERROR_MESSAGE,
  handleNewsletterRequest,
} from "lib/newsletter";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let input: { email?: unknown; website?: unknown } = {};
  const contentType = request.headers.get("content-type") ?? "";

  try {
    if (contentType.includes("application/json")) {
      const body: unknown = await request.json();
      if (body && typeof body === "object") {
        input = body as { email?: unknown; website?: unknown };
      }
    } else {
      const form = await request.formData();
      input = {
        email: form.get("email"),
        website: form.get("website"),
      };
    }
  } catch {
    return NextResponse.json(
      { ok: false, message: NEWSLETTER_ERROR_MESSAGE },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const result = await handleNewsletterRequest(input, {
    ip: clientIp(request),
  });
  return NextResponse.json(
    { ok: result.ok, message: result.message },
    { status: result.status, headers: { "Cache-Control": "no-store" } },
  );
}

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}
