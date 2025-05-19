// import { Navbar } from '../components/Navbar'; // Navbar is now in root layout

import PricingSection from '../components/PricingSection';

import { Footer } from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
