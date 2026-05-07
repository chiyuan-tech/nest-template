"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FaqCase1Data } from "@/components/cy/FAQ/types";
export interface CollapsibleFaqProps {
  data: FaqCase1Data;
}

export function FaqCase1({ data }: CollapsibleFaqProps) {
  const items = data.items ?? [];
  const openIndex = Math.min(
    Math.max(0, data.defaultOpenItemIndex ?? 0),
    Math.max(0, items.length - 1)
  );
  const defaultValue = items.length > 0 ? `item-${openIndex}` : undefined;

  return (
    <section className="bg-muted/30 px-4 py-24"  data-reveal>
      <div className="mx-auto w-full max-w-7xl"  data-reveal>
        <div className="mb-12 text-center"  data-reveal>
          <h2 className="mb-4 text-4xl font-bold text-foreground md:text-5xl"  data-reveal>
            {data.sectionTitle}
          </h2>
        </div>

        <Accordion
          type="single"
          collapsible
          defaultValue={defaultValue}
          className="space-y-4"
        >
          {items.map((faq, index) => (
            <AccordionItem
              data-reveal
              key={`${faq.question}-${index}`}
              value={`item-${index}`}
              className="rounded-lg border border-border bg-card px-6 data-[state=open]:border-primary/30"
            >
              <AccordionTrigger  className="cursor-pointer py-4 text-left font-semibold text-foreground hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-4 leading-relaxed text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
