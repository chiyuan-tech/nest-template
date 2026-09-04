'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import dynamic from 'next/dynamic';
import { Button } from '../../components/ui/button';

function AuthSkeleton() {
  return (
    <div className="h-10 w-24 animate-pulse rounded-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200">
      <div className="h-full w-full rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
    </div>
  );
}

const UserProfileMenu = dynamic(() => import('../nav/user-profile-menu'), {
  ssr: false,
  loading: () => <AuthSkeleton />,
});

export default function AuthButton() {
  const { isSignedIn, user, isLoaded } = useUser();
  const { openSignIn } = useClerk();

  if (!isLoaded) {
    return <AuthSkeleton />;
  }

  // Signed-in: never fall through to the Login button (user may lag one frame).
  if (isSignedIn) {
    if (!user) {
      return <AuthSkeleton />;
    }
    return <UserProfileMenu user={user} />;
  }

  const handleLoginClick = () => {
    requestAnimationFrame(() => {
      openSignIn({
        oauthFlow: 'popup',
        fallbackRedirectUrl: '/',
        signUpFallbackRedirectUrl: '/',
      });
    });
  };

  return (
    <Button
      variant="default"
      className="cursor-pointer bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90"
      onClick={handleLoginClick}
    >
      Login
    </Button>
  );
}
