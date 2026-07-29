"use client";
import { VideoHeroCase1 } from "./videoHero_case1";
import { VideoHeroCase2 } from "./videoHero_case2";
import { VideoHeroCase3 } from "./videoHero_case3";
import type { HeroSectionData } from "@/components/cy/HeroSection/video/types";
import cyModulesConfig from "@/components/cy/cy-modules.config.json";
import { CyModuleDemo, type CyDemoDefinition } from "@/components/cy/studio/CyModuleDemo";
import { videoHeroDemoDataFieldDocSections, videoHeroDemoFieldDocsTypesPath, type VideoHeroDemoPreviewKey } from "@/components/cy/HeroSection/video/VideoHeroDemo.data";
const definitions: readonly CyDemoDefinition<VideoHeroDemoPreviewKey>[] = [
  { key: "VideoHeroCase1", title: "Video Hero Case 1", sourceFilePath: "@/components/cy/HeroSection/video/videoHero_case1.tsx", usageCode: "import { VideoHeroCase1 } from '@/components/cy/HeroSection/video/videoHero_case1';", docs: videoHeroDemoDataFieldDocSections.VideoHeroCase1, render: ({ refreshVersion }) => <VideoHeroCase1 key={`VideoHeroCase1-${refreshVersion}`} data={cyModulesConfig.VideoHeroCase1 as HeroSectionData} /> },
  { key: "VideoHeroCase2", title: "Video Hero Case 2", sourceFilePath: "@/components/cy/HeroSection/video/videoHero_case2.tsx", usageCode: "import { VideoHeroCase2 } from '@/components/cy/HeroSection/video/videoHero_case2';", docs: videoHeroDemoDataFieldDocSections.VideoHeroCase2, render: ({ refreshVersion }) => <VideoHeroCase2 key={`VideoHeroCase2-${refreshVersion}`} data={cyModulesConfig.VideoHeroCase2 as HeroSectionData} /> },
  { key: "VideoHeroCase3", title: "Video Hero Case 3", sourceFilePath: "@/components/cy/HeroSection/video/videoHero_case3.tsx", usageCode: "import { VideoHeroCase3 } from '@/components/cy/HeroSection/video/videoHero_case3';", docs: videoHeroDemoDataFieldDocSections.VideoHeroCase3, render: ({ refreshVersion }) => <VideoHeroCase3 key={`VideoHeroCase3-${refreshVersion}`} data={cyModulesConfig.VideoHeroCase3 as HeroSectionData} /> }
];
export function VideoHeroDemo() { return <CyModuleDemo definitions={definitions} typesPathLabel={videoHeroDemoFieldDocsTypesPath} />; }
