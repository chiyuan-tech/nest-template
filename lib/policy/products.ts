/**
 * Product policy configuration
 * Define voucher constraints and credit pricing rules for each product here
 */

import { ProductPolicy, FormContext } from './types';

/**
 * Credit calculation function for Seedance 1.5 Pro
 * 480P 5s: 30积分，无声:20积分
 * 480P 10s: 60积分，无声:30积分
 * 720P 5s: 70积分，无声:30积分
 * 720P 10s: 140积分，无声:70积分
 * 1080P 5s: 200积分，无声:100积分
 * 1080P 10s: 400积分，无声:200积分
 */
const calculateSeedance15ProCredits = (form: FormContext): number => {
  const is1080p = form.resolution === '1080p';
  const is720p = form.resolution === '720p';
  const is480p = form.resolution === '480p';
  const is10s = form.duration === 10;
  const is5s = form.duration === 5;
  const hasAudio = form.audio !== false; // 默认为 true，只有明确设置为 false 时才无声

  // 1080P
  if (is1080p && is10s) {
    return hasAudio ? 400 : 200;
  }
  if (is1080p && is5s) {
    return hasAudio ? 200 : 100;
  }
  
  // 720P
  if (is720p && is5s) {
    return hasAudio ? 70 : 30;
  }
  if (is720p && is10s) {
    return hasAudio ? 140 : 70;
  }
  
  // 480P
  if (is480p && is5s) {
    return hasAudio ? 30 : 20;
  }
  if (is480p && is10s) {
    return hasAudio ? 60 : 30;
  }
  
  // Default fallback (480p 5s with audio)
  return 30;
};

/**
 * Product policy configuration table
 */
export const productPolicies: Record<string, ProductPolicy> = {
  'seedance-1-5-pro': {
    productId: 'seedance-1-5-pro',
    voucherConstraints: {
      resolution: ['480p'], // Vouchers only support 480p
      duration: [5], // Vouchers only support 5s
      // aspectRatio and mode are not restricted, allow any selection
    },
    creditPricing: calculateSeedance15ProCredits,
  },
};

/**
 * Get product policy
 */
export function getProductPolicy(productId: string): ProductPolicy | null {
  return productPolicies[productId] || null;
}

