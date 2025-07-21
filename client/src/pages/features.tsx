import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  QrCode, 
  BarChart3, 
  Palette, 
  Download, 
  Zap, 
  Globe, 
  Shield, 
  Smartphone,
  Users,
  RefreshCw,
  Crown,
  Building
} from "lucide-react";
import { Link } from "wouter";

const coreFeatures = [
  {
    icon: QrCode,
    title: "QR Code Generation",
    description: "Create unlimited QR codes for websites, contact info, WiFi, text, and more",
    details: [
      "Support for 15+ QR code types",
      "Instant generation and preview",
      "Batch creation capabilities",
      "Error correction levels"
    ],
    available: "All Plans"
  },

  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Comprehensive scan tracking and performance insights",
    details: [
      "Real-time scan monitoring",
      "Geographic location data",
      "Device and browser breakdown",
      "Time-based performance charts"
    ],
    available: "Pro & Business"
  },
  {
    icon: Palette,
    title: "Custom Branding",
    description: "Brand your QR codes with colors, logos, and custom styles",
    details: [
      "Custom foreground/background colors",
      "Logo integration with smart positioning",
      "Multiple design templates",
      "Brand consistency tools"
    ],
    available: "Pro & Business"
  },
  {
    icon: Download,
    title: "Multiple Formats",
    description: "Download your QR codes in various formats for any use case",
    details: [
      "PNG for web and print",
      "SVG for scalable graphics",
      "PDF for professional documents",
      "High-resolution options up to 4K"
    ],
    available: "Pro & Business"
  },
  {
    icon: Globe,
    title: "Global CDN",
    description: "Fast QR code scanning worldwide with 99.9% uptime",
    details: [
      "Sub-100ms response times globally",
      "Automatic failover protection",
      "SSL encrypted connections",
      "24/7 monitoring and alerts"
    ],
    available: "All Plans"
  }
];

const businessFeatures = [
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together with shared QR code management",
    plan: "Business"
  },
  {
    icon: Building,
    title: "API Access",
    description: "Integrate QR generation into your applications",
    plan: "Business"
  },
  {
    icon: Shield,
    title: "White-label Options",
    description: "Remove QR Pro branding for enterprise use",
    plan: "Business"
  },
  {
    icon: Crown,
    title: "Custom Domain",
    description: "Use your own domain for QR code redirects",
    plan: "Business"
  }
];

const useCases = [
  {
    industry: "Restaurants",
    description: "Digital menus, table ordering, and customer feedback",
    features: ["Menu QR codes", "Table-specific ordering", "Review collection", "Contactless payments"]
  },
  {
    industry: "Real Estate",
    description: "Property listings, virtual tours, and lead generation",
    features: ["Property details", "Virtual tour links", "Contact forms", "Brochure downloads"]
  },
  {
    industry: "Retail",
    description: "Product information, promotions, and customer engagement",
    features: ["Product details", "Discount codes", "Customer reviews", "Social sharing"]
  },
  {
    industry: "Events",
    description: "Registration, networking, and attendee engagement",
    features: ["Event registration", "Digital business cards", "Session feedback", "Social connections"]
  }
];

export default function Features() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="py-16 bg-gradient-to-b from-stone-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-light text-foreground tracking-tight mb-6">
              Powerful <span className="text-primary font-medium">Features</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Everything you need to create, manage, and track QR codes for your business. From basic generation to advanced analytics and team collaboration.
            </p>
          </div>

          {/* Core Features Grid */}
          <div className="mb-20">
            <h2 className="text-3xl font-light text-foreground tracking-tight text-center mb-12">
              Core Features
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coreFeatures.map((feature, index) => (
                <Card key={index} className="glass-effect warm-shadow border-0 rounded-2xl h-full">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mb-4">
                      <feature.icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-light tracking-tight">{feature.title}</CardTitle>
                    <Badge variant="outline" className="w-fit">
                      {feature.available}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Business Features */}
          <div className="mb-20">
            <h2 className="text-3xl font-light text-foreground tracking-tight text-center mb-12">
              Business & Enterprise Features
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {businessFeatures.map((feature, index) => (
                <Card key={index} className="glass-effect warm-shadow border-0 rounded-2xl p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="font-medium text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                    {feature.plan}
                  </Badge>
                </Card>
              ))}
            </div>
          </div>

          {/* Use Cases */}
          <div className="mb-20">
            <h2 className="text-3xl font-light text-foreground tracking-tight text-center mb-12">
              Industry Use Cases
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {useCases.map((useCase, index) => (
                <Card key={index} className="glass-effect warm-shadow border-0 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-xl font-light tracking-tight">{useCase.industry}</CardTitle>
                    <p className="text-muted-foreground">{useCase.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {useCase.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Smartphone className="w-4 h-4 text-primary" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="mb-20">
            <h2 className="text-3xl font-light text-foreground tracking-tight text-center mb-12">
              Technical Specifications
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="glass-effect warm-shadow border-0 rounded-2xl p-6">
                <h3 className="font-medium text-foreground mb-4">Performance</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 99.9% uptime guarantee</li>
                  <li>• Sub-100ms global response times</li>
                  <li>• Global CDN distribution</li>
                  <li>• Automatic scaling</li>
                </ul>
              </Card>
              
              <Card className="glass-effect warm-shadow border-0 rounded-2xl p-6">
                <h3 className="font-medium text-foreground mb-4">Security</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• SSL/TLS encryption</li>
                  <li>• SOC 2 Type II compliance</li>
                  <li>• Regular security audits</li>
                  <li>• Data privacy protection</li>
                </ul>
              </Card>
              
              <Card className="glass-effect warm-shadow border-0 rounded-2xl p-6">
                <h3 className="font-medium text-foreground mb-4">Integration</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• RESTful API</li>
                  <li>• Webhook notifications</li>
                  <li>• Zapier integration</li>
                  <li>• Custom domains</li>
                </ul>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="glass-effect warm-shadow border-0 rounded-2xl p-8 bg-gradient-to-r from-primary/5 to-accent/5">
              <h3 className="text-2xl font-light text-foreground mb-4 tracking-tight">
                Ready to get started?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join thousands of businesses using QR Pro to create, track, and manage their QR code campaigns.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/login">
                  <Button size="lg" className="rounded-full">
                    Start Free Account
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="outline" size="lg" className="rounded-full">
                    View Pricing Plans
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}