import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import QRCode from "qrcode";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { insertQrCodeSchema, updateQrCodeSchema } from "@shared/schema";
import { sendEmail } from "./emailService";

// Only initialize Stripe if the key is available (for Railway deployment)
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function registerRoutes(app: Express): Promise<Server> {
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
      if (user.subscriptionStatus === 'free' && (req.body.color || req.body.size)) {
        return res.status(403).json({ 
          message: "Customization features require Pro subscription",
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
          dark: qrCode.color || '#000000',
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

      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{
          price_data: {
            currency: 'usd',
            product: 'QR Pro Monthly Subscription',
            unit_amount: 1500, // $15.00 in cents
            recurring: {
              interval: 'month',
            },
          },
        }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      await storage.updateUserStripeInfo(user.id, customerId, subscription.id);

      const invoice = subscription.latest_invoice as any;
      const paymentIntent = invoice.payment_intent as any;

      res.json({
        subscriptionId: subscription.id,
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      res.status(400).json({ message: error.message || "Failed to create subscription" });
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

      await storage.updateUserSubscription(
        user.id, 
        'canceled', 
        new Date((subscription as any).current_period_end * 1000)
      );

      res.json({ message: "Subscription will be canceled at the end of the billing period" });
    } catch (error: any) {
      console.error("Error canceling subscription:", error);
      res.status(500).json({ message: error.message || "Failed to cancel subscription" });
    }
  });

  app.delete('/api/account', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Cancel subscription if active and Stripe is configured
      if (user.stripeSubscriptionId && stripe) {
        await stripe.subscriptions.update(user.stripeSubscriptionId, {
          cancel_at_period_end: true,
        });
      }

      // Soft delete user account by updating subscription status
      await storage.updateUserSubscription(userId, 'deleted');

      // Send confirmation email
      if (user.email) {
        await sendEmail(
          user.email,
          'Account Deletion Confirmation',
          `Your QR Pro account has been scheduled for deletion. Any active subscription will be canceled after the last payment.`
        );
      }

      res.json({ message: "Account deletion scheduled" });
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
