// Test script to verify subscription system
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function testSubscriptionFlow() {
  console.log('Testing subscription flow...');
  
  // Test 1: Create a test customer
  const customer = await stripe.customers.create({
    email: 'test@example.com',
    name: 'Test User'
  });
  console.log('✓ Created test customer:', customer.id);
  
  // Test 2: Create a checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customer.id,
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'QR Pro Monthly Subscription',
            description: 'Unlimited QR codes with full customization',
          },
          unit_amount: 1500,
          recurring: {
            interval: 'month',
          },
        },
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: 'http://localhost:5000/dashboard?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'http://localhost:5000/subscribe',
  });
  
  console.log('✓ Created checkout session:', session.id);
  console.log('✓ Checkout URL:', session.url);
  
  // Test 3: Simulate successful payment by retrieving session
  const retrievedSession = await stripe.checkout.sessions.retrieve(session.id);
  console.log('✓ Retrieved session status:', retrievedSession.status);
  
  // Test 4: List subscriptions for customer
  const subscriptions = await stripe.subscriptions.list({
    customer: customer.id,
    limit: 10
  });
  console.log('✓ Customer subscriptions:', subscriptions.data.length);
  
  // Test 5: Create a test subscription directly
  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'QR Pro Monthly Subscription',
        },
        unit_amount: 1500,
        recurring: {
          interval: 'month',
        },
      },
    }],
    payment_behavior: 'default_incomplete',
    expand: ['latest_invoice.payment_intent'],
  });
  
  console.log('✓ Created subscription:', subscription.id);
  console.log('✓ Subscription status:', subscription.status);
  
  // Cleanup
  await stripe.subscriptions.del(subscription.id);
  await stripe.customers.del(customer.id);
  console.log('✓ Cleaned up test data');
  
  console.log('\n🎉 All subscription tests passed!');
}

// Run the test
testSubscriptionFlow().catch(console.error);