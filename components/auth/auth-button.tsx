'use client';

import { 
  SignInButton,
  UserButton, 
  useUser
} from '@clerk/nextjs';
import { Button } from '../../components/ui/button';
import UserProfileMenu from './user-profile-menu';
import { usePathname } from 'next/navigation';

export default function AuthButton() {
  const { isSignedIn, user } = useUser();
  const pathname = usePathname();

  if (isSignedIn && user) {
    return (
      <UserProfileMenu user={user} />
    );
  }

  return (
    <SignInButton 
      mode="modal"
      forceRedirectUrl={pathname}
    >
      <Button
        variant="default"
        className="bg-primary text-white hover:bg-primary/90 px-6 py-2 rounded-full transition-colors"
      >
        Login
      </Button>
    </SignInButton>
  );
}