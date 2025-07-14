import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/navigation";
import { QrCode, Zap, Palette, Cloud, Check, X } from "lucide-react";

export default function Landing() {
  const handleGetStarted = () => {
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Generate Professional
              <span className="text-primary"> QR Codes</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
              Create, customize, and manage QR codes with ease. Start free, upgrade for unlimited access and advanced features.
            </p>
            <div className="mt-10 flex justify-center">
              <Button 
                onClick={handleGetStarted}
                size="lg"
                className="px-8 py-4 text-lg font-semibold"
              >
                Start Free
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
                  <Zap className="text-primary text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Instant Generation</h3>
                <p className="text-gray-600">Create QR codes instantly with our fast and reliable generator.</p>
              </CardContent>
            </Card>
            
            <Card className="p-8">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-6">
                  <Palette className="text-emerald-500 text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Full Customization</h3>
                <p className="text-gray-600">Customize colors, sizes, and styles to match your brand.</p>
              </CardContent>
            </Card>
            
            <Card className="p-8">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-6">
                  <Cloud className="text-amber-500 text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Cloud Storage</h3>
                <p className="text-gray-600">Save and manage all your QR codes in one secure place.</p>
              </CardContent>
            </Card>
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
                    Customization
                  </li>
                  <li className="flex items-center">
                    <X className="text-gray-400 mr-3 h-5 w-5" />
                    Cloud Storage
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
                    Full Customization
                  </li>
                  <li className="flex items-center">
                    <Check className="text-green-500 mr-3 h-5 w-5" />
                    Cloud Storage
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
