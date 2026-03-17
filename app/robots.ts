import type { MetadataRoute } from 'next';
import { siteUrl } from '@/website-config';

const AI_BOTS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'anthropic-ai',
  'ClaudeBot',
  'Claude-Web',
  'Google-Extended',
  'PerplexityBot',
  'CCBot',
  'Bytespider',
  'Applebot-Extended',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/llms.txt'],
        disallow: ['/api/', '/admin/', '/profile/'],
      },
      {
        userAgent: AI_BOTS,
        allow: ['/', '/llms.txt'],
        disallow: ['/api/', '/admin/', '/profile/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}