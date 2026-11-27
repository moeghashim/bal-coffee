import Image from "next/image";
import { AddToCartButton } from "components/bal/add-to-cart-button";
import { getFeaturedProducts } from "lib/catalog";
import { bagCardPhotos, bagTasteLines } from "lib/homepage-media";
import { getProduct } from "lib/products";

export async function ShopBags() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <section id="shop" className="bal-shop">
      <div className="bal-shop-intro">
        <p className="mono bal-kicker">The bags</p>
        <h2 className="serif bal-shop-title">Same seeds. Three grinds.</h2>
        <p className="bal-shop-lead">
          All three are 100% date seeds. Pick the grind that matches how you
          brew.
        </p>
      </div>
      <div className="bal-shop-grid">
        {featuredProducts.map((product) => {
          const local = getProduct(product.slug);
          const name = local?.name || product.name;
          const photo = bagCardPhotos[product.slug];
          const taste = bagTasteLines[product.slug];
          return (
            <article key={product.slug} className="bal-shop-card">
              <a
                href={`/products/${product.slug}`}
                aria-label={`View ${name}`}
                className="bal-shop-card-media"
              >
                {photo ? (
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    sizes="(max-width: 720px) calc(100vw - 48px), (max-width: 1024px) 45vw, 360px"
                    className="bal-shop-card-image"
                  />
                ) : null}
              </a>
              <div className="bal-shop-card-body">
                <div className="bal-shop-card-top">
                  <h3 className="serif">
                    <a href={`/products/${product.slug}`}>{name}</a>
                  </h3>
                  <p className="serif bal-shop-card-price">
                    {product.price}
                    <span> / 12 oz</span>
                  </p>
                </div>
                {taste ? <p className="bal-shop-card-taste">{taste}</p> : null}
                <AddToCartButton
                  product={{
                    merchandiseId: product.merchandiseId,
                    handle: product.shopifyHandle,
                    title: product.name,
                    amount: String(product.priceAmount ?? 0),
                    currencyCode: product.currencyCode ?? "USD",
                    availableForSale: product.availableForSale,
                  }}
                />
              </div>
            </article>
          );
        })}
      </div>
      <p className="bal-shop-shipping">
        US shipping: $9.99 for one bag, $12.99 for 2 or more. Most orders arrive
        in 2–5 business days.
      </p>
    </section>
  );
}
