"use client";

import type { ReactNode } from "react";
import { useMemo, useRef, useState } from "react";
import { Check, Copy, Maximize2, RefreshCw } from "lucide-react";
import { TestimonialGridCase1 } from "@/components/cy/UsersSay/testimonial_grid_case1";
import { TestimonialGridCase2 } from "@/components/cy/UsersSay/testimonial_grid_case2";
import { TestimonialGridCase3 } from "@/components/cy/UsersSay/testimonial_grid_case3";
import { Button } from "@/components/ui/button";
import cyModulesConfig from "@/components/cy/cy-modules.config.json";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type {
  TestimonialGridCase1Data,
  TestimonialGridCase2Data,
  TestimonialGridCase3Data,
} from "@/components/cy/UsersSay/types";
import { CyDemoDataFieldDocs } from "@/components/cy/common/CyDemoDataFieldDocs";
import {
  testimonialGridDemoDataFieldDocSections,
  testimonialGridDemoFieldDocsLayoutPath,
  testimonialGridDemoFieldDocsTypesPath,
  type TestimonialGridDemoPreviewKey,
} from "@/components/cy/UsersSay/TestimonialGridDemo.data";
import { CyTitleLayoutSelect } from "@/components/cy/headerLayout/CyTitleLayoutSelect";
import {
  defaultCyTitleLayoutByModuleKey,
  type CyTitleLayoutId,
} from "@/components/cy/headerLayout/cy-title-layout.config";
import { copyCyModuleConfigJson } from "@/components/cy/utils";
import { cn } from "@/lib/utils";

type PreviewItem =
  | {
      key: "TestimonialGridCase1";
      title: string;
      sourceFilePathForCopy: string;
      usageCode: string;
      props: TestimonialGridCase1Data;
    }
  | {
      key: "TestimonialGridCase2";
      title: string;
      sourceFilePathForCopy: string;
      usageCode: string;
      props: TestimonialGridCase2Data;
    }
  | {
      key: "TestimonialGridCase3";
      title: string;
      sourceFilePathForCopy: string;
      usageCode: string;
      props: TestimonialGridCase3Data;
    };

type PreviewKey = TestimonialGridDemoPreviewKey;

/** 卡片内预览：按 key 映射，新增 Case 时在此补一行 */
const testimonialDemoGridPreviewByKey: Record<
  PreviewKey,
  (input: { item: PreviewItem; layoutId: CyTitleLayoutId; refreshVersion: number }) => ReactNode
> = {
  TestimonialGridCase1: ({ item, layoutId, refreshVersion }) => {
    const i = item as Extract<PreviewItem, { key: "TestimonialGridCase1" }>;
    return (
      <TestimonialGridCase1
        key={`${i.key}-${refreshVersion}-${layoutId}`}
        data={{ ...i.props, titleLayout: layoutId }}
      />
    );
  },
  TestimonialGridCase2: ({ item, layoutId, refreshVersion }) => {
    const i = item as Extract<PreviewItem, { key: "TestimonialGridCase2" }>;
    return (
      <TestimonialGridCase2
        key={`${i.key}-${refreshVersion}-${layoutId}`}
        data={{ ...i.props, titleLayout: layoutId }}
      />
    );
  },
  TestimonialGridCase3: ({ item, layoutId, refreshVersion }) => {
    const i = item as Extract<PreviewItem, { key: "TestimonialGridCase3" }>;
    return (
      <TestimonialGridCase3
        key={`${i.key}-${refreshVersion}-${layoutId}`}
        data={{ ...i.props, titleLayout: layoutId }}
      />
    );
  },
};

/** 全屏 Dialog 内预览：无 refresh remount key */
const testimonialDemoDialogPreviewByKey: Record<
  PreviewKey,
  (input: { item: PreviewItem; titleLayout: CyTitleLayoutId }) => ReactNode
> = {
  TestimonialGridCase1: ({ item, titleLayout }) => {
    const i = item as Extract<PreviewItem, { key: "TestimonialGridCase1" }>;
    return <TestimonialGridCase1 data={{ ...i.props, titleLayout }} />;
  },
  TestimonialGridCase2: ({ item, titleLayout }) => {
    const i = item as Extract<PreviewItem, { key: "TestimonialGridCase2" }>;
    return <TestimonialGridCase2 data={{ ...i.props, titleLayout }} />;
  },
  TestimonialGridCase3: ({ item, titleLayout }) => {
    const i = item as Extract<PreviewItem, { key: "TestimonialGridCase3" }>;
    return <TestimonialGridCase3 data={{ ...i.props, titleLayout }} />;
  },
};

const previewItems: PreviewItem[] = [
  {
    key: "TestimonialGridCase1",
    title: "TestimonialGridCase1",
    sourceFilePathForCopy: "@/components/cy/UsersSay/testimonial_grid_case1.tsx",
    props: cyModulesConfig.TestimonialGridCase1 as TestimonialGridCase1Data,
    usageCode: [
      "import { TestimonialGridCase1 } from '@/components/cy/UsersSay/testimonial_grid_case1';",
      "import cyModulesConfig from '@/components/cy/cy-modules.config.json';",
      "",
      "export default function Page() {",
      "  return <TestimonialGridCase1 data={cyModulesConfig.TestimonialGridCase1} />;",
      "}",
    ].join("\n"),
  },
  {
    key: "TestimonialGridCase2",
    title: "TestimonialGridCase2",
    sourceFilePathForCopy: "@/components/cy/UsersSay/testimonial_grid_case2.tsx",
    props: cyModulesConfig.TestimonialGridCase2 as TestimonialGridCase2Data,
    usageCode: [
      "import { TestimonialGridCase2 } from '@/components/cy/UsersSay/testimonial_grid_case2';",
      "import cyModulesConfig from '@/components/cy/cy-modules.config.json';",
      "",
      "export default function Page() {",
      "  return <TestimonialGridCase2 data={cyModulesConfig.TestimonialGridCase2} />;",
      "}",
    ].join("\n"),
  },
  {
    key: "TestimonialGridCase3",
    title: "TestimonialGridCase3",
    sourceFilePathForCopy: "@/components/cy/UsersSay/testimonial_grid_case3.tsx",
    props: cyModulesConfig.TestimonialGridCase3 as TestimonialGridCase3Data,
    usageCode: [
      "import { TestimonialGridCase3 } from '@/components/cy/UsersSay/testimonial_grid_case3';",
      "import cyModulesConfig from '@/components/cy/cy-modules.config.json';",
      "",
      "export default function Page() {",
      "  return <TestimonialGridCase3 data={cyModulesConfig.TestimonialGridCase3} />;",
      "}",
    ].join("\n"),
  },
];

const defaultTitleLayoutByKey: Record<PreviewKey, CyTitleLayoutId> = {
  TestimonialGridCase1: defaultCyTitleLayoutByModuleKey.TestimonialGridCase1,
  TestimonialGridCase2: defaultCyTitleLayoutByModuleKey.TestimonialGridCase2,
  TestimonialGridCase3: defaultCyTitleLayoutByModuleKey.TestimonialGridCase3,
};

/**
 * 用户评价网格 Demo：双列卡片预览、标题布局下拉、刷新/全屏/复制 JSON。
 * 本组件无外部 props；各 Case 的 `data` 字段说明在页内「data 字段含义」折叠面板中展示。
 */
export function TestimonialGridDemo() {
  const [titleLayoutByKey, setTitleLayoutByKey] =
    useState<Record<PreviewKey, CyTitleLayoutId>>(defaultTitleLayoutByKey);
  const [activePreview, setActivePreview] = useState<PreviewKey | null>(null);
  const [copiedKey, setCopiedKey] = useState<PreviewKey | null>(null);
  const copyResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [refreshVersion, setRefreshVersion] = useState<Record<PreviewKey, number>>({
    TestimonialGridCase1: 0,
    TestimonialGridCase2: 0,
    TestimonialGridCase3: 0,
  });

  const copyConfigJson = async (key: PreviewKey) => {
    const item = previewItems.find((i) => i.key === key);
    const ok = await copyCyModuleConfigJson(key, cyModulesConfig, {
      sourceFilePath: item?.sourceFilePathForCopy,
      mergeRoot: { titleLayout: titleLayoutByKey[key] },
    });
    if (copyResetRef.current) clearTimeout(copyResetRef.current);
    if (ok) {
      setCopiedKey(key);
      copyResetRef.current = setTimeout(() => setCopiedKey(null), 2000);
    } else {
      setCopiedKey(null);
    }
  };

  const activeItem = useMemo(
    () => previewItems.find((item) => item.key === activePreview) ?? null,
    [activePreview]
  );

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {previewItems.map((item) => {
          const layoutId = titleLayoutByKey[item.key];
          return (
            <article
              key={item.key}
              className="flex min-h-[620px] flex-col rounded-xl border bg-card"
            >
              <div className="flex flex-col gap-3 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-base font-semibold">{item.title}</h3>
                <div className="flex flex-wrap items-center justify-end gap-2 sm:shrink-0">
                  <Button
                    variant="outline"
                    size="icon"
                    className="cursor-pointer"
                    onClick={() =>
                      setRefreshVersion((prev) => ({
                        ...prev,
                        [item.key]: prev[item.key] + 1,
                      }))
                    }
                    aria-label={`刷新 ${item.title}`}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="cursor-pointer"
                    onClick={() => setActivePreview(item.key)}
                    aria-label={`全屏预览 ${item.title}`}
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                      "cursor-pointer transition-all duration-200 active:scale-90",
                      copiedKey === item.key &&
                        "bg-primary/10 text-primary ring-2 ring-primary/40 hover:bg-primary/15 hover:text-primary"
                    )}
                    onClick={() => void copyConfigJson(item.key)}
                    aria-label={`复制 ${item.title} 对应配置 JSON（含标题布局 id）`}
                  >
                    {copiedKey === item.key ? (
                      <Check className="h-4 w-4 scale-100 motion-safe:animate-in motion-safe:zoom-in-50 motion-safe:duration-200" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <CyTitleLayoutSelect
                    id={`cy-title-layout-select-${item.key}`}
                    value={layoutId}
                    onValueChange={(v) =>
                      setTitleLayoutByKey((prev) => ({
                        ...prev,
                        [item.key]: v,
                      }))
                    }
                    ariaLabel={`${item.title} 标题区组件`}
                    triggerClassName="md:w-[140px]"
                  />
                </div>
              </div>
              <CyDemoDataFieldDocs
                sections={testimonialGridDemoDataFieldDocSections[item.key]}
                typesPathLabel={testimonialGridDemoFieldDocsTypesPath}
                layoutPathLabel={testimonialGridDemoFieldDocsLayoutPath}
              />
              <div className="h-[82vh] overflow-hidden overflow-y-auto">
                {testimonialDemoGridPreviewByKey[item.key]({
                  item,
                  layoutId,
                  refreshVersion: refreshVersion[item.key],
                })}
              </div>
              <div className="border-t bg-muted/30 p-3">
                <p className="mb-2 text-xs font-medium text-muted-foreground">Usage</p>
                <pre className="overflow-auto rounded-md bg-background p-3 text-xs text-foreground">
                  <code>{item.usageCode}</code>
                </pre>
                <p className="mt-2 text-xs text-muted-foreground">
                  本模块复制会把当前下拉里选中的布局写入根字段{" "}
                  <code className="rounded bg-muted px-1">titleLayout</code>；{" "}
                  <code className="rounded bg-muted px-1">__cyComponentPath</code> 仅作粘贴说明，生成页面前会剔除。
                </p>
              </div>
            </article>
          );
        })}
      </div>

      <Dialog open={Boolean(activeItem)} onOpenChange={(open) => !open && setActivePreview(null)}>
        <DialogContent className="!top-0 !left-0 !h-screen !w-screen !max-w-none !translate-x-0 !translate-y-0 overflow-hidden rounded-none border-0 p-0">
          {activeItem ? (
            <div className="flex h-full flex-col">
              <DialogHeader className="flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <DialogTitle className="text-left">{activeItem.title}</DialogTitle>
                <CyTitleLayoutSelect
                  id={`cy-title-layout-select-dialog-${activeItem.key}`}
                  value={titleLayoutByKey[activeItem.key]}
                  onValueChange={(v) =>
                    setTitleLayoutByKey((prev) => ({
                      ...prev,
                      [activeItem.key]: v,
                    }))
                  }
                  ariaLabel={`${activeItem.title} 标题区组件`}
                  triggerClassName="sm:w-[220px] mr-[50px]"
                />
              </DialogHeader>
              <CyDemoDataFieldDocs
                sections={testimonialGridDemoDataFieldDocSections[activeItem.key]}
                className="px-5"
                typesPathLabel={testimonialGridDemoFieldDocsTypesPath}
                layoutPathLabel={testimonialGridDemoFieldDocsLayoutPath}
              />
              <div className="flex-1 overflow-auto">
                {testimonialDemoDialogPreviewByKey[activeItem.key]({
                  item: activeItem,
                  titleLayout: titleLayoutByKey[activeItem.key],
                })}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
