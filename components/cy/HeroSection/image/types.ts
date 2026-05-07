export interface ImageHeroCtaButton {
  text: string;
  href: string;
}

export interface ImageHeroData {
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
