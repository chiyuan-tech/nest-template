import Hero from '@/components/home/Hero';
import PricingSection from '@/components/PricingSection';
import { HomeStructuredData, homeFaqs, homeHowToSteps } from '@/components/seo/HomeStructuredData';
import { siteConfig } from '@/website-config';

export default function Page() {
  return (
    <>
      <HomeStructuredData />
      <section id="home">
        <Hero />
      </section>
      <section id="how-to-use" className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="font-display text-3xl font-semibold text-foreground md:text-5xl">How to Use {siteConfig.name}</h2>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
          {homeHowToSteps.map((step, index) => `${index + 1}. ${step.name}: ${step.text}`).join(' ')}
        </p>
      </section>
      <section id="pricing" className="bg-background px-4 py-24">
        <div className="mx-auto max-w-7xl">
          <PricingSection hideSection hideHeader />
        </div>
      </section>
      <section id="faq" className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="font-display text-3xl font-semibold text-foreground md:text-5xl">{siteConfig.name} Frequently Asked Questions</h2>
        <div className="mt-8 space-y-5">{homeFaqs.map((faq) => <article key={faq.question}><h3 className="text-lg font-semibold">{faq.question}</h3><p className="mt-2 text-muted-foreground">{faq.answer}</p></article>)}</div>
      </section>
    </>
  );
}
