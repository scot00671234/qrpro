import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MessageCircle, Book, Video, Mail, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

const faqs = [
  {
    category: "Getting Started",
    questions: [
      {
        q: "How do I create my first QR code?",
        a: "After signing up, go to your dashboard and click 'Create QR Code'. Enter your destination URL, customize the design, and download your QR code."
      },
      {
        q: "What's the difference between static and dynamic QR codes?",
        a: "Static QR codes link directly to a URL and can't be changed. Dynamic QR codes redirect through our system, allowing you to update the destination URL anytime."
      },
      {
        q: "How quickly can I get started?",
        a: "You can create your first QR code in under 2 minutes. Simply sign up, verify your email, and start generating QR codes immediately."
      }
    ]
  },
  {
    category: "Plans & Billing",
    questions: [
      {
        q: "Can I upgrade or downgrade my plan?",
        a: "Yes, you can change your plan anytime from your account settings. Upgrades take effect immediately, downgrades at the next billing cycle."
      },
      {
        q: "Do you offer refunds?",
        a: "We don't offer refunds for partial months, but you can cancel anytime to avoid future charges. Your plan remains active until the end of your billing period."
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards (Visa, MasterCard, American Express) and debit cards through our secure Stripe payment processor."
      }
    ]
  },
  {
    category: "QR Code Management",
    questions: [
      {
        q: "Can I edit my QR code after creating it?",
        a: "With dynamic QR codes (Pro and Business plans), you can update the destination URL without changing the QR code image. Static QR codes cannot be edited."
      },
      {
        q: "How do I track QR code scans?",
        a: "Pro and Business plans include detailed analytics showing scan counts, locations, device types, and timing data for all your QR codes."
      },
      {
        q: "Can I customize the appearance of my QR codes?",
        a: "Yes! Pro and Business plans allow you to customize colors, add logos, adjust sizes, and choose different formats (PNG, SVG, PDF)."
      }
    ]
  },
  {
    category: "Technical Issues",
    questions: [
      {
        q: "My QR code isn't scanning properly. What should I do?",
        a: "Ensure the QR code is large enough (minimum 2cm x 2cm), has good contrast, and isn't distorted. Test with multiple QR code scanner apps."
      },
      {
        q: "How do I integrate QR codes with my existing systems?",
        a: "Business plan subscribers have access to our API for programmatic QR code creation and management. Contact support for integration assistance."
      },
      {
        q: "Can I bulk create QR codes?",
        a: "Business plan includes bulk QR code generation features. You can upload a CSV file or use our API to create multiple QR codes at once."
      }
    ]
  }
];

const supportResources = [
  {
    icon: Book,
    title: "Documentation",
    description: "Comprehensive guides and tutorials",
    link: "/blog",
    color: "from-blue-500/20 to-cyan-500/20"
  },
  {
    icon: Video,
    title: "Video Tutorials",
    description: "Step-by-step video guides",
    link: "/blog/qr-code-marketing",
    color: "from-purple-500/20 to-pink-500/20"
  },
  {
    icon: MessageCircle,
    title: "Community Forum",
    description: "Connect with other users",
    link: "/contact",
    color: "from-green-500/20 to-emerald-500/20"
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Direct assistance from our team",
    link: "/contact",
    color: "from-orange-500/20 to-red-500/20"
  }
];

export default function Support() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...faqs.map(section => section.category)];

  const filteredFAQs = faqs.filter(section => {
    if (selectedCategory !== "All" && section.category !== selectedCategory) return false;
    if (!searchQuery) return true;
    
    return section.questions.some(q => 
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="py-16 bg-gradient-to-b from-stone-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-light text-foreground tracking-tight mb-6">
              Help & <span className="text-primary font-medium">Support</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Find answers to common questions, learn from our guides, or get in touch with our support team.
            </p>
          </div>

          {/* Search and Categories */}
          <div className="mb-12">
            <div className="relative max-w-2xl mx-auto mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-lg rounded-full"
              />
            </div>
            
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Support Resources */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {supportResources.map((resource) => (
              <Link key={resource.title} href={resource.link}>
                <Card className="glass-effect warm-shadow border-0 rounded-2xl hover:shadow-lg transition-all cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-br ${resource.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      <resource.icon className="w-8 h-8 text-foreground" />
                    </div>
                    <h3 className="font-medium text-foreground mb-2">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* FAQ Sections */}
          <div className="space-y-8">
            {filteredFAQs.map((section) => (
              <Card key={section.category} className="glass-effect warm-shadow border-0 rounded-2xl overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-stone-50 to-amber-50/30">
                  <h2 className="text-2xl font-light text-foreground tracking-tight">{section.category}</h2>
                </div>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {section.questions
                      .filter(q => 
                        !searchQuery || 
                        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        q.a.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((qa, index) => (
                      <details key={index} className="group">
                        <summary className="p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-foreground pr-8">{qa.q}</h3>
                            <ArrowRight className="w-5 h-5 text-muted-foreground group-open:rotate-90 transition-transform" />
                          </div>
                        </summary>
                        <div className="px-6 pb-6">
                          <p className="text-muted-foreground leading-relaxed">{qa.a}</p>
                        </div>
                      </details>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Support CTA */}
          <div className="mt-16 text-center">
            <Card className="glass-effect warm-shadow border-0 rounded-2xl p-8 bg-gradient-to-r from-primary/5 to-accent/5">
              <h3 className="text-2xl font-light text-foreground mb-4 tracking-tight">
                Still need help?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Can't find what you're looking for? Our support team is here to help you succeed with QR Pro.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg" className="rounded-full">
                    <Mail className="w-5 h-5 mr-2" />
                    Contact Support
                  </Button>
                </Link>
                <Badge variant="secondary" className="px-4 py-2">
                  Average response time: 4 hours
                </Badge>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}