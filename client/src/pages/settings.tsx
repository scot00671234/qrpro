import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Crown, AlertTriangle, CreditCard, User } from "lucide-react";
import { Link } from "wouter";

export default function Settings() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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

  const cancelSubscriptionMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/cancel-subscription");
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Subscription will be canceled at the end of the billing period",
      });
      setCancelDialogOpen(false);
      // Refresh page to update user data
      window.location.reload();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to cancel subscription",
        variant: "destructive",
      });
    },
  });



  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/account");
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Account deleted successfully. You will stop being charged after your last billing cycle.",
      });
      setDeleteDialogOpen(false);
      // Redirect to logout immediately
      setTimeout(() => {
        window.location.href = "/api/logout";
      }, 1000);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive",
      });
    },
  });

  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Fetch detailed subscription information from Stripe
  const { data: subscriptionData, isLoading: isLoadingSubscription, error: subscriptionError } = useQuery({
    queryKey: ['subscription-details'],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/subscription-details");
        if (!response.ok) {
          throw new Error(`Failed to fetch subscription details: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error("Subscription details fetch error:", error);
        throw error;
      }
    },
    enabled: !!user && isAuthenticated && ((user as any).subscriptionStatus === 'active' || (user as any).subscriptionStatus === 'canceled') && !!(user as any).stripeSubscriptionId,
    retry: 1,
    staleTime: 30000, // Cache for 30 seconds
  });

  const isActiveSubscription = (user as any).subscriptionStatus === 'active';
  const isCanceled = (user as any).subscriptionStatus === 'canceled';
  
  // Check if user has Pro access (active or canceled but still within billing period)
  const isPro = isActiveSubscription || 
    (isCanceled && 
     (user as any)?.subscriptionEndsAt && 
     new Date((user as any).subscriptionEndsAt) > new Date());
  
  // Use Stripe data for accurate billing information, fallback to local data
  const subscription = subscriptionData?.subscription;
  
  // For active subscriptions, always show next billing date from Stripe, fallback to local data
  // For canceled subscriptions, show when access ends
  let nextPaymentDate = null;
  if (subscription?.current_period_end) {
    nextPaymentDate = new Date(subscription.current_period_end * 1000);
  } else if ((user as any).subscriptionEndsAt) {
    nextPaymentDate = new Date((user as any).subscriptionEndsAt);
  } else if (isPro && !nextPaymentDate) {
    // If user is Pro but we don't have end date info, show fallback
    nextPaymentDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now as fallback
  }
  
  const isScheduledForCancellation = subscription?.cancel_at_period_end || false;
  
  // Determine if subscription is truly active (not canceled and not scheduled for cancellation)
  const isTrulyActiveSubscription = isPro && !isCanceled && !isScheduledForCancellation;
  
  // Debug logging
  console.log("Subscription debug:", {
    isPro,
    isCanceled,
    subscriptionData,
    subscription,
    amount: subscription?.amount,
    hasStripeSubscription: !!(user as any).stripeSubscriptionId,
    subscriptionData,
    subscriptionError,
    isLoadingSubscription,
    nextPaymentDate,
    isTrulyActiveSubscription
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>

        <div className="space-y-8">
          {/* Subscription Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isPro && !isCanceled ? (
                <Alert className="border-amber-200 bg-amber-50">
                  <Crown className="h-4 w-4" />
                  <AlertDescription className="flex items-center justify-between">
                    <div>
                      <strong className="text-amber-800">Free Plan</strong>
                      <p className="text-sm text-amber-600">Limited to 1 QR code and 1 scan per month</p>
                    </div>
                    <Link href="/subscribe">
                      <Button>
                        Upgrade to Pro
                      </Button>
                    </Link>
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-emerald-100 text-emerald-800">
                          <Crown className="w-3 h-3 mr-1" />
                          Pro Plan
                        </Badge>
                        {(isCanceled || isScheduledForCancellation) && (
                          <Badge variant="destructive">
                            {isCanceled ? "Canceled" : "Canceling at Period End"}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">$19.00/month</p>
                    </div>
                    {!isCanceled && !isScheduledForCancellation && (
                      <Button 
                        variant="outline" 
                        onClick={() => setCancelDialogOpen(true)}
                      >
                        Cancel Subscription
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        {isActiveSubscription ? "Next Payment" : "Access Ends"}
                      </Label>
                      <p className="text-gray-900">
                        {isLoadingSubscription && isActiveSubscription && !nextPaymentDate
                          ? "Loading..." 
                          : nextPaymentDate 
                            ? nextPaymentDate.toLocaleDateString() 
                            : isActiveSubscription 
                              ? "Contact support" 
                              : "Not available"}
                      </p>

                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Amount</Label>
                      <p className="text-gray-900">
                        {isLoadingSubscription 
                          ? "Loading..." 
                          : subscription?.amount 
                            ? `$${(subscription.amount / 100).toFixed(2)} ${(subscription.currency || 'USD').toUpperCase()}`
                            : "$19.00 USD"}
                      </p>
                      {/* Debug info - remove after fixing */}
                      <p className="text-xs text-gray-400">
                        Debug: amount={subscription?.amount}, loading={isLoadingSubscription}
                      </p>
                    </div>
                  </div>

                  {(isCanceled || isScheduledForCancellation) && (
                    <div className="space-y-4">
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Your subscription is {isCanceled ? "canceled" : "scheduled for cancellation"} and will end on {nextPaymentDate?.toLocaleDateString()}. 
                          After this date, you can purchase a new subscription to continue using Pro features.
                        </AlertDescription>
                      </Alert>
                      
                      <Link href="/subscribe">
                        <Button className="w-full">
                          Purchase New Subscription
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    value={(user as any).firstName || ""} 
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    value={(user as any).lastName || ""} 
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={(user as any).email || ""} 
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Account information is managed through your authentication provider and cannot be changed here.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Password and security settings are managed through your authentication provider.
                  Use the logout and login process to manage your authentication.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Customer Service */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Service</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Customer Service: clientservicesdigital@gmail.com
              </p>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Delete Account</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Permanently delete your account and all data. This action cannot be undone.
                  Any active subscription will be cancelled after the last payment.
                </p>
                <Button 
                  variant="destructive" 
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cancel Subscription Dialog */}
        <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Subscription</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel your Pro subscription? You'll still have access to Pro features 
                until the end of your current billing period.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
                Keep Subscription
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => cancelSubscriptionMutation.mutate()}
                disabled={cancelSubscriptionMutation.isPending}
              >
                {cancelSubscriptionMutation.isPending ? "Canceling..." : "Cancel Subscription"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Account Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Account</DialogTitle>
              <DialogDescription>
                This will permanently delete your account and all associated data. 
                Any active subscription will be canceled. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => deleteAccountMutation.mutate()}
                disabled={deleteAccountMutation.isPending}
              >
                {deleteAccountMutation.isPending ? "Deleting..." : "Delete Account"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
