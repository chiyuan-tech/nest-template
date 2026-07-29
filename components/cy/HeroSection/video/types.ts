export interface HeroCtaButton {
  text: string;
  href: string;
}

/** 底部 Stats 条（如 HeroBackgroundMedia） */
export interface HeroStatItem {
  label: string;
  value: string;
}

export interface HeroSectionData {
  title: string;
  subtitle: string;
  ctaButtons: HeroCtaButton[];
  socialProof: string;
  heroPoster: string;
  heroVideo: string;
  heroStats?: HeroStatItem[];
  badgeText?: string;
}
