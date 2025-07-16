import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import QRCode from "qrcode";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { insertQrCodeSchema, updateQrCodeSchema } from "@shared/schema";
import { sendEmail } from "./emailService";
import { randomBytes } from "crypto";
import { runMigrations } from "./migrate";

// Only initialize Stripe if the key is available (for Railway deployment)
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Run database migrations first
  await runMigrations();
  
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });



  // QR Code routes
  app.post('/api/qr-codes', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check subscription limits
      const qrCodeCount = await storage.getUserQrCodeCount(user.id);
      if (user.subscriptionStatus === 'free' && qrCodeCount >= 1) {
        return res.status(403).json({ 
          message: "Free plan limited to 1 QR code. Upgrade to Pro for unlimited access.",
          requiresUpgrade: true
        });
      }

      const qrCodeData = insertQrCodeSchema.parse({
        ...req.body,
        userId: user.id,
      });

      const qrCode = await storage.createQrCode(qrCodeData);
      res.status(201).json(qrCode);
    } catch (error: any) {
      console.error("Error creating QR code:", error);
      res.status(400).json({ message: error.message || "Failed to create QR code" });
    }
  });

  app.get('/api/qr-codes', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      const qrCodes = await storage.getUserQrCodes(user.id);
      res.json(qrCodes);
    } catch (error) {
      console.error("Error fetching QR codes:", error);
      res.status(500).json({ message: "Failed to fetch QR codes" });
    }
  });

  app.get('/api/qr-codes/:id', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      const id = parseInt(req.params.id);
      const qrCode = await storage.getQrCode(id, user.id);
      
      if (!qrCode) {
        return res.status(404).json({ message: "QR code not found" });
      }

      res.json(qrCode);
    } catch (error) {
      console.error("Error fetching QR code:", error);
      res.status(500).json({ message: "Failed to fetch QR code" });
    }
  });

  app.put('/api/qr-codes/:id', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if user has pro subscription for customization
      if (user.subscriptionStatus === 'free' && req.body.size) {
        return res.status(403).json({ 
          message: "Size customization requires Pro subscription",
          requiresUpgrade: true
        });
      }

      const id = parseInt(req.params.id);
      const updates = updateQrCodeSchema.parse(req.body);
      
      const qrCode = await storage.updateQrCode(id, user.id, updates);
      
      if (!qrCode) {
        return res.status(404).json({ message: "QR code not found" });
      }

      res.json(qrCode);
    } catch (error: any) {
      console.error("Error updating QR code:", error);
      res.status(400).json({ message: error.message || "Failed to update QR code" });
    }
  });

  app.delete('/api/qr-codes/:id', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      const id = parseInt(req.params.id);
      
      const success = await storage.deleteQrCode(id, user.id);
      
      if (!success) {
        return res.status(404).json({ message: "QR code not found" });
      }

      res.json({ message: "QR code deleted successfully" });
    } catch (error) {
      console.error("Error deleting QR code:", error);
      res.status(500).json({ message: "Failed to delete QR code" });
    }
  });

  // QR Code generation endpoint
  app.post('/api/qr-codes/:id/generate', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      const id = parseInt(req.params.id);
      
      const qrCode = await storage.getQrCode(id, user.id);
      
      if (!qrCode) {
        return res.status(404).json({ message: "QR code not found" });
      }

      const options = {
        width: qrCode.size || 200,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      };

      const qrDataUrl = await QRCode.toDataURL(qrCode.content, options);
      
      // Increment scan count
      await storage.incrementQrCodeScans(id);
      
      res.json({ dataUrl: qrDataUrl });
    } catch (error) {
      console.error("Error generating QR code:", error);
      res.status(500).json({ message: "Failed to generate QR code" });
    }
  });

  // Stripe subscription routes
  app.post('/api/create-subscription', isAuthenticated, async (req: any, res) => {
    if (!stripe) {
      return res.status(503).json({ message: "Payment system not configured. Please contact support." });
    }

    try {
      const user = req.user;

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.stripeSubscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
        
        if (subscription.status === 'active') {
          return res.json({
            subscriptionId: subscription.id,
            status: subscription.status,
            message: "Already subscribed"
          });
        }
      }

      if (!user.email) {
        return res.status(400).json({ message: 'Email required for subscription' });
      }

      let customerId = user.stripeCustomerId;
      
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        });
        customerId = customer.id;
        await storage.updateUserStripeInfo(user.id, customerId);
      }

      // For Railway deployment, we need to create a price ID first or use an existing one
      // Let's create a simple checkout session instead for better Railway compatibility
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'QR Pro Monthly Subscription',
                description: 'Unlimited QR codes with full customization',
              },
              unit_amount: 1500, // $15.00 in cents
              recurring: {
                interval: 'month',
              },
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${req.protocol}://${req.get('host')}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.protocol}://${req.get('host')}/subscribe`,
        metadata: {
          userId: user.id,
        },
      });

      res.json({
        sessionId: session.id,
        url: session.url,
      });
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      res.status(400).json({ message: error.message || "Failed to create subscription" });
    }
  });

  // Handle successful subscription from Stripe checkout
  app.post('/api/subscription-success', isAuthenticated, async (req: any, res) => {
    if (!stripe) {
      return res.status(503).json({ message: "Payment system not configured" });
    }

    try {
      const { session_id } = req.body;
      const user = req.user;

      if (!session_id) {
        return res.status(400).json({ message: "Session ID required" });
      }

      const session = await stripe.checkout.sessions.retrieve(session_id);
      
      if (session.payment_status === 'paid' && session.subscription) {
        await storage.updateUserStripeInfo(user.id, session.customer as string, session.subscription as string);
        await storage.updateUserSubscription(user.id, 'active');
      }

      res.json({ message: "Subscription activated successfully" });
    } catch (error: any) {
      console.error("Error processing subscription success:", error);
      res.status(400).json({ message: error.message || "Failed to process subscription" });
    }
  });

  // Stripe webhook endpoint for automatic subscription updates
  app.post('/api/stripe-webhook', async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ message: "Payment system not configured" });
    }

    try {
      const sig = req.headers['stripe-signature'];
      let event;

      try {
        // For webhook verification, you'd need STRIPE_WEBHOOK_SECRET in production
        // For now, we'll trust the webhook in development/test mode
        event = req.body;
      } catch (err) {
        console.log('Webhook signature verification failed:', err);
        return res.status(400).send(`Webhook Error: ${err}`);
      }

      // Handle the event
      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          const subscription = event.data.object;
          const customerId = subscription.customer;
          
          // Find user by Stripe customer ID
          const users = await storage.getAllUsers(); // We'll need to add this method
          const user = users.find(u => u.stripeCustomerId === customerId);
          
          if (user) {
            await storage.updateUserStripeInfo(user.id, customerId, subscription.id);
            
            // Handle subscription end date safely
            let endsAt: Date | undefined;
            if (subscription.status === 'canceled' && subscription.current_period_end) {
              endsAt = new Date(subscription.current_period_end * 1000);
            }
            
            await storage.updateUserSubscription(user.id, subscription.status, endsAt);
          }
          break;
        
        case 'customer.subscription.deleted':
          const deletedSubscription = event.data.object;
          const deletedCustomerId = deletedSubscription.customer;
          
          const allUsers = await storage.getAllUsers();
          const userToUpdate = allUsers.find(u => u.stripeCustomerId === deletedCustomerId);
          
          if (userToUpdate) {
            await storage.updateUserSubscription(userToUpdate.id, 'canceled');
          }
          break;
        
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error("Error processing webhook:", error);
      res.status(500).json({ message: error.message || "Failed to process webhook" });
    }
  });

  app.post('/api/cancel-subscription', isAuthenticated, async (req: any, res) => {
    if (!stripe) {
      return res.status(503).json({ message: "Payment system not configured. Please contact support." });
    }

    try {
      const user = req.user;

      if (!user || !user.stripeSubscriptionId) {
        return res.status(404).json({ message: "No active subscription found" });
      }

      const subscription = await stripe.subscriptions.update(user.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });

      // Convert Stripe timestamp to Date, with fallback to 30 days from now
      let endsAt: Date;
      if (subscription.current_period_end) {
        endsAt = new Date(subscription.current_period_end * 1000);
      } else {
        // Fallback: 30 days from now
        endsAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      }

      await storage.updateUserSubscription(
        user.id, 
        'canceled', 
        endsAt
      );

      res.json({ message: "Subscription will be canceled at the end of the billing period" });
    } catch (error: any) {
      console.error("Error canceling subscription:", error);
      res.status(500).json({ message: error.message || "Failed to cancel subscription" });
    }
  });

  // Reactivate subscription endpoint
  // Get subscription details from Stripe
  app.get('/api/subscription-details', isAuthenticated, async (req: any, res) => {
    if (!stripe) {
      return res.status(503).json({ message: "Payment system not configured. Please contact support." });
    }

    try {
      const user = req.user;

      if (!user || !user.stripeSubscriptionId) {
        return res.json({ subscription: null });
      }

      const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
      
      res.json({ 
        subscription: {
          id: subscription.id,
          status: subscription.status,
          current_period_end: subscription.current_period_end,
          current_period_start: subscription.current_period_start,
          cancel_at_period_end: subscription.cancel_at_period_end,
          canceled_at: subscription.canceled_at,
          amount: subscription.items.data[0]?.price?.unit_amount || 1500,
          currency: subscription.items.data[0]?.price?.currency || 'usd'
        }
      });
    } catch (error: any) {
      console.error("Error fetching subscription details:", error);
      res.status(500).json({ message: error.message || "Failed to fetch subscription details" });
    }
  });



  app.delete('/api/account', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Cancel subscription immediately if active and Stripe is configured
      if (user.stripeSubscriptionId && stripe) {
        try {
          await stripe.subscriptions.cancel(user.stripeSubscriptionId);
        } catch (stripeError) {
          console.error("Error canceling Stripe subscription:", stripeError);
          // Continue with account deletion even if Stripe cancellation fails
        }
      }

      // Send confirmation email before deletion
      if (user.email) {
        try {
          await sendEmail(
            user.email,
            'Account Deletion Confirmation',
            `Your QR Pro account has been deleted immediately. Any active subscription has been canceled and you will stop being charged after your last billing cycle.`
          );
        } catch (emailError) {
          console.error("Error sending deletion email:", emailError);
          // Continue with deletion even if email fails
        }
      }

      // Hard delete user account immediately (cascades to QR codes)
      await storage.deleteUser(userId);

      // Clear session
      req.session.destroy((err: any) => {
        if (err) {
          console.error("Error destroying session:", err);
        }
      });

      res.json({ message: "Account deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting account:", error);
      res.status(500).json({ message: error.message || "Failed to delete account" });
    }
  });

  // Stripe webhook
  app.post('/api/stripe-webhook', async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ message: "Payment system not configured" });
    }

    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err: any) {
      console.log(`Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'invoice.payment_succeeded':
        const paymentSucceeded = event.data.object as any;
        if (paymentSucceeded.subscription) {
          const subscription = await stripe.subscriptions.retrieve(paymentSucceeded.subscription as string);
          const customer = await stripe.customers.retrieve(subscription.customer as string) as any;
          
          // Update user subscription status to active
          // Note: This would need a method to find user by Stripe customer ID
          console.log('Payment succeeded for customer:', customer.id);
        }
        break;
      case 'invoice.payment_failed':
        // Handle payment failure
        console.log('Payment failed');
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  });

  const httpServer = createServer(app);
  return httpServer;
}
