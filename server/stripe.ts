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
  stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: '2025-06-30.basil',
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

// Create or get price IDs dynamically
export async function getOrCreatePrice(plan: 'pro'): Promise<string> {
  if (!stripe) {
    throw new Error('Stripe not configured');
  }

  // Define pricing for each plan
  const planConfig = {
    pro: {
      amount: 1900, // $19.00 in cents
      name: 'QR Pro',
      description: 'Unlimited QR code generation, cloud storage, professional features'
    }
  };

  const config = planConfig[plan];
  
  try {
    // First, try to find existing product by metadata to avoid name matching issues
    const allProducts = await stripe.products.list({ limit: 100 });
    let existingProduct = allProducts.data.find((product: any) => 
      product.metadata && product.metadata.plan === plan
    );
    
    let productId: string;
    
    if (existingProduct) {
      productId = existingProduct.id;
      console.log(`Found existing product for ${plan}: ${productId}`);
    } else {
      // Create new product with metadata to track it
      const product = await stripe.products.create({
        name: config.name,
        description: config.description,
        metadata: {
          plan: plan,
          app: 'qr-pro'
        }
      });
      productId = product.id;
      console.log(`Created new product for ${plan}: ${productId}`);
    }

    // Find or create price for this product
    const existingPrices = await stripe.prices.list({
      product: productId,
      active: true,
    });

    const existingPrice = existingPrices.data.find(
      (price: any) => price.unit_amount === config.amount && price.currency === 'usd' && price.recurring?.interval === 'month'
    );

    if (existingPrice) {
      console.log(`Found existing price for ${plan}: ${existingPrice.id}`);
      return existingPrice.id;
    } else {
      // Create new price
      const price = await stripe.prices.create({
        product: productId,
        unit_amount: config.amount,
        currency: 'usd',
        recurring: {
          interval: 'month',
        },
      });
      console.log(`Created new price for ${plan}: ${price.id}`);
      return price.id;
    }
  } catch (error) {
    console.error(`Error creating/getting price for ${plan}:`, error);
    throw error;
  }
}

// Backward compatibility - get price ID (now async)
export async function getPriceId(plan: 'pro'): Promise<string> {
  if (!STRIPE_SECRET_KEY) {
    throw new Error('Stripe not configured');
  }
  
  return await getOrCreatePrice(plan);
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