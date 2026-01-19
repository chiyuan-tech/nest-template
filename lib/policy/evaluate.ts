/**
 * Policy evaluation engine
 * Determines whether generation is allowed, button states, etc. based on user status and form parameters
 */

import { PolicyInput, PolicyDecision, VoucherConstraints } from './types';
import { getProductPolicy } from './products';

/**
 * Check if user is in voucher-eligible state
 */
function isVoucherEligible(user: PolicyInput['user']): boolean {
  return user.level <= 0 && user.free_times > 0;
}

/**
 * Check if form parameters meet voucher constraints
 * Generic check for any field in constraints (supports string[], number[], boolean[])
 */
function checkVoucherConstraints(
  form: PolicyInput['form'],
  constraints: VoucherConstraints
): boolean {
  // Iterate through all constraint fields
  for (const [fieldName, allowedValues] of Object.entries(constraints)) {
    // Skip if no allowed values defined
    if (!allowedValues || allowedValues.length === 0) {
      continue;
    }

    const formValue = form[fieldName];
    
    // For optional fields, skip if form value is undefined
    // (This allows constraints to be defined without requiring the field to exist in form)
    if (formValue === undefined) {
      continue;
    }

    // Check based on the type of allowed values
    const firstValue = allowedValues[0];
    
    // Skip if first value is null or undefined (invalid constraint)
    if (firstValue === null || firstValue === undefined) {
      continue;
    }
    
    if (typeof firstValue === 'string') {
      // String array constraint (e.g., resolution, aspectRatio, mode)
      if (!(allowedValues as string[]).includes(String(formValue))) {
        return false;
      }
    } else if (typeof firstValue === 'number') {
      // Number array constraint (e.g., duration)
      if (!(allowedValues as number[]).includes(Number(formValue))) {
        return false;
      }
    } else if (typeof firstValue === 'boolean') {
      // Boolean array constraint (e.g., audio, camerafixed)
      if (!(allowedValues as boolean[]).includes(Boolean(formValue))) {
        return false;
      }
    } else {
      // Unknown type, skip this constraint (should not happen with proper typing)
      continue;
    }
  }

  return true;
}

/**
 * Evaluate policy and return decision
 */
export function evaluatePolicy(input: PolicyInput): PolicyDecision {
  const { productId, user, form } = input;
  const policy = getProductPolicy(productId);

  // Default decision
  const decision: PolicyDecision = {
    voucherEligible: false,
    voucherRestricted: false,
    allowed: false,
    primaryAction: 'signin',
    buttonText: 'GENERATE',
    costBadge: 0,
    requiredCredits: 0,
    disabledFields: {},
  };

  // 1. Check if signed in
  if (!user.isSignedIn) {
    decision.primaryAction = 'signin';
    decision.buttonText = 'GENERATE';
    decision.denyReason = 'not_signed_in';
    return decision;
  }

  // 2. Check if in voucher-eligible state
  const voucherEligible = isVoucherEligible(user);
  decision.voucherEligible = voucherEligible;

  // 3. If voucher-eligible, check if meets voucher constraints
  if (voucherEligible && policy?.voucherConstraints) {
    const meetsConstraints = checkVoucherConstraints(form, policy.voucherConstraints);
    
    if (!meetsConstraints) {
      // Doesn't meet voucher constraints
      // But user might have credits to use instead
      decision.voucherRestricted = true;
      
      // Check if user can use credits instead
      if (policy?.creditPricing) {
        const requiredCredits = policy.creditPricing(form);
        decision.requiredCredits = requiredCredits;
        decision.costBadge = requiredCredits;
        
        if (user.total_credits >= requiredCredits) {
          // User has enough credits, allow using credits
          decision.allowed = true;
          decision.primaryAction = 'generate';
          decision.buttonText = 'GENERATE';
          decision.message = 'Free vouchers only support 480p / 5s. Using credits instead.';
          return decision;
        } else {
          // Not enough credits, need to upgrade
          decision.allowed = false;
          decision.primaryAction = 'upgrade';
          decision.buttonText = 'Upgrade Plan';
          decision.costBadge = '';
          decision.denyReason = 'voucher_restricted';
          decision.message = 'Free vouchers only support 480p / 5s. Upgrade to use more parameters.';
          return decision;
        }
      } else {
        // No credit pricing configured, need to upgrade
        decision.allowed = false;
        decision.primaryAction = 'upgrade';
        decision.buttonText = 'Upgrade Plan';
        decision.costBadge = '';
        decision.denyReason = 'voucher_restricted';
        decision.message = 'Free vouchers only support 480p / 5s. Upgrade to use more parameters.';
        return decision;
      }
    }

    // Meets voucher constraints, can use free voucher
    decision.allowed = true;
    decision.primaryAction = 'generate';
    decision.buttonText = 'GENERATE';
    decision.costBadge = 'free';
    return decision;
  }

  // 4. Not using voucher, check credits
  if (policy?.creditPricing) {
    const requiredCredits = policy.creditPricing(form);
    decision.requiredCredits = requiredCredits;
    decision.costBadge = requiredCredits;

    if (user.total_credits >= requiredCredits) {
      // Sufficient credits
      decision.allowed = true;
      decision.primaryAction = 'generate';
      decision.buttonText = 'GENERATE';
    } else {
      // Insufficient credits
      decision.allowed = false;
      decision.primaryAction = 'buyCredits';
      decision.buttonText = 'GENERATE';
      decision.denyReason = 'insufficient_credits';
      decision.message = `Requires ${requiredCredits} credits, you have ${user.total_credits} credits`;
    }
  } else {
    // No credit pricing configured, allow by default (backward compatibility)
    decision.allowed = true;
    decision.primaryAction = 'generate';
    decision.buttonText = 'GENERATE';
  }

  return decision;
}

