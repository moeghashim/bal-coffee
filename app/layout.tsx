import { ReactNode, Suspense } from "react";
import "./globals.css";
import { baseUrl } from "lib/utils";
import { CartProvider } from "lib/commerce/cart-client";
import { getShopAnalytics } from "lib/commerce/analytics-shop";
import { AnalyticsTracker } from "components/bal/analytics-tracker";

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Bal — Coffee from the seed",
    template: "%s | Bal Coffee",
  },
  description:
    "A naturally caffeine-free coffee, made from a single native seed. Hand-roasted in small lots.",
  openGraph: { type: "website" },
  robots: { follow: true, index: true },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const shopAnalytics = await getShopAnalytics();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&family=IBM+Plex+Mono:wght@300;400;500&family=Inter+Tight:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        {/* Shopify Standard Actions runtime — performs the cart mutations the
            Hydrogen cart store dispatches (add/update/remove). Must be a module
            script so its internal relative imports resolve from the CDN. */}
        <script
          type="module"
          src="https://cdn.shopify.com/storefront/standard-actions.js"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {shopAnalytics ? (
          <Suspense fallback={null}>
            <AnalyticsTracker shop={shopAnalytics} />
          </Suspense>
        ) : null}
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
