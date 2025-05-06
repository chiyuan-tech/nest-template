import { getRequestConfig } from 'next-intl/server';
// Removed cookies and notFound as we only support English now
// import { cookies } from 'next/headers'; 
// import { notFound } from 'next/navigation';

// Only English is supported now
const locales = ['en'];

export default getRequestConfig(async () => {
  // Always set locale to 'en'
  const locale = 'en'; 

  // Load English messages
  let messages;
  try {
    messages = (await import(`../messages/en.json`)).default;
  } catch (error) {
    console.error(`Could not load English messages!`, error);
    // If English fails, something is seriously wrong
    messages = {}; 
  }

  return {
    locale: locale,
    messages,
    // Timezone can remain or be removed if not needed
    timeZone: 'Asia/Shanghai' 
  };
}); 