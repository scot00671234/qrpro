# Stripe Payment Setup Guide

This platform supports **dynamic switching between test and live Stripe payment modes** using environment variables. Simply set the appropriate keys on Railway to switch between modes.

## Environment Variables Required

### For Test Mode (Development/Testing)
```
STRIPE_SECRET_KEY=sk_test_your_test_secret_key_here
STRIPE_PUBLIC_KEY=pk_test_your_test_public_key_here
```

### For Live Mode (Production)
```
STRIPE_SECRET_KEY=sk_live_your_live_secret_key_here
STRIPE_PUBLIC_KEY=pk_live_your_live_public_key_here
```

## How It Works

1. **Test Mode Detection**: When `STRIPE_SECRET_KEY` starts with `sk_test_`, the system automatically:
   - Uses test price IDs for subscriptions
   - Allows test payments (no real charges)
   - Displays "TEST MODE" indicators

2. **Live Mode Detection**: When `STRIPE_SECRET_KEY` starts with `sk_live_`, the system automatically:
   - Uses live price IDs for subscriptions  
   - Processes real payments
   - Handles live customer data

## Railway Deployment

### Setting Environment Variables on Railway:
1. Go to your Railway project dashboard
2. Click on "Variables" tab
3. Add the appropriate keys based on your needs:

**For Testing:**
- `STRIPE_SECRET_KEY` = `sk_test_...` (your Stripe test secret key)
- `STRIPE_PUBLIC_KEY` = `pk_test_...` (your Stripe test publishable key)

**For Production:**
- `STRIPE_SECRET_KEY` = `sk_live_...` (your Stripe live secret key)  
- `STRIPE_PUBLIC_KEY` = `pk_live_...` (your Stripe live publishable key)

### Test Credit Cards (Test Mode Only)
- **Visa**: 4242 4242 4242 4242
- **Visa (Debit)**: 4000 0566 5566 5556
- **Mastercard**: 5555 5555 5555 4444
- **American Express**: 3782 822463 10005
- Use any future expiry date (e.g., 12/34) and any 3-digit CVC

## Price Configuration

The system uses predefined price IDs:
- **Pro Plan ($9/month)**: 25 scans per month
- **Business Plan ($29/month)**: Unlimited scans

To set up your own pricing, create products in your Stripe dashboard and update the price IDs in `server/stripe.ts`.

## Features by Mode

### Test Mode Features
- All payments are simulated
- No real charges occur
- Full subscription flow testing
- Webhook testing supported

### Live Mode Features  
- Real payment processing
- Actual customer billing
- Production webhook handling
- Real subscription management

## Switching Between Modes

To switch from test to live mode (or vice versa):
1. Update the `STRIPE_SECRET_KEY` and `STRIPE_PUBLIC_KEY` environment variables on Railway
2. Redeploy or restart your application
3. The system automatically detects and switches modes

No code changes are needed - the switch is purely configuration-based!