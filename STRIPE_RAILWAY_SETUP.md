# Stripe Setup for Railway Deployment

## Quick Setup Instructions

### 1. Get Stripe Test Keys (Recommended for Testing)
1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy your **Publishable key** (starts with `pk_test_...`)
3. Copy your **Secret key** (starts with `sk_test_...`)

### 2. Add Keys to Railway
In your Railway project dashboard:
1. Go to **Variables** tab
2. Add these environment variables:
   ```
   STRIPE_SECRET_KEY=sk_test_your_secret_key_here
   VITE_STRIPE_PUBLIC_KEY=pk_test_your_publishable_key_here
   ```

### 3. Automatic Product Creation ✅
The system will automatically create:
- **QR Pro - Smart Plan**: $9.00/month (25 scans, analytics, cloud storage)
- **QR Pro - Growth Kit**: $29.00/month (unlimited scans, advanced analytics)

### 4. Test Payment
Use test card: `4242 4242 4242 4242`
- Any future expiry date (e.g., 12/25)
- Any 3-digit CVC (e.g., 123)

### 5. Go Live (Optional)
When ready for real payments:
1. Get live keys from https://dashboard.stripe.com/apikeys
2. Replace with live keys:
   ```
   STRIPE_SECRET_KEY=sk_live_your_live_secret_key
   VITE_STRIPE_PUBLIC_KEY=pk_live_your_live_publishable_key
   ```

## What Happens Automatically ✅

1. **First Subscription Attempt**: System creates products and prices in your Stripe account
2. **Subsequent Attempts**: System uses existing products/prices
3. **Error Handling**: Graceful fallback if Stripe is temporarily unavailable
4. **Logging**: Clear logs show product/price creation status

## Subscription Features Working ✅

- ✅ $9/month Pro Plan with 25 monthly scans
- ✅ $29/month Business Plan with unlimited scans  
- ✅ Free plan with 3 QR codes and 1 scan/month
- ✅ Automatic subscription management
- ✅ Plan upgrade/downgrade support
- ✅ Webhook handling for subscription changes
- ✅ Test card support for development

## Railway Deployment Ready ✅

Once you add the Stripe keys to Railway:
1. Railway will automatically restart your application
2. Stripe will be initialized in TEST mode
3. Users can immediately subscribe to Pro ($9) or Business ($29) plans
4. All subscription features will work perfectly

No additional configuration needed!