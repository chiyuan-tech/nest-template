"use client";
import { PricingCase1 } from "@/components/cy/Pricing/pricing_case1";
import { PricingCase2 } from "@/components/cy/Pricing/pricing_case2";
import type { PricingCase1Data, PricingCase2Data } from "@/components/cy/Pricing/types";
import cyModulesConfig from "@/components/cy/cy-modules.config.json";
import { CyModuleDemo, type CyDemoDefinition } from "@/components/cy/studio/CyModuleDemo";
import { defaultCyTitleLayoutByModuleKey } from "@/components/cy/headerLayout/cy-title-layout.config";
import { pricingDemoDataFieldDocSections, pricingDemoFieldDocsLayoutPath, pricingDemoFieldDocsTypesPath, type PricingDemoPreviewKey } from "@/components/cy/Pricing/PricingDemo.data";
const definitions: readonly CyDemoDefinition<PricingDemoPreviewKey>[] = [
  { key: "PricingCase1", title: "PricingCase1", sourceFilePath: "@/components/cy/Pricing/pricing_case1.tsx", usageCode: "import { PricingCase1 } from '@/components/cy/Pricing/pricing_case1';", docs: pricingDemoDataFieldDocSections.PricingCase1, defaultTitleLayout: defaultCyTitleLayoutByModuleKey.PricingCase1, render: ({ refreshVersion, titleLayout }) => <PricingCase1 key={`PricingCase1-${refreshVersion}-${titleLayout}`} data={{ ...(cyModulesConfig.PricingCase1 as PricingCase1Data), titleLayout }} /> },
  { key: "PricingCase2", title: "PricingCase2", sourceFilePath: "@/components/cy/Pricing/pricing_case2.tsx", usageCode: "import { PricingCase2 } from '@/components/cy/Pricing/pricing_case2';", docs: pricingDemoDataFieldDocSections.PricingCase2, defaultTitleLayout: defaultCyTitleLayoutByModuleKey.PricingCase2, render: ({ refreshVersion, titleLayout }) => <PricingCase2 key={`PricingCase2-${refreshVersion}-${titleLayout}`} data={{ ...(cyModulesConfig.PricingCase2 as PricingCase2Data), titleLayout }} /> }
];
export function PricingDemo() { return <CyModuleDemo definitions={definitions} typesPathLabel={pricingDemoFieldDocsTypesPath} layoutPathLabel={pricingDemoFieldDocsLayoutPath} />; }
