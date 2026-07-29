"use client";
import { FaqCase1 } from "@/components/cy/FAQ/faq_case1";
import type { FaqCase1Data } from "@/components/cy/FAQ/types";
import cyModulesConfig from "@/components/cy/cy-modules.config.json";
import { CyModuleDemo, type CyDemoDefinition } from "@/components/cy/studio/CyModuleDemo";
import { collapsibleFaqDemoDataFieldDocSections, collapsibleFaqDemoFieldDocsTypesPath, type CollapsibleFaqDemoPreviewKey } from "@/components/cy/FAQ/CollapsibleFaqDemo.data";
const data = cyModulesConfig.FaqCase1 as FaqCase1Data;
const definitions: readonly CyDemoDefinition<CollapsibleFaqDemoPreviewKey>[] = [
  { key: "FaqCase1", title: "FAQ Case 1", sourceFilePath: "@/components/cy/FAQ/faq_case1.tsx", usageCode: "import { FaqCase1 } from '@/components/cy/FAQ/faq_case1';", docs: collapsibleFaqDemoDataFieldDocSections.FaqCase1, render: ({ refreshVersion }) => <FaqCase1 key={`FaqCase1-${refreshVersion}`} data={data} /> }
];
export function CollapsibleFaqDemo() { return <CyModuleDemo definitions={definitions} typesPathLabel={collapsibleFaqDemoFieldDocsTypesPath} />; }
