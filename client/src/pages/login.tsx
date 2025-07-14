import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await apiRequest("POST", "/api/login", { 
        email: email,
        password: "demo" // Demo password for Railway deployment
      });
      
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
      
      // Refresh the page to update authentication state
      window.location.href = "/";
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Failed to log in",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to QR Pro</CardTitle>
          <CardDescription>
            Enter your email address to access your QR code dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">
                Demo: Use any email address to log in
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Access Dashboard"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              New to QR Pro? You'll automatically get a free account with 1 QR code.
              Upgrade to Pro for unlimited QR codes and customization features.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}