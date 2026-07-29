import { getPageTdk, siteConfig, siteUrl } from '@/website-config';

const siteName = siteConfig.name;

export const homeHowToSteps = [
  { name: 'Describe your idea', text: 'Start with the outcome, audience, and creative direction you want to make.' },
  { name: 'Add your references', text: 'Bring together the images, video, audio, and notes that guide the result.' },
  { name: 'Create and refine', text: 'Generate the first version, review it, and iterate until it is ready to share.' },
];

export const homeFaqs = [
  { question: `What is ${siteName}?`, answer: `${siteName} is an AI creative workspace for turning an idea and supporting references into a finished video.` },
  { question: `How do I start with ${siteName}?`, answer: 'Describe the result you want, add useful references, then create and refine your first version.' },
];

export function HomeStructuredData() {
  const tdk = getPageTdk('/');
  const graph = [
    { '@type': 'WebSite', '@id': `${siteUrl}/#website`, name: siteName, url: siteUrl, description: tdk.description, inLanguage: 'en' },
    { '@type': 'Organization', '@id': `${siteUrl}/#organization`, name: siteName, url: siteUrl, logo: `${siteUrl}/logo.webp` },
    { '@type': 'WebApplication', '@id': `${siteUrl}/#application`, name: siteName, url: siteUrl, description: tdk.description, applicationCategory: 'MultimediaApplication', operatingSystem: 'Web', image: `${siteUrl}/share-img.png` },
    { '@type': 'WebPage', '@id': `${siteUrl}/#webpage`, name: tdk.title, url: siteUrl, description: tdk.description, isPartOf: { '@id': `${siteUrl}/#website` }, primaryImageOfPage: `${siteUrl}/share-img.png` },
    { '@type': 'HowTo', '@id': `${siteUrl}/#how-to-use`, name: `How to use ${siteName}`, description: 'A three-step workflow shown on this homepage.', image: `${siteUrl}/share-img.png`, step: homeHowToSteps.map((step, index) => ({ '@type': 'HowToStep', position: index + 1, name: step.name, text: step.text })) },
    { '@type': 'FAQPage', '@id': `${siteUrl}/#faq`, name: `${siteName} FAQ`, description: 'Answers shown in the homepage FAQ.', url: `${siteUrl}/#faq`, mainEntity: homeFaqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
  ];
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }) }} />;
}
