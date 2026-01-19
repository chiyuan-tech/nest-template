'use client';
import { Footer } from '@/components/Footer';
import { siteConfig, contactConfig } from '@/website-config';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-grow py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <article className="prose prose-xl lg:prose-2xl max-w-none dark:prose-invert bg-card p-8 md:p-12 rounded-2xl shadow-custom">
            <h1 className="text-center font-poppins font-bold text-primary text-3xl md:text-4xl mb-4">Refund Policy</h1>
            <p className="text-center text-base text-muted-foreground mb-10">Effective Date: October 14, 2025</p>

            <p className="lead text-lg md:text-xl mb-8 text-foreground">
              Thank you for using the AI services provided by {siteConfig.name}. We hope you're satisfied with our products and services. If you'd like to request a refund, please review the following policy carefully.
            </p>

            <section className="mt-10">
              <h2 className="font-baloo font-semibold text-2xl md:text-3xl text-foreground mb-3">1. Eligibility for Refunds</h2>
              <div className="text-base md:text-lg text-muted-foreground space-y-4">
                <ul className="list-disc list-inside space-y-2">
                  <li>You may request a refund within 7 days of purchase for any unused or partially unused service.</li>
                  <li>If more than 20% of the purchased service credits or resources have been used, the order is not eligible for a full refund.</li>
                  <li>Promotional offers, discounted packages, or special bundle deals may not be refundable. Please refer to the terms shown on the purchase page at the time of purchase.</li>
                </ul>
              </div>
            </section>

            <section className="mt-10">
              <h2 className="font-baloo font-semibold text-2xl md:text-3xl text-foreground mb-3">2. How to Request a Refund</h2>
              <div className="text-base md:text-lg text-muted-foreground space-y-4">
                <p>Send your refund request to our customer support email.</p>
                <p>We recommend using "Refund Request" as your email subject line.</p>
                <p>Please include the following details in your message:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Your full name</li>
                  <li>The email address associated with your account</li>
                  <li>Order number or transaction ID</li>
                  <li>Purchase date</li>
                  <li>Reason for requesting a refund</li>
                </ul>
                <p>Our support team will review your request within 2 business days.</p>
                <p>If approved, the refund will be processed within 5–10 business days. The exact time may vary depending on your payment provider or bank.</p>
              </div>
            </section>

            <section className="mt-10">
              <h2 className="font-baloo font-semibold text-2xl md:text-3xl text-foreground mb-3">3. Non-Refundable Situations</h2>
              <div className="text-base md:text-lg text-muted-foreground space-y-4">
                <p>Refunds will not be granted in the following cases:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>More than 20% of the purchased resources have been used</li>
                  <li>The order was placed more than 7 days ago</li>
                  <li>The product was purchased through promotional offers, discounts, or bundles (unless otherwise stated on the purchase page)</li>
                  <li>The refund request is related to a violation of our Terms of Service or misuse of the platform</li>
                  <li>The same user submits multiple refund requests that are determined to be abnormal or abusive</li>
                </ul>
              </div>
            </section>

            <section className="mt-10">
              <h2 className="font-baloo font-semibold text-2xl md:text-3xl text-foreground mb-3">4. Our Right to Refuse Refunds</h2>
              <div className="text-base md:text-lg text-muted-foreground space-y-4">
                <p>We reserve the right to deny or partially deny refund requests if:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Fraud or abuse is suspected</li>
                  <li>There's a violation of our Terms of Service</li>
                  <li>Multiple refund requests are submitted by the same user</li>
                </ul>
                <p>If your refund request is denied, we'll notify you in writing and explain the reason.</p>
              </div>
            </section>

            <section className="mt-10">
              <h2 className="font-baloo font-semibold text-2xl md:text-3xl text-foreground mb-3">5. Policy Updates</h2>
              <div className="text-base md:text-lg text-muted-foreground space-y-4">
                <p>This refund policy may be updated from time to time. If major changes occur, we'll post a clear notice on our website. Once published, the updated policy will take effect immediately.</p>
              </div>
            </section>

            <section className="mt-10">
              <h2 className="font-baloo font-semibold text-2xl md:text-3xl text-foreground mb-3">6. Contact Us</h2>
              <div className="text-base md:text-lg text-muted-foreground space-y-4">
                <p>If you have any questions about this refund policy or wish to submit a request, please contact us at:</p>
                <div className="text-foreground font-medium">Customer Support Email:</div>
                <a href={`mailto:${contactConfig.supportEmail}`} className="text-primary hover:text-primary/80">{contactConfig.supportEmail}</a>
              </div>
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}


