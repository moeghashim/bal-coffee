import { Bestsellers } from "components/bal/bestsellers";
import { EndOfDay } from "components/bal/end-of-day";
import { Features } from "components/bal/features";
import { Footer } from "components/bal/footer";
import { Founder } from "components/bal/founder";
import { Grain } from "components/bal/grain";
import { Hero } from "components/bal/hero";
import { Nav } from "components/bal/nav";
import { Process } from "components/bal/process";
import { SampleSection } from "components/bal/sample-section";
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
      <Process />
      <EndOfDay />
      <Founder />
      <SampleSection />
      <Footer />
      <Grain />
    </>
  );
}
