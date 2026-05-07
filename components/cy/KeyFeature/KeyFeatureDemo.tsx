"use client";

import type { ReactNode } from "react";
import { useMemo, useRef, useState } from "react";
import { Check, Copy, Maximize2, RefreshCw } from "lucide-react";
import { KeyFeatureCase1 } from "@/components/cy/KeyFeature/keyfeatureCase_1";
import { KeyFeatureCase2 } from "@/components/cy/KeyFeature/keyfeatureCase_2";
import type { KeyFeatureCase1Data, KeyFeatureCase2Data } from "@/components/cy/KeyFeature/types";
import { Button } from "@/components/ui/button";
import cyModulesConfig from "@/components/cy/cy-modules.config.json";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CyTitleLayoutSelect } from "@/components/cy/headerLayout/CyTitleLayoutSelect";
import { CyDemoDataFieldDocs } from "@/components/cy/common/CyDemoDataFieldDocs";
import {
  keyFeatureDemoDataFieldDocSections,
  keyFeatureDemoFieldDocsLayoutPath,
  keyFeatureDemoFieldDocsTypesPath,
  type KeyFeatureDemoPreviewKey,
} from "@/components/cy/KeyFeature/KeyFeatureDemo.data";
import {
  defaultCyTitleLayoutByModuleKey,
  type CyTitleLayoutId,
} from "@/components/cy/headerLayout/cy-title-layout.config";
import { copyCyModuleConfigJson } from "@/components/cy/utils";
import { cn } from "@/lib/utils";

type PreviewItem =
  | {
      key: "KeyFeatureCase1";
      title: string;
      sourceFilePathForCopy: string;
      usageCode: string;
      props: KeyFeatureCase1Data;
    }
  | {
      key: "KeyFeatureCase2";
      title: string;
      sourceFilePathForCopy: string;
      usageCode: string;
      props: KeyFeatureCase2Data;
    };

type PreviewKey = KeyFeatureDemoPreviewKey;

/** 卡片预览与全屏 Dialog 共用；传入 `refreshVersion` 时带 key 以便刷新后 remount。 */
function renderKeyFeatureDemoPreview(input: {
  item: PreviewItem;
  titleLayout: CyTitleLayoutId;
  refreshVersion?: number;
}): ReactNode {
  const { item, titleLayout, refreshVersion } = input;
  const remountKey =
    refreshVersion !== undefined ? `${item.key}-${refreshVersion}-${titleLayout}` : undefined;
  const extra = remountKey !== undefined ? { key: remountKey } : {};

  switch (item.key) {
    case "KeyFeatureCase1":
      return (
        <KeyFeatureCase1 {...extra} data={{ ...item.props, titleLayout }} key={remountKey} />
      );
    case "KeyFeatureCase2":
      return (
        <KeyFeatureCase2 {...extra} data={{ ...item.props, titleLayout }} key={remountKey} />
      );
  }
}

const previewItems: PreviewItem[] = [
  {
    key: "KeyFeatureCase1",
    title: "KeyFeatureCase1",
    sourceFilePathForCopy: "@/components/cy/KeyFeature/keyfeatureCase_1.tsx",
    props: cyModulesConfig.KeyFeatureCase1 as KeyFeatureCase1Data,
    usageCode: [
      "import { KeyFeatureCase1 } from '@/components/cy/KeyFeature/keyfeatureCase_1';",
      "import cyModulesConfig from '@/components/cy/cy-modules.config.json';",
      "",
      "export default function Page() {",
      "  return <KeyFeatureCase1 data={cyModulesConfig.KeyFeatureCase1} />;",
      "}",
    ].join("\n"),
  },
  {
    key: "KeyFeatureCase2",
    title: "KeyFeatureCase2",
    sourceFilePathForCopy: "@/components/cy/KeyFeature/keyfeatureCase_2.tsx",
    props: cyModulesConfig.KeyFeatureCase2 as KeyFeatureCase2Data,
    usageCode: [
      "import { KeyFeatureCase2 } from '@/components/cy/KeyFeature/keyfeatureCase_2';",
      "import cyModulesConfig from '@/components/cy/cy-modules.config.json';",
      "",
      "export default function Page() {",
      "  return <KeyFeatureCase2 data={cyModulesConfig.KeyFeatureCase2} />;",
      "}",
    ].join("\n"),
  },
];

const defaultTitleLayoutByKey: Record<PreviewKey, CyTitleLayoutId> = {
  KeyFeatureCase1: defaultCyTitleLayoutByModuleKey.KeyFeatureCase1,
  KeyFeatureCase2: defaultCyTitleLayoutByModuleKey.KeyFeatureCase2,
};

export function KeyFeatureDemo() {
  const [titleLayoutByKey, setTitleLayoutByKey] =
    useState<Record<PreviewKey, CyTitleLayoutId>>(defaultTitleLayoutByKey);
  const [activePreview, setActivePreview] = useState<PreviewKey | null>(null);
  const [copiedKey, setCopiedKey] = useState<PreviewKey | null>(null);
  const copyResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [refreshVersion, setRefreshVersion] = useState<Record<PreviewKey, number>>({
    KeyFeatureCase1: 0,
    KeyFeatureCase2: 0,
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
                sections={keyFeatureDemoDataFieldDocSections[item.key]}
                typesPathLabel={keyFeatureDemoFieldDocsTypesPath}
                layoutPathLabel={keyFeatureDemoFieldDocsLayoutPath}
              />
              <div className="h-[82vh] overflow-hidden overflow-y-auto">
                {renderKeyFeatureDemoPreview({
                  item,
                  titleLayout: layoutId,
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
        <DialogContent className="!top-0 !left-0 !h-screen !w-screen !max-w-none !translate-x-0 !translate-y-0 overflow-hidden rounded-none border-0 p-0 overflow-y-auto">
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
                sections={keyFeatureDemoDataFieldDocSections[activeItem.key]}
                className="px-5"
                typesPathLabel={keyFeatureDemoFieldDocsTypesPath}
                layoutPathLabel={keyFeatureDemoFieldDocsLayoutPath}
              />
              <div className="flex-1 overflow-auto">
                {renderKeyFeatureDemoPreview({
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

export { KeyFeatureCase1 } from "@/components/cy/KeyFeature/keyfeatureCase_1";
export { KeyFeatureCase2 } from "@/components/cy/KeyFeature/keyfeatureCase_2";
export type {
  KeyFeatureCase1Data,
  KeyFeatureCase2Card,
  KeyFeatureCase2CardImage,
  KeyFeatureCase2CardVideo,
  KeyFeatureCase2Data,
  KeyFeatureItem,
  KeyFeatureItemImage,
  KeyFeatureItemVideo,
} from "@/components/cy/KeyFeature/types";
export { isKeyFeatureCase2VideoCard, isKeyFeatureVideoItem } from "@/components/cy/utils";
