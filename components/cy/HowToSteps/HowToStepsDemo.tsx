"use client";
import { HowToStepsCase1 } from "@/components/cy/HowToSteps/how_to_steps_case1";
import type { HowToStepsCase1Data } from "@/components/cy/HowToSteps/types";
import cyModulesConfig from "@/components/cy/cy-modules.config.json";
import { CyModuleDemo, type CyDemoDefinition } from "@/components/cy/studio/CyModuleDemo";
import { defaultCyTitleLayoutByModuleKey } from "@/components/cy/headerLayout/cy-title-layout.config";
import { howToStepsDemoDataFieldDocSections, howToStepsDemoFieldDocsLayoutPath, howToStepsDemoFieldDocsTypesPath, type HowToStepsDemoPreviewKey } from "@/components/cy/HowToSteps/HowToStepsDemo.data";
const definitions: readonly CyDemoDefinition<HowToStepsDemoPreviewKey>[] = [{ key: "HowToStepsCase1", title: "HowToStepsCase1", sourceFilePath: "@/components/cy/HowToSteps/how_to_steps_case1.tsx", usageCode: "import { HowToStepsCase1 } from '@/components/cy/HowToSteps/how_to_steps_case1';\nimport cyModulesConfig from '@/components/cy/cy-modules.config.json';\n\nexport default function Page() { return <HowToStepsCase1 data={cyModulesConfig.HowToStepsCase1} />; }", docs: howToStepsDemoDataFieldDocSections.HowToStepsCase1, defaultTitleLayout: defaultCyTitleLayoutByModuleKey.HowToStepsCase1, render: ({ refreshVersion, titleLayout }) => <HowToStepsCase1 key={`HowToStepsCase1-${refreshVersion}-${titleLayout}`} data={{ ...(cyModulesConfig.HowToStepsCase1 as HowToStepsCase1Data), titleLayout }} /> }];
export function HowToStepsDemo() { return <CyModuleDemo definitions={definitions} typesPathLabel={howToStepsDemoFieldDocsTypesPath} layoutPathLabel={howToStepsDemoFieldDocsLayoutPath} />; }
