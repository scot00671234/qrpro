import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/navigation";
import { QrCode, BarChart3, Edit3, Cloud, Check, X, Building2, UtensilsCrossed, Home, Users } from "lucide-react";

export default function Landing() {
  const handleGetStarted = () => {
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: 'url(/hero-bg.png)' }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-indigo-900/20" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Trackable QR Codes for
              <span className="text-primary"> Real Businesses</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-700">
              Create branded, editable QR codes with built-in scan analytics. Perfect for restaurants, real estate agents, creators, and small businesses.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Button 
                onClick={handleGetStarted}
                size="lg"
                className="px-8 py-4 text-lg font-semibold shadow-lg"
              >
                Start Free
              </Button>
              <Button 
                variant="outline"
                onClick={handleGetStarted}
                size="lg"
                className="px-8 py-4 text-lg font-semibold bg-white/90 backdrop-blur-sm border-gray-300 hover:bg-white"
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose QR Pro?</h2>
            <p className="mt-4 text-xl text-gray-600">Simple, powerful, and affordable QR code generation</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <BarChart3 className="text-primary text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Analytics Dashboard</h3>
                <p className="text-gray-600">Track scans with detailed analytics including location, device type, and time data.</p>
              </CardContent>
            </Card>
            
            <Card className="p-8">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-6">
                  <Edit3 className="text-emerald-500 text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Dynamic QR Codes</h3>
                <p className="text-gray-600">Update destination URLs without changing the QR code. Perfect for campaigns.</p>
              </CardContent>
            </Card>
            
            <Card className="p-8">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-6">
                  <QrCode className="text-amber-500 text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Branded QR Codes</h3>
                <p className="text-gray-600">Add logos, customize colors, and create professional QR codes that match your brand.</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Industry Section */}
          <div className="mt-20 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Trusted by businesses across industries</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
              <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
                <UtensilsCrossed className="text-primary w-8 h-8 mb-2" />
                <span className="text-sm font-medium text-gray-700">Restaurants</span>
              </div>
              <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
                <Home className="text-primary w-8 h-8 mb-2" />
                <span className="text-sm font-medium text-gray-700">Real Estate</span>
              </div>
              <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
                <Users className="text-primary w-8 h-8 mb-2" />
                <span className="text-sm font-medium text-gray-700">Creators</span>
              </div>
              <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
                <Building2 className="text-primary w-8 h-8 mb-2" />
                <span className="text-sm font-medium text-gray-700">Small Business</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-xl text-gray-600">Start free, upgrade when you need more</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-8 border-gray-200">
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Free</h3>
                <div className="text-4xl font-bold text-gray-900 mb-6">
                  $0<span className="text-lg text-gray-500">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <Check className="text-green-500 mr-3 h-5 w-5" />
                    1 QR Code
                  </li>
                  <li className="flex items-center">
                    <Check className="text-green-500 mr-3 h-5 w-5" />
                    Basic Generation
                  </li>
                  <li className="flex items-center">
                    <X className="text-gray-400 mr-3 h-5 w-5" />
                    Analytics Dashboard
                  </li>
                  <li className="flex items-center">
                    <X className="text-gray-400 mr-3 h-5 w-5" />
                    Dynamic QR Codes
                  </li>
                  <li className="flex items-center">
                    <X className="text-gray-400 mr-3 h-5 w-5" />
                    Branded Customization
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
            
            <Card className="p-8 border-2 border-primary relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-white">Popular</Badge>
              </div>
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Pro</h3>
                <div className="text-4xl font-bold text-gray-900 mb-6">
                  $15<span className="text-lg text-gray-500">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <Check className="text-green-500 mr-3 h-5 w-5" />
                    Unlimited QR Codes
                  </li>
                  <li className="flex items-center">
                    <Check className="text-green-500 mr-3 h-5 w-5" />
                    Analytics Dashboard
                  </li>
                  <li className="flex items-center">
                    <Check className="text-green-500 mr-3 h-5 w-5" />
                    Dynamic QR Codes
                  </li>
                  <li className="flex items-center">
                    <Check className="text-green-500 mr-3 h-5 w-5" />
                    Branded Customization
                  </li>
                  <li className="flex items-center">
                    <Check className="text-green-500 mr-3 h-5 w-5" />
                    Priority Support
                  </li>
                </ul>
                <Button 
                  onClick={handleGetStarted}
                  className="w-full"
                >
                  Upgrade to Pro
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
