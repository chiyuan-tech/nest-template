'use client';

import { Button } from './ui/button';
import { Check, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { cn } from '@/lib/utils';

// 定义接口地址
const STRIPE_API_ENDPOINT = 'https://cartoon.framepola.com/api/stripe/subscription/create';

// 定义 Plan 结构
interface PricingPlan {
  key: string;
  priceId: string;
  popular: boolean;
  title: string;
  price: string;
  features: string[];
  buttonText: string;
}

export default function PricingSection() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const { user, isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  // 定义固定的价格计划数据
  const pricingPlans: PricingPlan[] = [
    {
      key: 'free',
      priceId: '', // Free 计划不可购买，Price ID 为空
      popular: false,
      title: 'Free',
      price: '$0',
      buttonText: 'Try for Free',
      features: [
        'Generate 2 images total',
        'Standard generation speed',
        'Download enabled'
      ]
    },
    {
      key: 'premium',
      priceId: 'price_1RHh3OP6KzD2PGCtXNVWN1lm', 
      popular: true,
      title: 'Premium',
      price: '$1',
      buttonText: 'Upgrade Plan',
      features: [
        'Generate 5 images total',
        'HD image download',
        'Faster AI generation',
        'Commercial use',
        'Remove watermark'
      ]
    },
    {
      key: 'ultimate',
      priceId: 'price_1RHMGnP6KzD2PGCtEbKByaGm', 
      popular: false,
      title: 'Ultimate',
      price: '$10',
      buttonText: 'Upgrade Plan',
      features: [
        'Generate 500 images per month',
        'Everything in Premium',
        'Priority support',
        'Early access to new features'
      ]
    }
  ];

  // 处理点击升级按钮的异步函数
  const handleUpgradeClick = async (priceId: string, planKey: string) => {
    // 1. 检查用户是否登录
    if (!isSignedIn) {
      // 如果未登录，打开 Clerk 登录框
      openSignIn();
      return; // 阻止后续操作
    }

    // 2. 获取用户 ID (确保用户存在且有 ID)
    const userId = user?.id;
    if (!userId) {
      console.error("User is signed in but user ID is missing.");
      // 可以选择提示用户或记录错误
      alert('Could not get user information. Please try refreshing the page.');
      return;
    }

    setLoadingPlan(planKey); // 设置当前加载的计划
    try {
      // 3. 使用真实的用户 ID 调用 API
      const response = await fetch(STRIPE_API_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({
          google_id: userId, // 使用 Clerk user.id 作为 google_id 发送给后端
          price_id: priceId,
          website: "ai_polaroid" //站点标识,默认现在站点ai_polaroid，其他站点的以后增加
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An error occurred. Please try again later.' })); 
        console.error('Stripe subscription creation failed:', response.status, errorData);
        alert(errorData.message || 'An error occurred. Please try again later.');
        setLoadingPlan(null); 
        return; 
      }

      const data = await response.json();

      // 检查返回的数据结构是否符合预期
      const checkoutUrl = data?.data?.url || data?.url;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        console.error('Stripe subscription response missing URL:', data);
        alert('Checkout URL is missing. Please try again later.');
        setLoadingPlan(null);
      }

    } catch (error) {
      console.error('Error during subscription creation request:', error);
      alert('Network error. Please check your connection and try again.');
      setLoadingPlan(null);
    } 
  };

  return (
    <section id="pricing" className="py-20 px-6 bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold font-fredoka text-center mb-6 text-foreground">
          Choose Your Perfect Plan
        </h2>
        <p className="text-lg text-muted-foreground text-center mb-16 max-w-3xl mx-auto">
          All plans include HD image download and fast AI generation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan) => {
              const isFree = plan.key === 'free';

              return (
                <div
                  key={plan.key}
                  className={cn(
                    'rounded-2xl p-8 flex flex-col h-full relative shadow-xl',
                    plan.popular ? 'bg-gray-900 text-gray-100 border-2 border-secondary' 
                    : 'bg-gray-800 text-gray-200'
                  )}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-secondary text-secondary-foreground px-4 py-1 rounded-full text-sm font-bold shadow-md">
                      Most Popular
                    </div>
                  )}

                  <h3 className="text-2xl font-semibold mb-2 text-center text-white">
                    {plan.title}
                  </h3>
      
                  <div className="text-center mb-8">
                    <span className="text-5xl font-bold text-white">
                      {plan.price}
                    </span>
                    {!isFree && (<span className="text-gray-400 text-lg ml-1">/month</span>)}
                  </div>

                  <Button 
                    className={cn(
                      'w-full mb-6',
                      plan.popular
                        ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
                        : isFree
                          ? 'bg-gray-600 text-white hover:bg-gray-500'
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                    )}
                    onClick={() => !isFree && handleUpgradeClick(plan.priceId, plan.key)}
                    disabled={loadingPlan === plan.key}
                  >
                    {loadingPlan === plan.key 
                      ? 'Processing...'
                      : plan.buttonText
                    }
                  </Button>

                  <div className="flex-grow border-t border-gray-700 pt-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <Check className={`w-5 h-5 mr-2 flex-shrink-0 ${plan.popular ? 'text-secondary' : 'text-gray-400'}`} />
                          <span className="text-sm">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
      </div>
    </section>
  );
} 