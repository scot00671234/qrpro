import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Crown, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Navigation } from "@/components/navigation";

export default function SubscriptionSuccess() {
  useEffect(() => {
    // Optional: Add confetti or celebration effect here
  }, []);

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