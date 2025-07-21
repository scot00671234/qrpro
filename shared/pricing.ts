// Pricing model configuration - ACCURATE features only
export const PRICING_PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    stripePriceId: null,
    features: {
      qrCodes: '1 QR code',
      styling: 'Basic QR generation', 
      scans: '1 scan/month',
      analytics: false,
      customDomain: false,
      logo: false,
      formats: ['PNG'],
      dynamicQR: false,
      bulkGeneration: false,
      teamMembers: 1,
      support: 'Limited styling'
    },
    limits: {
      monthlyScans: 1,
      qrCodes: 1,
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
      qrCodes: 'Unlimited scans',
      styling: 'Branded QR codes',
      scans: 'Analytics dashboard',
      analytics: 'Multiple formats',
      customDomain: false,
      logo: true,
      formats: ['PNG'],
      dynamicQR: false,
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
      styling: 'Multiple team members',
      scans: 'Bulk QR generation',
      analytics: 'Custom domain',
      customDomain: 'Priority support',
      logo: true,
      formats: ['PNG'],
      dynamicQR: false,
      bulkGeneration: false,
      teamMembers: 10,
      support: 'Priority'
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