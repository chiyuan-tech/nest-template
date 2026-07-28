import Hero from '@/components/home/Hero';
import PricingSection from '@/components/PricingSection';

export default function Page() {
  return (
    <>
      <section id="home">
        <Hero />
      </section>
      <section id="how-to-use" className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="font-serif text-3xl font-semibold text-foreground md:text-5xl">How to Use</h2>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
          This homepage section is the clone-first content slot for the product workflow. The generated project replaces this temporary copy with the Claude Sonnet copy map after competitor research and media mapping are complete.
        </p>
      </section>
      <section id="pricing" className="bg-background px-4 py-24">
        <div className="mx-auto max-w-7xl">
          <PricingSection hideSection hideHeader />
        </div>
      </section>
      <section id="faq" className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="font-serif text-3xl font-semibold text-foreground md:text-5xl">Frequently Asked Questions</h2>
      </section>
    </>
  );
}
