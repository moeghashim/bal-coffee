import { NextResponse, type NextRequest } from "next/server";
import { handleCommerceRoutes } from "lib/commerce/routes";

/**
 * Next.js 16 request proxy. Runs before routing so Hydrogen can own its own
 * routes (`/api/cart`, SFAPI proxy, cart permalinks, `/checkout`) before the
 * Next router sees them. All Hydrogen usage stays behind the commerce boundary
 * in `lib/commerce` (see HYDROGEN_MIGRATION.md); this file only speaks Next.
 */
export async function proxy(request: NextRequest) {
  const { shopifyResponse, forwardedRequestHeaders, applyResponseHeaders } =
    await handleCommerceRoutes(request);

  if (shopifyResponse) {
    return shopifyResponse;
  }

  const response = NextResponse.next({
    request: { headers: forwardedRequestHeaders },
  });
  applyResponseHeaders(response.headers);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|_next/data|favicon.ico).*)"],
};
