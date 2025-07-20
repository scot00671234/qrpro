// Pricing model configuration
export const PRICING_PLANS = {
  free: {
    id: 'free',
    name: 'Get Started',
    price: 0,
    stripePriceId: null,
    features: {
      qrCodes: 'Basic QR code generation',
      styling: 'Limited styling options',
      scans: 100, // per month
      analytics: false,
      customDomain: false,
      logo: false,
      formats: ['PNG'],
      dynamicQR: false,
      bulkGeneration: false,
      teamMembers: 1,
      support: 'Community'
    },
    limits: {
      monthlyScans: 100,
      qrCodes: 3,
      teamMembers: 1
    }
  },
  pro: {
    id: 'pro',
    name: 'Smart QR',
    price: 9,
    yearlyPrice: 84,
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID || 'price_pro_monthly',
    stripeYearlyPriceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID || 'price_pro_yearly',
    features: {
      qrCodes: 'Unlimited QR codes',
      styling: 'Branded QR codes (logo, color, frames)',
      scans: 'Unlimited',
      analytics: 'Analytics dashboard (scan count, time, location)',
      customDomain: false,
      logo: true,
      formats: ['PNG', 'SVG', 'PDF'],
      dynamicQR: true,
      bulkGeneration: false,
      teamMembers: 1,
      support: 'Email'
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
      qrCodes: 'Everything in Pro',
      styling: 'Full branding & white-label',
      scans: 'Unlimited',
      analytics: 'Advanced analytics & retargeting pixels',
      customDomain: true,
      logo: true,
      formats: ['PNG', 'SVG', 'PDF'],
      dynamicQR: true,
      bulkGeneration: 'CSV upload',
      teamMembers: 'Multiple team members',
      support: 'Priority support'
    },
    limits: {
      monthlyScans: -1, // unlimited
      qrCodes: -1, // unlimited
      teamMembers: 10
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