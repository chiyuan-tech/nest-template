"use client";

import { ComparisonTableCase1 } from "@/components/cy/Comparison/comparison_table_case1";
import type { ComparisonTableCase1Data } from "@/components/cy/Comparison/types";
import cyModulesConfig from "@/components/cy/cy-modules.config.json";
import { CyModuleDemo, type CyDemoDefinition } from "@/components/cy/studio/CyModuleDemo";
import { defaultCyTitleLayoutByModuleKey } from "@/components/cy/headerLayout/cy-title-layout.config";
import { comparisonDemoDataFieldDocSections, comparisonDemoFieldDocsLayoutPath, comparisonDemoFieldDocsTypesPath, type ComparisonDemoPreviewKey } from "@/components/cy/Comparison/ComparisonDemo.data";

const definitions: readonly CyDemoDefinition<ComparisonDemoPreviewKey>[] = [{
  key: "ComparisonTableCase1",
  title: "ComparisonTableCase1",
  sourceFilePath: "@/components/cy/Comparison/comparison_table_case1.tsx",
  usageCode: "import { ComparisonTableCase1 } from '@/components/cy/Comparison/comparison_table_case1';\nimport cyModulesConfig from '@/components/cy/cy-modules.config.json';\n\nexport default function Page() { return <ComparisonTableCase1 data={cyModulesConfig.ComparisonTableCase1} />; }",
  docs: comparisonDemoDataFieldDocSections.ComparisonTableCase1,
  defaultTitleLayout: defaultCyTitleLayoutByModuleKey.ComparisonTableCase1,
  render: ({ refreshVersion, titleLayout }) => <ComparisonTableCase1 key={`ComparisonTableCase1-${refreshVersion}-${titleLayout}`} data={{ ...(cyModulesConfig.ComparisonTableCase1 as ComparisonTableCase1Data), titleLayout }} />,
}];

export function ComparisonDemo() {
  return <CyModuleDemo definitions={definitions} typesPathLabel={comparisonDemoFieldDocsTypesPath} layoutPathLabel={comparisonDemoFieldDocsLayoutPath} />;
}
