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

export function FaqCase2({ data }: CollapsibleFaqProps) {
  const items = data.items ?? [];
  const openIndex = Math.min(
    Math.max(0, data.defaultOpenItemIndex ?? 0),
    Math.max(0, items.length - 1)
  );
  const defaultValue = items.length > 0 ? `item-${openIndex}` : undefined;

  return (
    <section className="bg-muted/30 px-4 py-24"  data-reveal>
      <div className="mx-auto w-full max-w-7xl"  data-reveal>
       wadawdadwwawdawdd
      </div>
    </section>
  );
}
