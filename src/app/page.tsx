import { Background } from "@/components/Background";
import { Contact } from "@/components/Contact";
import { Container } from "@/components/Container";
import { Elsewhere } from "@/components/Elsewhere";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { SelectedWork } from "@/components/SelectedWork";
import { Toolkit } from "@/components/Toolkit";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Container>
          <SelectedWork />
          <Background />
          <Toolkit />
          <Elsewhere />
          <Contact />
        </Container>
      </main>
      <Footer />
    </>
  );
}
