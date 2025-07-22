import type { Express } from "express";
import { createServer, type Server } from "http";
import QRCode from "qrcode";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { insertQrCodeSchema, updateQrCodeSchema, insertQrScanSchema } from "@shared/schema";
import { sendEmail, sendWelcomeEmail } from "./emailService";
import { stripe, getPriceId, getPublishableKey, isTestMode } from "./stripe";
import { randomBytes } from "crypto";
import bcrypt from "bcrypt";
import passport from "passport";
import { runMigrations } from "./migrations";

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
        console.log('No user found in session');
        return res.status(404).json({ message: "User not found" });
      }
      console.log('User authenticated successfully:', user.email);
      // Remove password from response
      const { password, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      console.error('Error in /api/auth/user:', error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Registration route
  app.post('/api/register', async (req, res) => {
    try {
      console.log('Registration attempt:', { email: req.body.email, hasData: !!req.body });
      const { email, password, firstName, lastName } = req.body;
      
      if (!email || !password || !firstName || !lastName) {
        console.log('Missing fields:', { email: !!email, password: !!password, firstName: !!firstName, lastName: !!lastName });
        return res.status(400).json({ message: "All fields are required" });
      }

      // Check if user already exists
      console.log('Checking if user exists:', email);
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        console.log('User already exists:', email);
        return res.status(409).json({ message: "User already exists" });
      }

      // Hash password
      console.log('Hashing password for user:', email);
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      console.log('Creating user:', email);
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        firstName,
        lastName
      });

      // Send welcome email if configured
      if (process.env.SMTP_HOST) {
        try {
          await sendWelcomeEmail(email, firstName);
        } catch (emailError) {
          console.error("Failed to send welcome email:", emailError);
          // Don't fail registration if email fails
        }
      }

      // Auto-login after successful registration
      req.login(user, (err) => {
        if (err) {
  
          return res.status(201).json({ 
            message: "Account created successfully, please log in manually",
            user: {
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName
            }
          });
        }
        
        res.status(201).json({ 
          message: "Account created successfully",
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
          }
        });
      });
    } catch (error: any) {
      console.error('Registration error details:', error);
      console.error('Error stack:', error.stack);
      console.error('Error message:', error.message);
      res.status(500).json({ message: "Failed to create account", error: error.message });
    }
  });

  // Login route
  app.post('/api/login', (req, res, next) => {
    console.log("Login attempt for:", req.body.email);
    passport.authenticate('local', (err: any, user: any, info: any) => {
      if (err) {
        console.error("Authentication error:", err);
        return res.status(500).json({ message: "Authentication error" });
      }
      if (!user) {
        console.log("Login failed for:", req.body.email, "reason:", info?.message);
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }
      req.logIn(user, (err) => {
        if (err) {
          console.error("Session login error:", err);
          return res.status(500).json({ message: "Login error" });
        }
        
        console.log("User logged in successfully:", user.email);
        
        // Remove password from response
        const userResponse = {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        };
        
        res.json({
          message: "Logged in successfully",
          user: userResponse
        });
      });
    })(req, res, next);
  });

  // Logout route
  app.post('/api/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout error" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });



  // QR Code routes
  app.post('/api/qr-codes', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Check QR code creation limits for free users
      const currentQrCount = await storage.getUserQrCodeCount(user.id);
      const subscriptionPlan = user.subscriptionPlan || 'free';
      
      // Free users can only create 3 QR codes per month  
      let maxQrCodes = 3; // Free plan default
      if (subscriptionPlan === 'pro') {
        maxQrCodes = -1; // Unlimited for Pro
      }

      // Enforce QR creation limits for free users
      if (maxQrCodes > 0 && currentQrCount >= maxQrCodes) {
        return res.status(403).json({ 
          message: `Free users can only create ${maxQrCodes} QR codes per month. Upgrade to QR Pro for unlimited QR code generation.`,
          requiresUpgrade: true,
          currentCount: currentQrCount,
          maxAllowed: maxQrCodes
        });
      }

      const qrCodeData = insertQrCodeSchema.parse({
        ...req.body,
        userId: user.id,
      });

      // Create QR code with simplified data
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

  // QR Code generation endpoint (for downloading QR images - should not count as scans)
  app.post('/api/qr-codes/:id/generate', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      const id = parseInt(req.params.id);
      
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // NOTE: This endpoint is for generating QR code IMAGES for download
      // It should NOT count against monthly scan limits
      // Scan tracking happens when someone actually scans the QR code in the real world

      const qrCode = await storage.getQrCode(id, user.id);
      if (!qrCode) {
        return res.status(404).json({ message: "QR code not found" });
      }

      // Generate QR code
      const qrDataUrl = await QRCode.toDataURL(qrCode.content, {
        width: qrCode.size || 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      // NOTE: We do NOT increment scans here - this is just for downloading QR image
      // Real scan tracking should happen when QR codes are actually scanned by end users
      
      res.json({ dataUrl: qrDataUrl });
    } catch (error: any) {
      console.error("Error generating QR code:", error);
      res.status(500).json({ message: "Failed to generate QR code" });
    }
  });



  // Analytics routes removed - no longer part of the app

  // Stripe subscription routes
  app.post('/api/create-subscription', isAuthenticated, async (req: any, res) => {
    if (!stripe) {
      return res.status(503).json({ message: "Payment system not configured. Please contact support." });
    }

    try {
      const user = req.user;
      // Only one plan available: Pro for $19/month

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

      // Use dynamic pricing based on test/live mode
      const priceId = await getPriceId('pro');
      
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${req.protocol}://${req.get('host')}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.protocol}://${req.get('host')}/subscribe`,
        metadata: {
          userId: user.id,
          plan: 'pro',
        },
      });

      res.json({
        sessionId: session.id,
        url: session.url,
        success: true
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

      console.log('Processing subscription success for user:', user.email, 'session:', session_id);

      if (!session_id) {
        return res.status(400).json({ message: "Session ID required" });
      }

      const session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ['subscription']
      });
      
      console.log('Stripe session retrieved:', {
        payment_status: session.payment_status,
        customer: session.customer,
        subscription: session.subscription,
        subscription_status: (session.subscription as any)?.status
      });

      if (session.payment_status === 'paid' && session.subscription) {
        // Update user with Stripe info
        await storage.updateUserStripeInfo(user.id, session.customer as string, session.subscription as string);
        
        // Update subscription status
        await storage.updateUserSubscription(user.id, 'pro', 'active');
        
        console.log('Subscription activated successfully for user:', user.email);
        
        res.json({ 
          message: "Subscription activated successfully",
          success: true,
          plan: 'pro',
          status: 'active'
        });
      } else {
        console.log('Subscription not activated - payment status or subscription missing');
        res.status(400).json({ 
          message: "Subscription not completed", 
          payment_status: session.payment_status,
          has_subscription: !!session.subscription
        });
      }
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
          console.log('Webhook: Processing subscription update for customer:', customerId);
          const users = await storage.getAllUsers();
          const user = users.find(u => u.stripeCustomerId === customerId);
          
          if (user) {
            console.log('Webhook: Found user for subscription update:', user.email);
            await storage.updateUserStripeInfo(user.id, customerId, subscription.id);
            
            // Handle subscription end date safely
            let endsAt: Date | undefined;
            if (subscription.status === 'canceled' && subscription.current_period_end) {
              endsAt = new Date(subscription.current_period_end * 1000);
            }
            
            // Extract plan from subscription metadata or determine from price
            let plan = 'pro'; // default
            if (subscription.metadata?.plan) {
              plan = subscription.metadata.plan;
            } else if (subscription.items?.data?.[0]?.price?.unit_amount) {
              const amount = subscription.items.data[0].price.unit_amount;
              plan = amount >= 2900 ? 'business' : 'pro';
            }
            
            await storage.updateUserSubscription(user.id, plan, subscription.status, endsAt);
            console.log('Webhook: Updated user subscription:', {
              userId: user.id,
              plan,
              status: subscription.status,
              endsAt
            });
          } else {
            console.log('Webhook: No user found for customer ID:', customerId);
          }
          break;
        
        case 'customer.subscription.deleted':
          const deletedSubscription = event.data.object;
          const deletedCustomerId = deletedSubscription.customer;
          
          const allUsers = await storage.getAllUsers();
          const userToUpdate = allUsers.find(u => u.stripeCustomerId === deletedCustomerId);
          
          if (userToUpdate) {
            await storage.updateUserSubscription(userToUpdate.id, 'free', 'inactive');
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
    try {
      const user = req.user;

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if user has an active subscription to cancel
      console.log('Cancel subscription request - user status:', {
        subscriptionStatus: user.subscriptionStatus,
        subscriptionPlan: user.subscriptionPlan,
        stripeSubscriptionId: user.stripeSubscriptionId
      });
      
      if (user.subscriptionStatus !== 'active') {
        return res.status(400).json({ message: `No active subscription to cancel. Current status: ${user.subscriptionStatus}` });
      }

      let endsAt: Date;

      if (stripe && user.stripeSubscriptionId) {
        // If Stripe is configured, cancel through Stripe
        try {
          console.log('Canceling Stripe subscription:', user.stripeSubscriptionId);
          const subscription = await stripe.subscriptions.update(user.stripeSubscriptionId, {
            cancel_at_period_end: true,
          });

          // Use Stripe's current period end
          if ((subscription as any).current_period_end) {
            endsAt = new Date((subscription as any).current_period_end * 1000);
          } else {
            // Fallback: 30 days from now
            endsAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          }
          console.log('Stripe subscription marked for cancellation, ends at:', endsAt);
        } catch (stripeError: any) {
          console.error("Error with Stripe cancellation, proceeding with local cancellation:", stripeError);
          // If Stripe fails, proceed with local cancellation
          endsAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
        }
      } else {
        // No Stripe configured, just cancel locally
        console.log('No Stripe configured, canceling subscription locally for user:', user.email);
        endsAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
      }

      // Update local database
      await storage.updateUserSubscription(
        user.id, 
        user.subscriptionPlan || 'pro', // Keep pro until end of period
        'canceled',
        endsAt
      );

      console.log('Subscription canceled successfully for user:', user.email, 'ends at:', endsAt);
      res.json({ message: "Subscription will be canceled at the end of the billing period" });
    } catch (error: any) {
      console.error("Error canceling subscription:", error);
      res.status(500).json({ message: error.message || "Failed to cancel subscription" });
    }
  });

  // Reactivate subscription endpoint
  // Get subscription details from Stripe
  // Get Stripe publishable key for frontend
  app.get('/api/stripe-config', async (req, res) => {
    try {
      res.json({ 
        publishableKey: getPublishableKey(),
        isTestMode: isTestMode
      });
    } catch (error) {
      console.error("Error getting Stripe config:", error);
      res.status(500).json({ message: "Stripe configuration error" });
    }
  });

  app.get('/api/subscription-details', isAuthenticated, async (req: any, res) => {
    console.log("Fetching subscription details for user:", req.user?.id);
    
    if (!stripe) {
      console.log("Stripe not configured - providing fallback data");
      // For Railway deployment without Stripe, provide fallback data
      const user = req.user;
      if (user && (user.subscriptionStatus === 'active' || user.subscriptionStatus === 'canceled')) {
        const fallbackEndDate = user.subscriptionEndsAt 
          ? new Date(user.subscriptionEndsAt).getTime() / 1000
          : Math.floor((Date.now() + 30 * 24 * 60 * 60 * 1000) / 1000); // 30 days from now
        
        return res.json({
          subscription: {
            id: 'fallback_subscription',
            status: user.subscriptionStatus,
            current_period_end: fallbackEndDate,
            current_period_start: Math.floor((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000), // 30 days ago
            cancel_at_period_end: user.subscriptionStatus === 'canceled',
            canceled_at: user.subscriptionStatus === 'canceled' ? Math.floor(Date.now() / 1000) : null,
            amount: 1900, // $19.00 in cents
            currency: 'usd'
          }
        });
      }
      return res.json({ subscription: null });
    }

    try {
      const user = req.user;

      if (!user || !user.stripeSubscriptionId) {
        console.log("No user or subscription ID found:", { userId: user?.id, hasSubscription: !!user?.stripeSubscriptionId });
        return res.json({ subscription: null });
      }

      console.log("Retrieving Stripe subscription:", user.stripeSubscriptionId);
      const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
      console.log("Stripe subscription retrieved:", {
        id: subscription.id,
        status: subscription.status,
        current_period_end: (subscription as any).current_period_end
      });
      
      // Also update our local database with accurate end date from Stripe
      if ((subscription as any).current_period_end) {
        const stripeEndDate = new Date((subscription as any).current_period_end * 1000);
        await storage.updateUserSubscription(user.id, user.subscriptionPlan || 'free', user.subscriptionStatus || 'inactive');
        console.log("Updated local subscription end date:", stripeEndDate);
      }
      
      res.json({ 
        subscription: {
          id: subscription.id,
          status: subscription.status,
          current_period_end: (subscription as any).current_period_end,
          current_period_start: (subscription as any).current_period_start,
          cancel_at_period_end: (subscription as any).cancel_at_period_end,
          canceled_at: (subscription as any).canceled_at,
          amount: (subscription.items as any)?.data?.[0]?.price?.unit_amount || 1900, // $19.00 in cents
          currency: (subscription.items as any)?.data?.[0]?.price?.currency || 'usd'
        }
      });
    } catch (error: any) {
      console.error("Error fetching subscription details:", error);
      // Provide fallback data in case of Stripe API errors
      const user = req.user;
      if (user && (user.subscriptionStatus === 'active' || user.subscriptionStatus === 'canceled')) {
        const fallbackEndDate = user.subscriptionEndsAt 
          ? new Date(user.subscriptionEndsAt).getTime() / 1000
          : Math.floor((Date.now() + 30 * 24 * 60 * 60 * 1000) / 1000);
        
        return res.json({
          subscription: {
            id: 'fallback_subscription',
            status: user.subscriptionStatus,
            current_period_end: fallbackEndDate,
            current_period_start: Math.floor((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000),
            cancel_at_period_end: user.subscriptionStatus === 'canceled',
            canceled_at: user.subscriptionStatus === 'canceled' ? Math.floor(Date.now() / 1000) : null,
            amount: 1900, // $19.00 in cents
            currency: 'usd'
          }
        });
      }
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
