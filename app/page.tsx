import { Comparison } from "components/bal/comparison";
import { Footer } from "components/bal/footer";
import { Founder } from "components/bal/founder";
import { Grain } from "components/bal/grain";
import { Hero } from "components/bal/hero";
import { Manifesto } from "components/bal/manifesto";
import { Nav } from "components/bal/nav";
import { Product } from "components/bal/product";
import { Ritual } from "components/bal/ritual";
import { RoastSlider } from "components/bal/roast-slider";
import { Story } from "components/bal/story";

export const metadata = {
  description:
    "A naturally caffeine-free coffee, made from a single native seed. Hand-roasted in small lots.",
};

export default function HomePage() {
  return (
    <>
      <Nav />
      <Hero />
      <Manifesto />
      <Story />
      <Comparison />
      <RoastSlider />
      <Ritual />
      <Founder />
      <Product />
      <Footer />
      <Grain />
    </>
  );
}
