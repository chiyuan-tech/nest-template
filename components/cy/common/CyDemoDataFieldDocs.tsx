"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { CyDemoDataDocSection } from "@/components/cy/common/cy-demo-data-field-docs.types";
import { cn } from "@/lib/utils";

export interface CyDemoDataFieldDocsProps {
  sections: CyDemoDataDocSection[];
  className?: string;
  /** 页脚「类型定义见 …」中的路径文案，如 `components/cy/FAQ/types.ts` */
  typesPathLabel?: string;
  /** 页脚「布局 id 见 …」；不传则只显示类型路径一句 */
  layoutPathLabel?: string;
}

/**
 * CY 画廊 Demo 共用的「配置说明 / data 字段含义」折叠面板。
 * 字段数据放在与 `*Demo.tsx` 同级的 `*Demo.data.ts`。
 */
export function CyDemoDataFieldDocs({
  sections,
  className,
  typesPathLabel,
  layoutPathLabel,
}: CyDemoDataFieldDocsProps) {
  if (sections.length === 0) {
    return null;
  }

  return (
    <Accordion type="single" collapsible className={cn("border-b px-4", className)}>
      <AccordionItem value="data-fields" className="border-0">
        <AccordionTrigger className="cursor-pointer py-3 text-sm hover:no-underline">
          <span className="text-muted-foreground">配置说明</span>
          <span className="ml-1 font-medium text-foreground">data 字段含义</span>
        </AccordionTrigger>
        <AccordionContent className="pb-4">
          <div className="space-y-4 text-xs leading-relaxed">
            {sections.map((section) => (
              <div key={section.title}>
                <p className="mb-2 font-medium text-foreground">{section.title}</p>
                <dl className="space-y-2">
                  {section.rows.map((row) => (
                    <div
                      key={row.field}
                      className="grid gap-1 sm:grid-cols-[minmax(0,9rem)_1fr] sm:gap-3"
                    >
                      <dt>
                        <code className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-foreground">
                          {row.field}
                        </code>
                      </dt>
                      <dd className="text-muted-foreground">{row.desc}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
            {typesPathLabel ? (
              <p className="text-[11px] text-muted-foreground">
                类型定义见 <code className="rounded bg-muted px-1">{typesPathLabel}</code>
                {layoutPathLabel ? (
                  <>
                    ；布局 id 见 <code className="rounded bg-muted px-1">{layoutPathLabel}</code>。
                  </>
                ) : (
                  "。"
                )}
              </p>
            ) : null}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
