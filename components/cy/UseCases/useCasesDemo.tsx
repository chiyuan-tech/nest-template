"use client";
import { UseCasesGalleryCase1 } from "@/components/cy/UseCases/use_cases_gallery_case1";
import type { UseCasesGalleryCase1Data } from "@/components/cy/UseCases/types";
import cyModulesConfig from "@/components/cy/cy-modules.config.json";
import { CyModuleDemo, type CyDemoDefinition } from "@/components/cy/studio/CyModuleDemo";
import { defaultCyTitleLayoutByModuleKey } from "@/components/cy/headerLayout/cy-title-layout.config";
import { useCasesGridDemoDataFieldDocSections, useCasesGridDemoFieldDocsLayoutPath, useCasesGridDemoFieldDocsTypesPath, type UseCasesGridDemoPreviewKey } from "@/components/cy/UseCases/useCasesDemo.data";
const definitions: readonly CyDemoDefinition<UseCasesGridDemoPreviewKey>[] = [{ key: "UseCasesGalleryCase1", title: "UseCasesGalleryCase1", sourceFilePath: "@/components/cy/UseCases/use_cases_gallery_case1.tsx", usageCode: "import { UseCasesGalleryCase1 } from '@/components/cy/UseCases/use_cases_gallery_case1';\nimport cyModulesConfig from '@/components/cy/cy-modules.config.json';\n\nexport default function Page() { return <UseCasesGalleryCase1 data={cyModulesConfig.UseCasesGalleryCase1} />; }", docs: useCasesGridDemoDataFieldDocSections.UseCasesGalleryCase1, defaultTitleLayout: defaultCyTitleLayoutByModuleKey.UseCasesGalleryCase1, render: ({ refreshVersion, titleLayout }) => <UseCasesGalleryCase1 key={`UseCasesGalleryCase1-${refreshVersion}-${titleLayout}`} data={{ ...(cyModulesConfig.UseCasesGalleryCase1 as UseCasesGalleryCase1Data), titleLayout }} /> }];
export function UseCasesGridDemo() { return <CyModuleDemo definitions={definitions} typesPathLabel={useCasesGridDemoFieldDocsTypesPath} layoutPathLabel={useCasesGridDemoFieldDocsLayoutPath} />; }
