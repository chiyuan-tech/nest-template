import { GoogleOneTapAuth } from '../components/auth';
import { Footer } from '../components/Footer';
import dynamic from 'next/dynamic';

// Client island - dynamically imported for code splitting
const PricingSection = dynamic(() => import('../components/PricingSection'), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100/5 rounded-lg" />,
});

// Enable ISR - revalidate every 20 minutes
export const revalidate = 1200;

export default async function Home() {

  return (
    <div className="min-h-screen flex flex-col">
 
      
      {/* Google One Tap Auth - only shown when user is not signed in */}
      <GoogleOneTapAuth
        cancelOnTapOutside={true}
        signInForceRedirectUrl="/"
        signUpForceRedirectUrl="/"
      />
      
      <main className="flex-grow relative">
   
        
 
        <PricingSection />
  
   
      </main>
      
      {/* Server Component: Footer */}
      <Footer />
    </div>
  );
}
