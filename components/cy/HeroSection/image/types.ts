export interface ImageHeroCtaButton {
  text: string;
  href: string;
}

export interface ImageHeroData {
  headingLevel?: 'h1' | 'h2';
  title: string;
  subtitle: string;
  ctaButtons: ImageHeroCtaButton[];
  heroImage: string;
  featureChips: string[];
  liveBriefEmphasis: string;
  liveBriefTail: string;
  logoImages?: string[];
  badgeText?: string;
}
