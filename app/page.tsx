import { Bestsellers } from "components/bal/bestsellers";
import { Drinks } from "components/bal/drinks";
import { EndOfDay } from "components/bal/end-of-day";
import { Features } from "components/bal/features";
import { Footer } from "components/bal/footer";
import { Founder } from "components/bal/founder";
import { Grain } from "components/bal/grain";
import { Hero } from "components/bal/hero";
import { Nav } from "components/bal/nav";
import { Process } from "components/bal/process";
import { SubscriptionCTA } from "components/bal/subscription-cta";
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
      <Features />
      <Bestsellers />
      <Drinks />
      <Process />
      <EndOfDay />
      <Founder />
      <SubscriptionCTA />
      <Footer />
      <Grain />
    </>
  );
}
