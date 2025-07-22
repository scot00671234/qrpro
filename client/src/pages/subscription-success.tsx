import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Crown, ArrowRight, Loader2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Navigation } from "@/components/navigation";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function SubscriptionSuccess() {
  const [isProcessing, setIsProcessing] = useState(true);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const processSubscription = async () => {
      try {
        // Extract session_id from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session_id');
        
        if (!sessionId) {
          console.error('No session_id found in URL');
          setIsProcessing(false);
          return;
        }

        console.log('Processing subscription with session ID:', sessionId);

        // Call backend to process the subscription
        const response = await fetch('/api/subscription-success', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ session_id: sessionId }),
        });

        if (response.ok) {
          setIsSuccessful(true);
          toast({
            title: "Subscription Activated!",
            description: "Your Pro plan is now active. Welcome to QR Pro!",
          });
        } else {
          console.error('Subscription processing failed:', response);
          toast({
            title: "Processing Error",
            description: "There was an issue processing your subscription. Please contact support.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error processing subscription:', error);
        toast({
          title: "Error",
          description: "Failed to activate subscription. Please contact support.",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    };

    processSubscription();
  }, [toast]);

  // Show loading state while processing
  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="glass-effect warm-shadow border-0 rounded-2xl overflow-hidden">
              <CardContent className="p-12 text-center">
                <Loader2 className="w-12 h-12 animate-spin mx-auto mb-6 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Processing Your Subscription
                </h2>
                <p className="text-muted-foreground">
                  Please wait while we activate your Pro plan...
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if processing failed
  if (!isSuccessful) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="glass-effect warm-shadow border-0 rounded-2xl overflow-hidden">
              <CardContent className="p-12 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Subscription Processing Failed
                </h2>
                <p className="text-muted-foreground mb-6">
                  There was an issue activating your subscription. Please contact support for assistance.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/contact">
                    <Button>Contact Support</Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button variant="outline">Go to Dashboard</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Congratulations Card */}
          <Card className="glass-effect warm-shadow border-0 rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-primary/10 to-accent/10 pb-8">
              <CardTitle className="text-3xl font-light text-foreground tracking-tight mb-4">
                Congratulations! 🎉
              </CardTitle>
              <p className="text-lg text-muted-foreground">
                You've successfully upgraded to QR Pro
              </p>
            </CardHeader>
            
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center justify-center mb-6">
                <div className="flex items-center space-x-2 bg-gradient-to-r from-primary/20 to-accent/20 px-4 py-2 rounded-full">
                  <Crown className="w-5 h-5 text-primary" />
                  <span className="font-medium text-primary">Pro Plan Active</span>
                </div>
              </div>

              <div className="space-y-4 text-left">
                <h3 className="text-xl font-semibold text-foreground">What's included in your Pro plan:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Unlimited QR code generation</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Cloud storage & organization</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Professional QR code management</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Priority support</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 border-t">
                <p className="text-sm text-muted-foreground mb-6">
                  Your subscription is now active and will be billed monthly at $19.00/month. 
                  You can manage your subscription anytime in your account settings.
                </p>
                
                <Link href="/dashboard">
                  <Button className="w-full" size="lg">
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              Need help getting started? Check out our{" "}
              <Link href="/features" className="text-primary hover:underline">
                features guide
              </Link>{" "}
              or{" "}
              <Link href="/contact" className="text-primary hover:underline">
                contact support
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}