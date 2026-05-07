"use client";

import { useMemo, useRef, useState } from "react";
import type { ComponentType } from "react";
import { Check, Copy, Maximize2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import cyModulesConfig from "@/components/cy/cy-modules.config.json";

import { VideoHeroCase1 } from "./videoHero_case1";
import { VideoHeroCase2 } from "./videoHero_case2";
import { VideoHeroCase3 } from "./videoHero_case3";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { HeroSectionData } from "@/components/cy/HeroSection/video/types";
import { copyCyModuleConfigJson } from "@/components/cy/utils";
import { cn } from "@/lib/utils";
import { CyDemoDataFieldDocs } from "@/components/cy/common/CyDemoDataFieldDocs";
import {
  videoHeroDemoDataFieldDocSections,
  videoHeroDemoFieldDocsTypesPath,
  type VideoHeroDemoPreviewKey,
} from "@/components/cy/HeroSection/video/VideoHeroDemo.data";

type PreviewKey = VideoHeroDemoPreviewKey;

interface PreviewItem {
  key: PreviewKey;
  title: string;
  sourceFilePathForCopy: string;
  Component: ComponentType<{ data: HeroSectionData }>;
  usageCode: string;
  props: any;
}


const previewItems: PreviewItem[] = [
  {
    key: "VideoHeroCase1",
    title: "Video Hero Example 1",
    sourceFilePathForCopy:
      "@/components/cy/HeroSection/video/videoHero_case1.tsx",
    Component: VideoHeroCase1,
    props: cyModulesConfig.VideoHeroCase1,
    usageCode: [
      "import VideoHeroCase1 from '@/components/cy/HeroSection/video/videoHero_case1';",
      "import cyModulesConfig from '@/components/cy/cy-modules.config.json';",
      "",
      "export default function Page() {",
      "  return <VideoHeroCase1 data={cyModulesConfig.videoHero_case1} />;",
      "}",
    ].join("\n"),
  },
  {
    key: "VideoHeroCase2",
    title: "Video Hero Example 2",
    sourceFilePathForCopy:
      "@/components/cy/HeroSection/video/videoHero_case2.tsx",
    Component: VideoHeroCase2,
    props: cyModulesConfig.VideoHeroCase2,
    usageCode: [
      "import VideoHeroCase2 from '@/components/cy/HeroSection/video/videoHero_case2';",
      "import cyModulesConfig from '@/components/cy/cy-modules.config.json';",
      "",
      "export default function Page() {",
      "  return <VideoHeroCase2 data={cyModulesConfig.videoHero_case2} />;",
      "}",
    ].join("\n"),
  },
  {
    key: "VideoHeroCase3",
    title: "Video Hero Example 3",
    sourceFilePathForCopy:
      "@/components/cy/HeroSection/video/videoHero_case3.tsx",
    Component: VideoHeroCase3,
    props: cyModulesConfig.VideoHeroCase3,
    usageCode: [
      "import VideoHeroCase3 from '@/components/cy/HeroSection/video/videoHero_case3';",
      "import cyModulesConfig from '@/components/cy/cy-modules.config.json';",
      "",
      "export default function Page() {",
      "  return <VideoHeroCase3 data={cyModulesConfig.videoHero_case3} />;",
      "}",
    ].join("\n"),
  },
];

export function VideoHeroDemo() {
  const [activePreview, setActivePreview] = useState<PreviewKey | null>(null);
  const [copiedKey, setCopiedKey] = useState<PreviewKey | null>(null);
  const copyResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [refreshVersion, setRefreshVersion] = useState<Record<PreviewKey, number>>({
    VideoHeroCase1: 0,
    VideoHeroCase2: 0,
    VideoHeroCase3: 0,
  });

  const copyConfigJson = async (key: PreviewKey) => {
    const item = previewItems.find((i) => i.key === key);
    const ok = await copyCyModuleConfigJson(key, cyModulesConfig, {
      sourceFilePath: item?.sourceFilePathForCopy,
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
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {previewItems.map((item) => {
          const PreviewComponent = item.Component;
          return (
            <article key={item.key} className="flex min-h-[620px] flex-col rounded-xl border bg-card">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div>
                  <h3 className="text-base font-semibold">{item.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="cursor-pointer"
                    onClick={() =>
                      setRefreshVersion((prev) => ({ ...prev, [item.key]: prev[item.key] + 1 }))
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
                    aria-label={`复制 ${item.title} 对应配置 JSON`}
                  >
                    {copiedKey === item.key ? (
                      <Check className="h-4 w-4 scale-100 motion-safe:animate-in motion-safe:zoom-in-50 motion-safe:duration-200" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <CyDemoDataFieldDocs
                sections={videoHeroDemoDataFieldDocSections[item.key]}
                typesPathLabel={videoHeroDemoFieldDocsTypesPath}
              />
              <div className="h-[82vh] overflow-hidden">
                <PreviewComponent
                  key={`${item.key}-${refreshVersion[item.key]}`}
                  data={item.props}
                />
              </div>
              <div className="border-t bg-muted/30 p-3">
                <p className="mb-2 text-xs font-medium text-muted-foreground">Usage</p>
                <pre className="overflow-auto rounded-md bg-background p-3 text-xs text-foreground">
                  <code>{item.usageCode}</code>
                </pre>
              </div>
            </article>
          );
        })}
      </div>

      <Dialog open={Boolean(activeItem)} onOpenChange={(open) => !open && setActivePreview(null)}>
        <DialogContent className="!top-0 !left-0 !h-screen !w-screen !max-w-none !translate-x-0 !translate-y-0 overflow-hidden rounded-none border-0 p-0">
          {activeItem ? (
            <div className="flex h-full flex-col">
              <DialogHeader className="border-b px-5 py-4">
                <DialogTitle>{activeItem.title}</DialogTitle>
              </DialogHeader>
              <CyDemoDataFieldDocs
                sections={videoHeroDemoDataFieldDocSections[activeItem.key]}
                className="px-5"
                typesPathLabel={videoHeroDemoFieldDocsTypesPath}
              />
              <div className="flex-1 overflow-hidden">
                <activeItem.Component data={activeItem.props} />
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
