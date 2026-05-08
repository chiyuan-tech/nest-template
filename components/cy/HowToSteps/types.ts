import type { CyTitleLayoutId } from "@/components/cy/headerLayout/cy-title-layout.config";

export interface HowToStepItem {
  name: string;
  image: string;
  text: string;
}

export interface HowToStepsCase1Data {
  decorIndex: string;
  kicker: string;
  sectionTitle: string;
  subtitle: string;
  titleLayout?: CyTitleLayoutId;
  steps: HowToStepItem[];
}

export type HowToStepsCase2IconName = "FileText" | "Upload" | "Download";

export interface HowToStepsCase2StepItem {
  icon: HowToStepsCase2IconName;
  title: string;
  description: string;
}

export interface HowToStepsCase2Data {
  decorIndex: string;
  kicker: string;
  sectionTitle: string;
  subtitle: string;
  titleLayout?: CyTitleLayoutId;
  steps: HowToStepsCase2StepItem[];
  guideHint: string;
  ctaLabel: string;
  ctaScrollTargetId: string;
}
