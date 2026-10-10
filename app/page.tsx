import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Infrastructure } from "./components/Infrastructure";
import { IntegrationBanner } from "./components/IntegrationBanner";
import { Navbar } from "./components/Navbar";
import { Services } from "./components/Services";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans shadow-none">
      <Navbar />
      <Hero />
      <Services />
      <IntegrationBanner />
      <Infrastructure />
      <Footer />
    </div>
  );
}
