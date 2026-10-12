import About from "@/components/About";
import ContactCta from "@/components/ContactCta";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HumanAndAi from "@/components/HumanAndAi";
import Industries from "@/components/Industries";
import KeyFigures from "@/components/KeyFigures";
import Marquee from "@/components/Marquee";
import Process from "@/components/Process";
import Services from "@/components/Services";

export default function Home() {
  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <Marquee />
        <KeyFigures />
        <Services />
        <Process />
        <Industries />
        <HumanAndAi />
        <About />
        <ContactCta />
      </main>
      <Footer />
    </>
  );
}
