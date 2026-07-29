import { CollapsibleFaqDemo } from "@/components/cy/FAQ/CollapsibleFaqDemo";
import { VideoHeroDemo } from "@/components/cy/HeroSection/video/VideoHeroDemo";
import { KeyFeatureDemo } from "@/components/cy/KeyFeature/KeyFeatureDemo";
import { UseCasesGridDemo } from "@/components/cy/UseCases/useCasesDemo";
import { TestimonialGridDemo } from "@/components/cy/UsersSay/TestimonialGridDemo";
import { ButtonGuideDemo } from "@/components/cy/button/ButtonGuideDemo";
import { FontPairingDemo } from "@/components/cy/fonts/FontPairingDemo";
import { ImageHeroDemo } from "@/components/cy/HeroSection/image/ImageHeroDemo";
import { HowToStepsDemo } from "@/components/cy/HowToSteps/HowToStepsDemo";
import { ComparisonDemo } from "@/components/cy/Comparison/ComparisonDemo";
import { PricingDemo } from "@/components/cy/Pricing/PricingDemo";
import type { CyCategorySlug } from "@/components/cy/registry";
import type { ComponentType } from "react";

type DemoRenderer = ComponentType;

const demoMap: Record<string, DemoRenderer> = {
  "fonts/font-pairing": FontPairingDemo,
  "button/button-guide": ButtonGuideDemo,
  "hero-section/video": VideoHeroDemo,
  "hero-section/image": ImageHeroDemo,
  "use-cases/use-cases": UseCasesGridDemo,
  "key-features/feature-cards": KeyFeatureDemo,
  "faq/collapsible-faq": CollapsibleFaqDemo,
  "users-say/testimonial-grid": TestimonialGridDemo,
  "how-to-steps/three-steps": HowToStepsDemo,
  "comparison/model-table": ComparisonDemo,
  "pricing/plans": PricingDemo,
};

export function getCyDemoRenderer(category: CyCategorySlug, demo: string) {
  return demoMap[`${category}/${demo}`];
}
