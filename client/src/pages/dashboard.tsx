import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Navigation } from "@/components/navigation";
import { QrGenerator } from "@/components/qr-generator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { QrCode, User, Calendar, Settings, Crown, Eye, AlertTriangle } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  // Handle subscription success from Stripe checkout
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    
    if (sessionId && isAuthenticated) {
      apiRequest("POST", "/api/subscription-success", { session_id: sessionId })
        .then(() => {
          toast({
            title: "Subscription Successful!",
            description: "Welcome to QR Pro! You now have access to unlimited QR codes.",
          });
          // Clear the session_id from URL
          window.history.replaceState({}, '', '/dashboard');
          // Refresh user data to get updated subscription status
          queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
        })
        .catch((error) => {
          console.error('Error processing subscription success:', error);
          toast({
            title: "Subscription Processing",
            description: "Your payment was successful, but there was an issue activating your subscription. Please contact support.",
            variant: "destructive",
          });
        });
    }
  }, [isAuthenticated, toast, queryClient]);

  const { data: qrCodes = [], isLoading: qrCodesLoading } = useQuery({
    queryKey: ["/api/qr-codes"],
    enabled: isAuthenticated,
    retry: false,
  });

  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Check if user has Pro access (active or canceled but still within billing period)
  const isPro = (user as any)?.subscriptionStatus === 'active' || 
    ((user as any)?.subscriptionStatus === 'canceled' && 
     (user as any)?.subscriptionEndsAt && 
     new Date((user as any).subscriptionEndsAt) > new Date());
  const qrCodeCount = Array.isArray(qrCodes) ? qrCodes.length : 0;
  const monthlyScansUsed = (user as any)?.monthlyScansUsed || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-neutral-100">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Dashboard Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12">
          <div>
            <h1 className="text-5xl font-light text-foreground tracking-tight">Dashboard</h1>
            <p className="mt-4 text-xl text-muted-foreground leading-relaxed">Manage your QR codes and account</p>
          </div>
          <div className="mt-4 lg:mt-0 flex items-center space-x-4">
            <Badge 
              variant={isPro ? "default" : "secondary"}
              className={isPro ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}
            >
              {isPro ? (
                <>
                  <Crown className="w-3 h-3 mr-1" />
                  Pro Plan
                </>
              ) : (
                "Free Plan"
              )}
            </Badge>
            <Link href="/settings">
              <Button variant="ghost" size="sm">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Upgrade Banner (Free Users) */}
        {(user as any)?.subscriptionStatus !== 'active' && (
          <Alert className="mb-8 border-primary bg-gradient-to-r from-primary/10 to-primary/5">
            <Crown className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <div>
                <strong>Upgrade to Pro</strong> - Unlock unlimited QR codes, analytics, and advanced features
              </div>
              <Link href="/subscribe">
                <Button size="sm" className="ml-4">
                  Choose Plan
                </Button>
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="glass-effect warm-shadow border-0 rounded-2xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-lg">QR Codes Created</p>
                  <p className="text-3xl font-light text-foreground tracking-tight">
                    {qrCodeCount} {!isPro ? "/ 1" : ""}
                  </p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
                  <QrCode className="text-primary h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
          

          
          <Card className="glass-effect warm-shadow border-0 rounded-2xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-lg">Plan Status</p>
                  <p className="text-3xl font-light text-foreground tracking-tight">
                    {isPro ? "Pro" : "Free"}
                  </p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
                  <User className="text-primary h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* QR Code Generator */}
        <QrGenerator 
          isPro={isPro} 
          qrCodeCount={qrCodeCount}
          onQrCodeCreated={() => {
            queryClient.invalidateQueries({ queryKey: ["/api/qr-codes"] });
          }}
        />
      </div>
    </div>
  );
}
