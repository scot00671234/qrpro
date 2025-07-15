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
import { QrCode, User, Calendar, Settings, Crown } from "lucide-react";
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

  const isPro = user.subscriptionStatus === 'active';
  const qrCodeCount = qrCodes?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage your QR codes and account</p>
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
        {!isPro && (
          <Alert className="mb-8 border-primary bg-gradient-to-r from-primary/10 to-primary/5">
            <Crown className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <div>
                <strong>Upgrade to Pro</strong> - Unlock unlimited QR codes and advanced customization features
              </div>
              <Link href="/subscribe">
                <Button size="sm" className="ml-4">
                  Upgrade Now
                </Button>
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">QR Codes Created</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {qrCodeCount} {!isPro ? "/ 1" : ""}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <QrCode className="text-primary h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Plan Status</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {isPro ? "Pro" : "Free"}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  isPro ? "bg-emerald-100" : "bg-amber-100"
                }`}>
                  <User className={`h-6 w-6 ${
                    isPro ? "text-emerald-500" : "text-amber-500"
                  }`} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Account Since</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Today"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Calendar className="text-emerald-500 h-6 w-6" />
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
