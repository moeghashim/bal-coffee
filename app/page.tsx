import { Footer } from "components/bal/footer";
import { Founder } from "components/bal/founder";
import { Grain } from "components/bal/grain";
import { Hero } from "components/bal/hero";
import { FactsTicker } from "components/bal/facts-ticker";
import { Nav } from "components/bal/nav";
import { Process } from "components/bal/process";
import { SampleSection } from "components/bal/sample-section";
import { ShopBags } from "components/bal/shop-bags";
import { TrustStrip } from "components/bal/trust-strip";
import { pageMetadata, pageSeo } from "lib/seo";

export const metadata = pageMetadata({
  title: pageSeo.home.title,
  description: pageSeo.home.description,
  path: "/",
});

export default async function HomePage() {
  return (
    <>
      <Nav />
      <Hero />
      <FactsTicker />
      <ShopBags />
      <TrustStrip />
      <SampleSection />
      <Process />
      <Founder />
      <Footer />
      <Grain />
    </>
  );
}
