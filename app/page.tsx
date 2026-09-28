import { Bestsellers } from "components/bal/bestsellers";
import { Footer } from "components/bal/footer";
import { Founder } from "components/bal/founder";
import { Grain } from "components/bal/grain";
import { Hero } from "components/bal/hero";
import { Ingredients } from "components/bal/ingredients";
import { Nav } from "components/bal/nav";
import { ProductImagePreload } from "components/bal/product-media";
import { SubscriptionCTA } from "components/bal/subscription-cta";
import { getFeaturedProducts } from "lib/catalog";
import { getProduct } from "lib/products";

export const metadata = {
  description:
    "A naturally caffeine-free coffee, made from date seeds. Roasted in small batches.",
};

export default async function HomePage() {
  const products = await getFeaturedProducts();
  // Eastern Brew's shot shows the kraft bag and its label up close — the hero
  // of the Kraft & Label look. GrounDate's at-home carafe shot sits beside the
  // ingredients panel. Fall back to catalog order if a slug moves, and to the
  // static catalog entry if Shopify returns nothing, so an outage still renders
  // the hero (with the illustrated bag) and the ingredients panel.
  const heroProduct =
    products.find((product) => product.slug === "eastern-brew") ??
    products[0] ??
    getProduct("eastern-brew");
  const bagProduct =
    products.find((product) => product.slug === "groundate") ??
    products[1] ??
    getProduct("groundate");

  return (
    <>
      <ProductImagePreload image={heroProduct?.images?.[0]} />
      <Nav />
      <main>
        <Hero product={heroProduct} />
        <Bestsellers products={products} />
        <Ingredients product={bagProduct} />
        <Founder />
        <SubscriptionCTA />
      </main>
      <Footer />
      <Grain />
    </>
  );
}
