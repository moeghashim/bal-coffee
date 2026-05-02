import { CartProvider } from "components/cart/cart-context";
import { getCart } from "lib/shopify";
import { baseUrl } from "lib/utils";
import { ReactNode } from "react";
import "./globals.css";

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
  const cart = getCart();

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
      </head>
      <body>
        <CartProvider cartPromise={cart}>{children}</CartProvider>
      </body>
    </html>
  );
}
