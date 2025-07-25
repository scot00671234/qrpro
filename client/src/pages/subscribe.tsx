import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Crown, Check, Building2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/navigation";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Subscribe() {
  const { user, isAuthenticated } = useAuth();
  const [selectedPlan] = useState<'pro'>('pro'); // Only one plan available
  const [subscriptionError, setSubscriptionError] = useState<string>("");
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to access subscription features.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    }
  }, [isAuthenticated, toast]);

  const handleSubscribe = async () => {
    try {
      const response = await apiRequest("POST", "/api/create-subscription", {
        plan: selectedPlan
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create subscription");
      }

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No session URL returned");
      }
    } catch (error: any) {
      console.error("Subscription error:", error);
      setSubscriptionError(error.message);
      
      if (isUnauthorizedError(error)) {
        toast({
          title: "Session Expired",
          description: "Please log in again to continue.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
      }
    }
  };

  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  // Show different content if user is already subscribed
  if (user && (user as any).subscriptionStatus === 'active') {
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
                You have access to unlimited QR code generation and all professional features.
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
          <h1 className="text-3xl font-bold text-gray-900">Upgrade to QR Pro</h1>
          <p className="mt-2 text-gray-600">Unlock unlimited QR code generation and professional features</p>
        </div>

        {/* Plan Selection */}
        <div className="max-w-lg mx-auto mb-12">
          {/* QR Pro Plan */}
          <Card className="border-2 border-primary bg-primary/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Crown className="mr-2 h-5 w-5" />
                  QR Pro
                </CardTitle>
                <Badge className="bg-primary text-white">Only Plan</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                $19<span className="text-lg text-gray-500">/month</span>
              </div>
              
              <ul className="space-y-4">
                <li className="flex items-center">
                  <Check className="text-green-500 mr-3 h-5 w-5" />
                  Unlimited QR code generation
                </li>
                <li className="flex items-center">
                  <Check className="text-green-500 mr-3 h-5 w-5" />
                  Cloud storage & organization
                </li>
                <li className="flex items-center">
                  <Check className="text-green-500 mr-3 h-5 w-5" />
                  Professional QR code management
                </li>
                <li className="flex items-center">
                  <Check className="text-green-500 mr-3 h-5 w-5" />
                  Priority support
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Payment Form */}
        <Card className="max-w-lg mx-auto">
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
                  disabled={!selectedPlan}
                >
                  Subscribe to QR Pro - $19/month
                </Button>
                <p className="mt-4 text-sm text-gray-600">
                  Click to continue with secure Stripe checkout
                </p>
                
                <Alert className="mt-6 text-left">
                  <Crown className="h-4 w-4" />
                  <AlertDescription>
                    Cancel anytime. No long-term commitment required.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}