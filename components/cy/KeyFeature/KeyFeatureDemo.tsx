"use client";
import { KeyFeatureCase1 } from "@/components/cy/KeyFeature/keyfeatureCase_1";
import { KeyFeatureCase2 } from "@/components/cy/KeyFeature/keyfeatureCase_2";
import type { KeyFeatureCase1Data, KeyFeatureCase2Data } from "@/components/cy/KeyFeature/types";
import cyModulesConfig from "@/components/cy/cy-modules.config.json";
import { CyModuleDemo, type CyDemoDefinition } from "@/components/cy/studio/CyModuleDemo";
import { defaultCyTitleLayoutByModuleKey } from "@/components/cy/headerLayout/cy-title-layout.config";
import { keyFeatureDemoDataFieldDocSections, keyFeatureDemoFieldDocsLayoutPath, keyFeatureDemoFieldDocsTypesPath, type KeyFeatureDemoPreviewKey } from "@/components/cy/KeyFeature/KeyFeatureDemo.data";
const definitions: readonly CyDemoDefinition<KeyFeatureDemoPreviewKey>[] = [
  { key: "KeyFeatureCase1", title: "KeyFeatureCase1", sourceFilePath: "@/components/cy/KeyFeature/keyfeatureCase_1.tsx", usageCode: "import { KeyFeatureCase1 } from '@/components/cy/KeyFeature/keyfeatureCase_1';", docs: keyFeatureDemoDataFieldDocSections.KeyFeatureCase1, defaultTitleLayout: defaultCyTitleLayoutByModuleKey.KeyFeatureCase1, render: ({ refreshVersion, titleLayout }) => <KeyFeatureCase1 key={`KeyFeatureCase1-${refreshVersion}-${titleLayout}`} data={{ ...(cyModulesConfig.KeyFeatureCase1 as KeyFeatureCase1Data), titleLayout }} /> },
  { key: "KeyFeatureCase2", title: "KeyFeatureCase2", sourceFilePath: "@/components/cy/KeyFeature/keyfeatureCase_2.tsx", usageCode: "import { KeyFeatureCase2 } from '@/components/cy/KeyFeature/keyfeatureCase_2';", docs: keyFeatureDemoDataFieldDocSections.KeyFeatureCase2, defaultTitleLayout: defaultCyTitleLayoutByModuleKey.KeyFeatureCase2, render: ({ refreshVersion, titleLayout }) => <KeyFeatureCase2 key={`KeyFeatureCase2-${refreshVersion}-${titleLayout}`} data={{ ...(cyModulesConfig.KeyFeatureCase2 as KeyFeatureCase2Data), titleLayout }} /> }
];
export function KeyFeatureDemo() { return <CyModuleDemo definitions={definitions} typesPathLabel={keyFeatureDemoFieldDocsTypesPath} layoutPathLabel={keyFeatureDemoFieldDocsLayoutPath} />; }
