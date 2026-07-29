"use client";

import type { ReactNode } from "react";
import { useMemo, useRef, useState } from "react";
import { Check, Copy, Maximize2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CyDemoDataFieldDocs } from "@/components/cy/common/CyDemoDataFieldDocs";
import type { CyDemoDataDocSection } from "@/components/cy/common/cy-demo-data-field-docs.types";
import { CyTitleLayoutSelect } from "@/components/cy/headerLayout/CyTitleLayoutSelect";
import type { CyTitleLayoutId } from "@/components/cy/headerLayout/cy-title-layout.config";
import { copyCyModuleConfigJson } from "@/components/cy/utils";
import cyModulesConfig from "@/components/cy/cy-modules.config.json";
import { cn } from "@/lib/utils";

export type CyDemoDefinition<TKey extends string> = {
  key: TKey;
  title: string;
  sourceFilePath: string;
  usageCode: string;
  docs?: CyDemoDataDocSection[];
  defaultTitleLayout?: CyTitleLayoutId;
  render: (options: { refreshVersion?: number; titleLayout?: CyTitleLayoutId }) => ReactNode;
};

type Props<TKey extends string> = {
  definitions: readonly CyDemoDefinition<TKey>[];
  typesPathLabel: string;
  layoutPathLabel?: string;
};

/** Reusable CY Studio: preview grid, refresh, fullscreen, copy-config and field documentation. */
export function CyModuleDemo<TKey extends string>({ definitions, typesPathLabel, layoutPathLabel }: Props<TKey>) {
  const [active, setActive] = useState<TKey | null>(null);
  const [copied, setCopied] = useState<TKey | null>(null);
  const [versions, setVersions] = useState<Record<string, number>>({});
  const [layouts, setLayouts] = useState<Record<string, CyTitleLayoutId>>(() => definitions.reduce<Record<string, CyTitleLayoutId>>((result, item) => { if (item.defaultTitleLayout) result[item.key] = item.defaultTitleLayout; return result; }, {}));
  const resetRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeDefinition = useMemo(() => definitions.find((item) => item.key === active) ?? null, [active, definitions]);
  const layoutFor = (key: TKey) => layouts[key] ?? definitions.find((item) => item.key === key)?.defaultTitleLayout;
  const copy = async (item: CyDemoDefinition<TKey>) => {
    const ok = await copyCyModuleConfigJson(item.key, cyModulesConfig, { sourceFilePath: item.sourceFilePath, mergeRoot: layoutFor(item.key) ? { titleLayout: layoutFor(item.key) } : undefined });
    if (resetRef.current) clearTimeout(resetRef.current);
    setCopied(ok ? item.key : null);
    if (ok) resetRef.current = setTimeout(() => setCopied(null), 2000);
  };
  const preview = (item: CyDemoDefinition<TKey>, fullscreen = false) => item.render({ refreshVersion: fullscreen ? undefined : versions[item.key], titleLayout: layoutFor(item.key) });
  return <section className="space-y-4"><div className="grid grid-cols-1 gap-4 md:grid-cols-2">{definitions.map((item) => <article key={item.key} className="flex min-h-[620px] flex-col rounded-xl border bg-card"><div className="flex flex-col gap-3 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between"><h3 className="text-base font-semibold">{item.title}</h3><div className="flex flex-wrap items-center justify-end gap-2"><Button variant="outline" size="icon" className="cursor-pointer" aria-label={`Refresh ${item.title}`} onClick={() => setVersions((value) => ({ ...value, [item.key]: (value[item.key] ?? 0) + 1 }))}><RefreshCw className="h-4 w-4" /></Button><Button variant="outline" size="icon" className="cursor-pointer" aria-label={`Fullscreen ${item.title}`} onClick={() => setActive(item.key)}><Maximize2 className="h-4 w-4" /></Button><Button variant="outline" size="icon" className={cn("cursor-pointer", copied === item.key && "bg-primary/10 text-primary ring-2 ring-primary/40")} aria-label={`Copy ${item.title} configuration`} onClick={() => void copy(item)}>{copied === item.key ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</Button>{item.defaultTitleLayout ? <CyTitleLayoutSelect id={`cy-title-${item.key}`} value={layoutFor(item.key)!} onValueChange={(value) => setLayouts((items) => ({ ...items, [item.key]: value }))} ariaLabel={`${item.title} title layout`} triggerClassName="md:w-[140px]" /> : null}</div></div><CyDemoDataFieldDocs sections={item.docs ?? []} typesPathLabel={typesPathLabel} layoutPathLabel={layoutPathLabel} /><div className="min-h-0 flex-1">{preview(item)}</div><div className="border-t bg-muted/30 p-3"><p className="mb-2 text-xs font-medium text-muted-foreground">Usage</p><pre className="overflow-auto rounded-md bg-background p-3 text-xs"><code>{item.usageCode}</code></pre></div></article>)}</div><Dialog open={Boolean(activeDefinition)} onOpenChange={(open) => !open && setActive(null)}><DialogContent className="!top-0 !left-0 !h-screen !w-screen !max-w-none !translate-x-0 !translate-y-0 overflow-y-auto rounded-none border-0 p-0">{activeDefinition ? <div className="flex min-h-full flex-col"><DialogHeader className="border-b px-5 py-4"><DialogTitle>{activeDefinition.title}</DialogTitle></DialogHeader><CyDemoDataFieldDocs sections={activeDefinition.docs ?? []} typesPathLabel={typesPathLabel} layoutPathLabel={layoutPathLabel} className="px-5" /><div className="flex-1">{preview(activeDefinition, true)}</div></div> : null}</DialogContent></Dialog></section>;
}
