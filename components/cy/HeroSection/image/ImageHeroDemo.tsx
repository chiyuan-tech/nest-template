"use client";
import { ImageHeroCase1 } from "@/components/cy/HeroSection/image/imageHero_case1";
import { ImageHeroCase2 } from "@/components/cy/HeroSection/image/imageHero_case2";
import type { ImageHeroData } from "@/components/cy/HeroSection/image/types";
import cyModulesConfig from "@/components/cy/cy-modules.config.json";
import { CyModuleDemo, type CyDemoDefinition } from "@/components/cy/studio/CyModuleDemo";
import { imageHeroDemoDataFieldDocSections, imageHeroDemoFieldDocsTypesPath, type ImageHeroDemoPreviewKey } from "@/components/cy/HeroSection/image/ImageHeroDemo.data";
const definitions: readonly CyDemoDefinition<ImageHeroDemoPreviewKey>[] = [
  { key: "ImageHeroCase1", title: "Image Hero Case 1", sourceFilePath: "@/components/cy/HeroSection/image/imageHero_case1.tsx", usageCode: "import { ImageHeroCase1 } from '@/components/cy/HeroSection/image/imageHero_case1';\nimport cyModulesConfig from '@/components/cy/cy-modules.config.json';\n\nexport default function Page() { return <ImageHeroCase1 data={cyModulesConfig.ImageHeroCase1} />; }", docs: imageHeroDemoDataFieldDocSections.ImageHeroCase1, render: ({ refreshVersion }) => <ImageHeroCase1 key={`ImageHeroCase1-${refreshVersion}`} data={cyModulesConfig.ImageHeroCase1 as ImageHeroData} /> },
  { key: "ImageHeroCase2", title: "Image Hero Case 2", sourceFilePath: "@/components/cy/HeroSection/image/imageHero_case2.tsx", usageCode: "import { ImageHeroCase2 } from '@/components/cy/HeroSection/image/imageHero_case2';\nimport cyModulesConfig from '@/components/cy/cy-modules.config.json';\n\nexport default function Page() { return <ImageHeroCase2 data={cyModulesConfig.ImageHeroCase2} />; }", docs: imageHeroDemoDataFieldDocSections.ImageHeroCase2, render: ({ refreshVersion }) => <ImageHeroCase2 key={`ImageHeroCase2-${refreshVersion}`} data={cyModulesConfig.ImageHeroCase2 as ImageHeroData} /> }
];
export function ImageHeroDemo() { return <CyModuleDemo definitions={definitions} typesPathLabel={imageHeroDemoFieldDocsTypesPath} />; }
