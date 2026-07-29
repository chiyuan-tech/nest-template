"use client";

import { ScrollRevealInit } from "@/components/animations/ScrollRevealInit";
import { CyTestimonialTitleCase1 } from "@/components/cy/headerLayout/cy-testimonial-title";
import type { CyTitleLayoutId } from "@/components/cy/headerLayout/cy-title-layout.config";
import type { ComparisonTableCase1Data } from "@/components/cy/Comparison/types";

export interface ComparisonTableCase1Props {
  data: ComparisonTableCase1Data;
}

export function ComparisonTableCase1({ data }: ComparisonTableCase1Props) {
  const titleLayout: CyTitleLayoutId = data.titleLayout ?? "headerVertical";
  const headers = data.columnHeaders ?? [];
  const bodyRows = data.rows ?? [];

  return (
    <section id="comparison" data-reveal className="mx-auto max-w-7xl px-4 py-20 md:px-4 md:py-28">
      <ScrollRevealInit />
      <CyTestimonialTitleCase1
        layoutId={titleLayout}
        data={{
          decorIndex: data.decorIndex,
          kicker: data.kicker,
          sectionTitle: data.sectionTitle,
          subtitle: data.subtitle,
        }}
      />
      <div
        data-reveal
        className="mt-8 w-full rounded-lg border border-border overflow-x-auto overflow-y-visible [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        <table className="w-full min-w-[980px] border-collapse text-left text-sm">
          <thead className="bg-secondary/80">
            <tr className="text-foreground">
              {headers.map((h) => (
                <th key={h} className="px-4 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            {bodyRows.map((row, index) => (
              <tr
                key={row[0] ?? index}
                data-reveal
                style={{ transitionDelay: `${index * 35}ms` }}
                className="border-t border-border"
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={`${index}-${cellIndex}`}
                    className={
                      cellIndex === 0
                        ? "px-4 py-3 align-top font-semibold text-foreground"
                        : "px-4 py-3 align-top"
                    }
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
