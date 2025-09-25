'use client';

import { SignIn } from '@clerk/nextjs';

interface SignInModalProps {
  forceRedirectUrl?: string;
  fallbackRedirectUrl?: string;
}

export default function SignInModal({ 
  forceRedirectUrl, 
  fallbackRedirectUrl = '/' 
}: SignInModalProps) {
  return (
    <SignIn 
      forceRedirectUrl={forceRedirectUrl}
      fallbackRedirectUrl={fallbackRedirectUrl}
      routing="hash"
      appearance={{
        elements: {
          formButtonPrimary: 'bg-primary hover:bg-primary/90 text-white',
          card: 'shadow-lg border border-border',
          headerTitle: 'text-foreground',
          headerSubtitle: 'text-muted-foreground',
          socialButtonsBlockButton: 'border border-border hover:bg-accent',
          formFieldInput: 'border border-border focus:border-primary',
          footerActionLink: 'text-primary hover:text-primary/80',
        }
      }}
    />
  );
}
