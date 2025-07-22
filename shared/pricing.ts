// Pricing model configuration - SIMPLE AND HONEST
export const PRICING_PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    stripePriceId: null,
    features: {
      scans: '1 scan/month',
      qrGeneration: 'Basic QR generation'
    },
    limits: {
      monthlyScans: 1,
      qrCodes: -1, // unlimited QR codes, just limited scans
      teamMembers: 1
    }
  },
  pro: {
    id: 'pro',
    name: 'QR Pro',
    price: 19,
    yearlyPrice: 190,
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID || 'price_pro_monthly',
    stripeYearlyPriceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID || 'price_pro_yearly',
    features: {
      scans: 'Unlimited QR code generation',
      analytics: 'Professional QR code management'
    },
    limits: {
      monthlyScans: -1, // unlimited
      qrCodes: -1, // unlimited
      teamMembers: 1
    }
  },
  business: {
    id: 'business',
    name: 'Growth Kit',
    price: 29,
    yearlyPrice: 249,
    stripePriceId: process.env.STRIPE_BUSINESS_PRICE_ID || 'price_business_monthly',
    stripeYearlyPriceId: process.env.STRIPE_BUSINESS_YEARLY_PRICE_ID || 'price_business_yearly',
    features: {
      scans: 'Unlimited scans',
      analytics: 'Analytics dashboard'
    },
    limits: {
      monthlyScans: -1, // unlimited
      qrCodes: -1, // unlimited
      teamMembers: 1
    }
  }
} as const;

export type PricingPlan = keyof typeof PRICING_PLANS;

export function getPlanLimits(plan: PricingPlan) {
  return PRICING_PLANS[plan].limits;
}

export function canUserPerformAction(user: { 
  subscriptionPlan: string;
  monthlyScansUsed: number;
}, action: 'createQR' | 'scan' | 'analytics' | 'bulkGeneration' | 'customDomain') {
  const plan = (user.subscriptionPlan || 'free') as PricingPlan;
  const limits = getPlanLimits(plan);
  
  switch (action) {
    case 'createQR':
      return limits.qrCodes === -1 || true; // For now, allow QR creation but limit scans
    case 'scan':
      return limits.monthlyScans === -1 || user.monthlyScansUsed < limits.monthlyScans;
    case 'analytics':
      return plan !== 'free';
    case 'bulkGeneration':
      return plan === 'business';
    case 'customDomain':
      return plan === 'business';
    default:
      return false;
  }
}