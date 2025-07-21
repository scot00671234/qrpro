import Stripe from 'stripe';

// Dynamic Stripe configuration based on environment variables
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

// Allow graceful handling when Stripe keys are not configured
let stripe: any = null;
let isTestMode = false;
let isLiveMode = false;

if (STRIPE_SECRET_KEY) {
  // Determine if we're using test keys or live keys
  isTestMode = STRIPE_SECRET_KEY.startsWith('sk_test_');
  isLiveMode = STRIPE_SECRET_KEY.startsWith('sk_live_');
} else {
  console.warn('STRIPE_SECRET_KEY not configured - payment features will be disabled');
}

// Initialize Stripe only if key is available
if (STRIPE_SECRET_KEY) {
  const Stripe = require('stripe');
  stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
  });
}

export { stripe, isTestMode, isLiveMode };

// Get the appropriate publishable key for the frontend
export function getPublishableKey(): string {
  if (!STRIPE_SECRET_KEY) {
    return '';
  }
  
  if (isTestMode || isLiveMode) {
    return process.env.VITE_STRIPE_PUBLIC_KEY || process.env.STRIPE_PUBLIC_KEY || '';
  }
  throw new Error('Invalid Stripe secret key format');
}

// Price IDs for different modes
export const PRICE_IDS = {
  pro: {
    test: 'price_1QQUTdEFeydANsxgMD6BKuSx', // Test mode price ID for $9/month
    live: process.env.STRIPE_LIVE_PRICE_PRO || 'price_live_pro_replace_me' // Live mode price ID for $9/month
  },
  business: {
    test: 'price_1QQUTdEFeydANsxgMD6BKuSy', // Test mode price ID for $29/month  
    live: process.env.STRIPE_LIVE_PRICE_BUSINESS || 'price_live_business_replace_me' // Live mode price ID for $29/month
  }
};

// Get the appropriate price ID based on current mode
export function getPriceId(plan: 'pro' | 'business'): string {
  if (!STRIPE_SECRET_KEY) {
    throw new Error('Stripe not configured');
  }
  
  if (isTestMode) {
    return PRICE_IDS[plan].test;
  } else if (isLiveMode) {
    return PRICE_IDS[plan].live;
  }
  throw new Error('Invalid Stripe configuration');
}

// Log current mode for debugging
if (STRIPE_SECRET_KEY) {
  console.log(`Stripe initialized in ${isTestMode ? 'TEST' : 'LIVE'} mode`);
  if (isTestMode) {
    console.log('Using test mode - payments will not be charged');
  }
} else {
  console.log('Stripe not configured - payment features disabled');
}