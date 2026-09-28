import { BenefitsStrip } from "components/bal/benefits-strip";
import { CartContents } from "components/bal/cart-view";
import { Footer } from "components/bal/footer";
import { Grain } from "components/bal/grain";
import { Nav } from "components/bal/nav";
import { getProducts } from "lib/catalog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your Bal Coffee cart.",
};

export default async function CartPage() {
  const products = await getProducts();

  return (
    <>
      <Nav />
      <main>
        <section
          className="bal-cart-page"
          style={{ position: "relative", padding: "24px 80px 96px" }}
        >
          <div
            className="bal-cart-container"
            style={{ position: "relative", maxWidth: 1180, margin: "0 auto" }}
          >
            <nav
              aria-label="Breadcrumb"
              className="mono"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 13,
                color: "var(--ink-soft)",
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              <a href="/">Home</a>
              <span style={{ color: "var(--ink-soft)" }}>/</span>
              <span>Cart</span>
            </nav>

            <div
              className="bal-cart-heading"
              style={{ marginTop: 28, maxWidth: 640, paddingBottom: 36 }}
            >
              <h1
                className="label-title"
                style={{ fontSize: "clamp(56px, 7vw, 96px)", lineHeight: 0.92 }}
              >
                Your Cart
              </h1>
              <p
                style={{
                  marginTop: 20,
                  fontSize: 16,
                  lineHeight: 1.55,
                  color: "var(--ink-2)",
                }}
              >
                Review your selection and complete your order.
              </p>
            </div>

            <CartContents products={products} />

            <BenefitsStrip />
          </div>
        </section>
      </main>
      <Footer />
      <Grain />
    </>
  );
}
