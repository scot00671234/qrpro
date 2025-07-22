import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { QrCode, BarChart3, Edit3, Cloud, Check, X, Building2, UtensilsCrossed, Home, Users } from "lucide-react";

export default function Landing() {
  const handleGetStarted = () => {
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Static background */}
        <div className="absolute inset-0">
          {/* Static gradient background instead of video */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-stone-50 to-neutral-100" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-light text-gray-900 leading-tight tracking-tight drop-shadow-sm">
              Trackable QR Codes for
              <span className="text-gradient font-medium"> Real Businesses</span>
            </h1>
            <p className="mt-8 max-w-3xl mx-auto text-xl text-gray-700 leading-relaxed drop-shadow-sm">
              Create custom QR sizes with built-in scan analytics. Perfect for restaurants, real estate agents, creators, and small businesses.
            </p>
            <div className="mt-12 flex justify-center gap-6">
              <Button 
                onClick={handleGetStarted}
                size="lg"
                className="px-10 py-4 text-lg font-medium warm-shadow rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Start Free
              </Button>
              <Button 
                variant="outline"
                onClick={handleGetStarted}
                size="lg"
                className="px-10 py-4 text-lg font-medium rounded-full border-border hover:bg-muted"
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-32 bg-gradient-to-b from-stone-50 to-amber-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-light text-foreground tracking-tight">Why Choose QR Pro?</h2>
            <p className="mt-6 text-xl text-muted-foreground leading-relaxed">Simple, powerful, and beautifully designed</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <Card className="p-10 glass-effect warm-shadow border-0 rounded-2xl">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mb-8">
                  <BarChart3 className="text-primary w-8 h-8" />
                </div>
                <h3 className="text-2xl font-light text-foreground mb-6 tracking-tight">Analytics Dashboard</h3>
                <p className="text-muted-foreground leading-relaxed">Track scans with detailed analytics including location, device type, and time data.</p>
              </CardContent>
            </Card>
            
            <Card className="p-10 glass-effect warm-shadow border-0 rounded-2xl">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-200/40 to-teal-200/40 rounded-2xl flex items-center justify-center mb-8">
                  <Edit3 className="text-emerald-600 w-8 h-8" />
                </div>
                <h3 className="text-2xl font-light text-foreground mb-6 tracking-tight">Simple QR Codes</h3>
                <p className="text-muted-foreground leading-relaxed">Update destination URLs without changing the QR code. Perfect for campaigns.</p>
              </CardContent>
            </Card>
            
            <Card className="p-10 glass-effect warm-shadow border-0 rounded-2xl">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-200/40 to-orange-200/40 rounded-2xl flex items-center justify-center mb-8">
                  <QrCode className="text-amber-600 w-8 h-8" />
                </div>
                <h3 className="text-2xl font-light text-foreground mb-6 tracking-tight">Custom QR Sizes</h3>
                <p className="text-muted-foreground leading-relaxed">Add logos, customize colors, and create professional QR codes that match your brand.</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Industry Section */}
          <div className="mt-24 text-center">
            <h3 className="text-3xl font-light text-foreground mb-12 tracking-tight">Trusted by businesses across industries</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
              <div className="flex flex-col items-center p-8 glass-effect rounded-2xl warm-shadow border-0">
                <UtensilsCrossed className="text-primary w-10 h-10 mb-4" />
                <span className="text-lg font-light text-foreground">Restaurants</span>
              </div>
              <div className="flex flex-col items-center p-8 glass-effect rounded-2xl warm-shadow border-0">
                <Home className="text-primary w-10 h-10 mb-4" />
                <span className="text-lg font-light text-foreground">Real Estate</span>
              </div>
              <div className="flex flex-col items-center p-8 glass-effect rounded-2xl warm-shadow border-0">
                <Users className="text-primary w-10 h-10 mb-4" />
                <span className="text-lg font-light text-foreground">Creators</span>
              </div>
              <div className="flex flex-col items-center p-8 glass-effect rounded-2xl warm-shadow border-0">
                <Building2 className="text-primary w-10 h-10 mb-4" />
                <span className="text-lg font-light text-foreground">Small Business</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-32 bg-gradient-to-b from-amber-50/30 to-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-light text-foreground tracking-tight">Simple, Transparent Pricing</h2>
            <p className="mt-6 text-xl text-muted-foreground leading-relaxed">Start free, upgrade when you need more</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="p-8 border-gray-200">
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Free</h3>
                <div className="text-4xl font-bold text-gray-900 mb-6">
                  $0<span className="text-lg text-gray-500">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <Check className="text-green-500 mr-3 h-5 w-5" />
                    3 QR codes per month
                  </li>
                  <li className="flex items-center">
                    <Check className="text-green-500 mr-3 h-5 w-5" />
                    Basic QR generation
                  </li>
                </ul>
                <Button 
                  onClick={handleGetStarted}
                  variant="outline"
                  className="w-full"
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
            
            {/* Pro Plan */}
            <Card className="p-8 border-2 border-primary relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-white">Popular</Badge>
              </div>
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">QR Pro</h3>
                <div className="text-4xl font-bold text-gray-900 mb-6">
                  $19<span className="text-lg text-gray-500">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
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
                <Button 
                  onClick={handleGetStarted}
                  className="w-full"
                >
                  Choose Pro
                </Button>
              </CardContent>
            </Card>


          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
