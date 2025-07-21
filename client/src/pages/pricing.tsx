import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Crown, Building } from "lucide-react";
import { Link } from "wouter";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Basic QR code generation",
    icon: Zap,
    color: "from-gray-500/20 to-slate-500/20",
    textColor: "text-gray-600",
    features: [
      "1 scan/month",
      "Basic QR generation"
    ],
    limitations: [],
    buttonText: "Get Started",
    buttonVariant: "outline" as const,
    popular: false
  },
  {
    name: "Smart QR",
    price: "$9",
    period: "/month",
    description: "For professionals",
    icon: Crown,
    color: "from-primary/20 to-accent/20",
    textColor: "text-primary",
    features: [
      "25 scans/month",
      "Analytics dashboard"
    ],
    limitations: [],
    buttonText: "Choose Pro",
    buttonVariant: "default" as const,
    popular: true
  },
  {
    name: "Growth Kit",
    price: "$29",
    period: "/month",
    description: "For businesses",
    icon: Building,
    color: "from-emerald-500/20 to-teal-500/20",
    textColor: "text-emerald-600",
    features: [
      "Unlimited scans",
      "Analytics dashboard"
    ],
    limitations: [],
    buttonText: "Choose Business",
    buttonVariant: "outline" as const,
    popular: false
  }
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="py-16 bg-gradient-to-b from-stone-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-light text-foreground tracking-tight mb-6">
              Choose Your <span className="text-primary font-medium">Plan</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Start free and upgrade as your business grows. All plans include our core QR code generation features.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <Card key={plan.name} className={`glass-effect warm-shadow border-0 rounded-2xl relative overflow-hidden ${plan.popular ? 'ring-2 ring-primary/20 scale-105' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="pb-8">
                  <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mb-4`}>
                    <plan.icon className={`w-8 h-8 ${plan.textColor}`} />
                  </div>
                  <CardTitle className="text-2xl font-light tracking-tight">{plan.name}</CardTitle>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-light text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  <p className="text-muted-foreground">{plan.description}</p>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features */}
                  <div>
                    <h4 className="font-medium text-foreground mb-3">What's included:</h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Button */}
                  <div className="pt-4">
                    {plan.name === "Free" ? (
                      <Link href="/login">
                        <Button variant={plan.buttonVariant} className="w-full rounded-full">
                          {plan.buttonText}
                        </Button>
                      </Link>
                    ) : plan.name === "Business" ? (
                      <Link href="/contact">
                        <Button variant={plan.buttonVariant} className="w-full rounded-full">
                          {plan.buttonText}
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/subscribe">
                        <Button variant={plan.buttonVariant} className="w-full rounded-full">
                          {plan.buttonText}
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-20">
            <h2 className="text-3xl font-light text-foreground tracking-tight text-center mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="glass-effect warm-shadow border-0 rounded-2xl p-6">
                <h3 className="font-medium text-foreground mb-3">Can I change plans anytime?</h3>
                <p className="text-muted-foreground">Yes, you can upgrade or downgrade your plan at any time. Upgrades take effect immediately, downgrades at your next billing cycle.</p>
              </Card>
              
              <Card className="glass-effect warm-shadow border-0 rounded-2xl p-6">
                <h3 className="font-medium text-foreground mb-3">What happens to my QR codes if I downgrade?</h3>
                <p className="text-muted-foreground">Your existing QR codes remain active. However, you'll be limited to the features available in your new plan going forward.</p>
              </Card>
              
              <Card className="glass-effect warm-shadow border-0 rounded-2xl p-6">
                <h3 className="font-medium text-foreground mb-3">Do you offer refunds?</h3>
                <p className="text-muted-foreground">We don't offer refunds for partial months, but you can cancel anytime to avoid future charges. Your plan remains active until the end of your billing period.</p>
              </Card>
              
              <Card className="glass-effect warm-shadow border-0 rounded-2xl p-6">
                <h3 className="font-medium text-foreground mb-3">Is there a free trial for paid plans?</h3>
                <p className="text-muted-foreground">You can start with our free plan to test basic features. Pro plan includes a 14-day money-back guarantee for new subscribers.</p>
              </Card>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="mt-16 text-center">
            <Card className="glass-effect warm-shadow border-0 rounded-2xl p-8 bg-gradient-to-r from-primary/5 to-accent/5">
              <h3 className="text-2xl font-light text-foreground mb-4 tracking-tight">
                Need a custom solution?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Looking for enterprise features, custom integrations, or special pricing? Our team can help create a plan that fits your specific needs.
              </p>
              <Link href="/contact">
                <Button size="lg" className="rounded-full">
                  Contact Sales Team
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}