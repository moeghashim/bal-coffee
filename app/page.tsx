import { Bestsellers } from "components/bal/bestsellers";
import { EndOfDay } from "components/bal/end-of-day";
import { Features } from "components/bal/features";
import { Footer } from "components/bal/footer";
import { Founder } from "components/bal/founder";
import { Grain } from "components/bal/grain";
import { Hero } from "components/bal/hero";
import { Nav } from "components/bal/nav";
import { Process } from "components/bal/process";
import { SubscriptionCTA } from "components/bal/subscription-cta";

export const metadata = {
  description:
    "A naturally caffeine-free coffee, made from date seeds. Roasted in small batches.",
};

export default function HomePage() {
  return (
    <>
      <Nav />
      <Hero />
      <Features />
      <Bestsellers />
      <Process />
      <EndOfDay />
      <Founder />
      <SubscriptionCTA />
      <Footer />
      <Grain />
    </>
  );
}
