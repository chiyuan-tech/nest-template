'use client';

import { ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-auto text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Payment Failed
          </h1>
          <p className="text-muted-foreground">
            Sorry, your payment could not be completed successfully.
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Possible Reasons</h2>
          <div className="space-y-2 text-sm text-left">
            <p className="text-muted-foreground">
              The payment may have failed due to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Insufficient card balance</li>
              <li>Network connection issues</li>
              <li>Incorrect payment information</li>
              <li>Bank system maintenance</li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/pricing">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="w-full">
            <Link href="/profile">
              View My Orders
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="w-full">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Need Help?</h3>
          <p className="text-sm text-muted-foreground">
            If you continue to experience payment issues, please contact our support team.
          </p>
          <Button variant="link" className="mt-2">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}
