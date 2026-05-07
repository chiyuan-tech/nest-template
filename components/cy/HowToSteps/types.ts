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
