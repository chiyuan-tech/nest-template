'use client';

import { ClerkProvider } from '@clerk/nextjs';

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

function decodeBase64(value: string) {
  if (typeof atob === 'function') {
    return atob(value);
  }
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(value, 'base64').toString();
  }
  return '';
}

/** Pin to clerk-js 5.x matching @clerk/nextjs 6.17 / clerk-react 5.x — never use @latest. */
const CLERK_JS_VERSION = '5.62.0';

const frontendApi = publishableKey ? decodeBase64(publishableKey.split('_')[2] || '').replace(/\$$/, '') : '';
const clerkJSUrl = frontendApi
  ? `https://${frontendApi}/npm/@clerk/clerk-js@${CLERK_JS_VERSION}/dist/clerk.browser.js`
  : undefined;

export default function ClerkProviderWithLocale({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      publishableKey={publishableKey}
      clerkJSUrl={clerkJSUrl}
      clerkJSVersion={CLERK_JS_VERSION}
      appearance={{
        layout: {
          socialButtonsVariant: 'iconButton',
          socialButtonsPlacement: 'top',
          showOptionalFields: false,
          shimmer: false,
        },
        variables: {
          colorPrimary: '#141413',
          colorBackground: '#ffffff',
          colorText: '#141413',
          colorTextSecondary: '#696969',
          borderRadius: '1.25rem',
          fontFamily: 'var(--font-poppins), Sofia Sans, Arial, sans-serif',
        },
        elements: {
          formButtonPrimary: 'bg-black hover:bg-gray-800 text-sm normal-case',
          card: 'shadow-none',
          footer: 'hidden',
          formFieldInput: 'rounded-full border-gray-300 focus:border-black focus:ring-black',
          formFieldLabel: 'text-gray-700',
          main: 'min-w-[320px] font-sans',
          identityPreview: 'shadow-sm border-gray-200',
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
