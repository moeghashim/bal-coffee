import { Footer } from "components/bal/footer";
import { Grain } from "components/bal/grain";
import { Nav } from "components/bal/nav";
import { getCurrentCart } from "components/bal/cart-actions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your Bal Coffee cart.",
};

function formatMoney(amount: string, currencyCode: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(Number(amount));
}

export default async function CartPage() {
  const cart = await getCurrentCart();

  return (
    <>
      <Nav />
      <main>
        <section
          style={{
            minHeight: "62vh",
            padding: "72px 56px 96px",
            background: "var(--cream)",
          }}
        >
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <a
              href="/#all-products"
              className="mono"
              style={{
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--ink-soft)",
              }}
            >
              Continue shopping
            </a>

            <h1
              className="serif"
              style={{
                marginTop: 22,
                fontSize: "clamp(42px, 5vw, 68px)",
                lineHeight: 1,
                fontWeight: 500,
                color: "var(--ink)",
              }}
            >
              Your cart
            </h1>

            {!cart || cart.lines.length === 0 ? (
              <div
                style={{
                  marginTop: 36,
                  padding: "34px 0",
                  borderTop: "1px solid var(--line-soft)",
                  color: "var(--ink-2)",
                  fontSize: 16,
                  lineHeight: 1.6,
                }}
              >
                Your cart is empty.
              </div>
            ) : (
              <div style={{ marginTop: 36 }}>
                <div
                  style={{
                    display: "grid",
                    gap: 18,
                    borderTop: "1px solid var(--line-soft)",
                    borderBottom: "1px solid var(--line-soft)",
                    padding: "22px 0",
                  }}
                >
                  {cart.lines.map((line) => (
                    <div
                      key={line.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr auto auto",
                        gap: 24,
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <h2
                          className="serif"
                          style={{
                            fontSize: 24,
                            fontWeight: 500,
                            color: "var(--ink)",
                          }}
                        >
                          {line.merchandise.product.title}
                        </h2>
                        <p
                          className="mono"
                          style={{
                            marginTop: 6,
                            fontSize: 10,
                            letterSpacing: "0.16em",
                            textTransform: "uppercase",
                            color: "var(--ink-soft)",
                          }}
                        >
                          {line.merchandise.title}
                        </p>
                      </div>
                      <p style={{ color: "var(--ink-2)", fontSize: 15 }}>
                        Qty {line.quantity}
                      </p>
                      <p
                        className="serif"
                        style={{
                          color: "var(--ink)",
                          fontSize: 20,
                          textAlign: "right",
                        }}
                      >
                        {formatMoney(
                          line.cost.totalAmount.amount,
                          line.cost.totalAmount.currencyCode,
                        )}
                      </p>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    marginTop: 28,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 24,
                  }}
                >
                  <div>
                    <p
                      className="mono"
                      style={{
                        fontSize: 10,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "var(--ink-soft)",
                      }}
                    >
                      Total
                    </p>
                    <p
                      className="serif"
                      style={{
                        marginTop: 6,
                        fontSize: 28,
                        color: "var(--ink)",
                      }}
                    >
                      {formatMoney(
                        cart.cost.totalAmount.amount,
                        cart.cost.totalAmount.currencyCode,
                      )}
                    </p>
                  </div>
                  <a
                    href={cart.checkoutUrl}
                    className="mono"
                    style={{
                      display: "inline-flex",
                      padding: "15px 28px",
                      background: "var(--ink)",
                      color: "var(--cream)",
                      fontSize: 11,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      borderRadius: 2,
                    }}
                  >
                    Checkout
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <Grain />
    </>
  );
}
