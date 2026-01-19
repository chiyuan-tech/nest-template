'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { CheckCircle, CreditCard, Gift, Mail } from 'lucide-react';
import { contactConfig } from '@/website-config';

interface PaymentInfo {
  planKey: string;
  price: string;
  credits: string;
  planTitle: string;
  timestamp: string;
}

export default function PaymentSuccessPage() {
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [orderToken, setOrderToken] = useState<string>('');

  useEffect(() => {
    // 从 URL 参数中获取 token
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      setOrderToken(token);
    }

    // 从本地存储中获取支付信息
    const storedPaymentInfo = localStorage.getItem('paymentInfo');
    if (storedPaymentInfo) {
      try {
        const parsedInfo = JSON.parse(storedPaymentInfo);
        setPaymentInfo(parsedInfo);
        // 清除本地存储的支付信息
        localStorage.removeItem('paymentInfo');
      } catch (error) {
        console.error('Error parsing payment info:', error);
      }
    }
  }, []);

  return (
    <section className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Payment Successful!
          </h1>
          <p className="text-xl text-muted-foreground">
            Thank you for your purchase. Your credits have been added to your account.
          </p>
        </div>

        {/* Payment Details Card */}
        <div className="bg-card rounded-2xl border border-border backdrop-blur-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Payment Details</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column - Payment Info */}
            <div className="space-y-4">
              {paymentInfo && (
                <>
                  <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Plan</div>
                      <div className="text-foreground font-semibold">{paymentInfo.planTitle}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Amount Paid</div>
                      <div className="text-foreground font-semibold text-xl">{paymentInfo.price}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                    <Gift className="w-5 h-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Credits Received</div>
                      <div className="text-foreground font-semibold text-xl">{paymentInfo.credits} Credits</div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Right Column - Order Info */}
            <div className="space-y-4">
              {orderToken && (
                <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Order ID</div>
                    <div className="text-foreground font-mono text-sm break-all">{orderToken}</div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Support Email</div>
                  <div className="text-foreground font-semibold">{contactConfig.supportEmail}</div>
                </div>
              </div>
              
              {paymentInfo && (
                <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                  <CreditCard className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Purchase Date</div>
                    <div className="text-foreground font-semibold">
                      {new Date(paymentInfo.timestamp).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="w-full sm:w-auto px-8 py-3 font-medium transition-colors">
              Start Creating Videos
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="outline" className="w-full sm:w-auto px-8 py-3 font-medium transition-colors">
              View More Plans
            </Button>
          </Link>
        </div>

        {/* Support Info */}
        <div className="text-center mt-8">
          <p className="text-muted-foreground text-sm">
            Need help? Contact us at{' '}
            <a href={`mailto:${contactConfig.supportEmail}`} className="text-primary hover:text-primary/80 underline">
              {contactConfig.supportEmail}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}


