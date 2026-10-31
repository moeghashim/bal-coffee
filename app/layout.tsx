import { ReactNode, Suspense } from "react";
import { Fraunces, Inter_Tight } from "next/font/google";
import "./globals.css";
import { JsonLd } from "components/bal/json-ld";
import { organizationJsonLd, pageSeo, websiteJsonLd } from "lib/seo";
import { baseUrl } from "lib/utils";
import { CartProvider } from "lib/commerce/cart-client";
import { getShopAnalytics } from "lib/commerce/analytics-shop";
import { AnalyticsTracker } from "components/bal/analytics-tracker";
import { CartAnalyticsBridge } from "components/bal/cart-analytics-bridge";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-fraunces-loaded",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-inter-loaded",
  weight: ["400", "500", "600"],
});

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: pageSeo.home.title,
    template: "%s | BAL Coffee",
  },
  description: pageSeo.home.description,
  openGraph: {
    type: "website" as const,
    siteName: "BAL Coffee",
    locale: "en_US",
    title: pageSeo.home.title,
    description: pageSeo.home.description,
  },
  twitter: {
    card: "summary_large_image" as const,
    title: pageSeo.home.title,
    description: pageSeo.home.description,
  },
  robots: { follow: true, index: true },
  alternates: { canonical: "./" },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const shopAnalytics = await getShopAnalytics();

  return (
    <html lang="en" className={`${fraunces.variable} ${interTight.variable}`}>
      <body>
        <JsonLd data={organizationJsonLd(baseUrl)} />
        <JsonLd data={websiteJsonLd(baseUrl)} />
        {shopAnalytics ? (
          <Suspense fallback={null}>
            <AnalyticsTracker shop={shopAnalytics} />
          </Suspense>
        ) : null}
        <CartProvider>
          <CartAnalyticsBridge />
          {children}
        </CartProvider>
        {/* Shopify Standard Actions runtime — performs the cart mutations the
            Hydrogen cart store dispatches (add/update/remove). A module script
            at the end of body so it does not sit in front of the hero image. */}
        <script
          type="module"
          src="https://cdn.shopify.com/storefront/standard-actions.js"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
