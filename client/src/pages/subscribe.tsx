import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, Crown, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

// Only load Stripe if the key is available (for Railway deployment)
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

const SubscribeForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements) {
      setIsLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "Welcome to QR Pro! You now have access to all Pro features.",
      });
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        className="w-full" 
        disabled={!stripe || isLoading}
      >
        {isLoading ? "Processing..." : "Subscribe to Pro - $15/month"}
      </Button>
    </form>
  );
};

export default function Subscribe() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState("");
  const [subscriptionError, setSubscriptionError] = useState("");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const handleSubscribe = async () => {
    try {
      const response = await apiRequest("POST", "/api/create-subscription");
      const data = await response.json();
      
      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else if (data.message === "Already subscribed") {
        toast({
          title: "Already Subscribed",
          description: "You already have an active Pro subscription!",
        });
      } else {
        setSubscriptionError(data.message || "Failed to create subscription");
      }
    } catch (error: any) {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
      } else {
        setSubscriptionError("Failed to create subscription");
      }
    }
  };

  useEffect(() => {
    // Check for successful subscription from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    
    if (sessionId) {
      // Process successful subscription
      apiRequest("POST", "/api/subscription-success", { session_id: sessionId })
        .then(() => {
          toast({
            title: "Subscription Successful",
            description: "Welcome to QR Pro! You now have access to all Pro features.",
          });
          window.location.href = "/dashboard";
        })
        .catch((error) => {
          console.error('Error processing subscription success:', error);
        });
    }
  }, [toast]);

  useEffect(() => {
    if (isAuthenticated && user?.subscriptionStatus === 'active') {
      // User is already subscribed, redirect to dashboard
      window.location.href = "/dashboard";
    }
  }, [isAuthenticated, user]);

  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const isPro = user.subscriptionStatus === 'active';

  if (isPro) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <Card>
            <CardContent className="text-center p-8">
              <Crown className="mx-auto h-12 w-12 text-emerald-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                You're already a Pro member!
              </h2>
              <p className="text-gray-600 mb-6">
                You have access to all Pro features including unlimited QR codes and customization options.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard">
                  <Button>
                    Go to Dashboard
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button variant="outline">
                    Manage Subscription
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Upgrade to Pro</h1>
          <p className="mt-2 text-gray-600">Unlock unlimited QR codes and advanced features</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Plan Details */}
          <div>
            <Card className="border-2 border-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Crown className="mr-2 h-5 w-5" />
                    Pro Plan
                  </CardTitle>
                  <Badge className="bg-primary text-white">Popular</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-gray-900 mb-6">
                  $15<span className="text-lg text-gray-500">/month</span>
                </div>
                
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <Check className="text-green-500 mr-3 h-5 w-5" />
                    Unlimited QR code generation
                  </li>
                  <li className="flex items-center">
                    <Check className="text-green-500 mr-3 h-5 w-5" />
                    Full customization (colors, sizes, styles)
                  </li>
                  <li className="flex items-center">
                    <Check className="text-green-500 mr-3 h-5 w-5" />
                    Cloud storage for all QR codes
                  </li>
                  <li className="flex items-center">
                    <Check className="text-green-500 mr-3 h-5 w-5" />
                    Download in multiple formats
                  </li>
                  <li className="flex items-center">
                    <Check className="text-green-500 mr-3 h-5 w-5" />
                    Scan analytics and tracking
                  </li>
                  <li className="flex items-center">
                    <Check className="text-green-500 mr-3 h-5 w-5" />
                    Priority customer support
                  </li>
                </ul>

                <Alert className="mt-6">
                  <Crown className="h-4 w-4" />
                  <AlertDescription>
                    Cancel anytime. No long-term commitment required.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                {subscriptionError ? (
                  <Alert variant="destructive">
                    <AlertDescription>{subscriptionError}</AlertDescription>
                  </Alert>
                ) : (
                  <div className="text-center py-8">
                    <Button 
                      onClick={handleSubscribe}
                      className="w-full"
                      size="lg"
                    >
                      Subscribe to Pro - $15/month
                    </Button>
                    <p className="mt-4 text-sm text-gray-600">
                      Click to continue with secure Stripe checkout
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Secure payment powered by Stripe</p>
              <p className="mt-1">
                By subscribing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
