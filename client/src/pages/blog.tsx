import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const blogPosts = [
  {
    slug: "qr-codes-for-restaurants",
    title: "QR Codes for Restaurants: The Complete 2025 Guide",
    excerpt: "Learn how restaurants use QR codes for digital menus, contactless ordering, and customer engagement. Includes real examples and best practices.",
    category: "Restaurant",
    readTime: "8 min read",
    publishDate: "January 20, 2025",
    image: "/blog/restaurant-qr.svg"
  },
  {
    slug: "qr-code-generator-free",
    title: "Best Free QR Code Generator 2025: Create QR Codes Instantly",
    excerpt: "Create professional QR codes for free with advanced customization options. Compare top QR code generators and find the perfect tool for your needs.",
    category: "Tools",
    readTime: "6 min read",
    publishDate: "January 19, 2025",
    image: "/blog/generator-qr.svg"
  },
  {
    slug: "real-estate-qr-codes",
    title: "Real Estate QR Codes: Transform Property Marketing",
    excerpt: "Discover how real estate agents use QR codes for property listings, virtual tours, and lead generation. Boost your property sales today.",
    category: "Real Estate",
    readTime: "6 min read",
    publishDate: "January 18, 2025",
    image: "/blog/real-estate-qr.svg"
  },
  {
    slug: "qr-code-business-cards",
    title: "QR Code Business Cards: The Future of Professional Networking",
    excerpt: "Revolutionize your networking with QR code business cards. Learn how to create digital business cards that make lasting impressions.",
    category: "Networking",
    readTime: "5 min read",
    publishDate: "January 17, 2025",
    image: "/blog/business-cards-qr.svg"
  },
  {
    slug: "custom-qr-codes",
    title: "Custom QR Codes: Brand Your QR Codes for Maximum Impact",
    excerpt: "Create custom QR codes with your brand colors, logo, and design. Complete guide to branded QR codes that increase scan rates by 40%.",
    category: "Branding",
    readTime: "7 min read",
    publishDate: "January 16, 2025",
    image: "/blog/custom-qr.svg"
  },
  {
    slug: "qr-code-marketing",
    title: "QR Code Marketing: 15 Creative Strategies That Work",
    excerpt: "Master QR code marketing with proven strategies. From print ads to social media campaigns, learn what works in 2025.",
    category: "Marketing",
    readTime: "10 min read",
    publishDate: "January 15, 2025",
    image: "/blog/marketing-qr.svg"
  },
  {
    slug: "qr-code-menu-restaurants",
    title: "QR Code Menus: Complete Restaurant Implementation Guide",
    excerpt: "Step-by-step guide to implementing QR code menus in your restaurant. Reduce costs, improve hygiene, and enhance customer experience.",
    category: "Restaurant",
    readTime: "8 min read",
    publishDate: "January 14, 2025",
    image: "/blog/menu-qr.svg"
  },
  {
    slug: "qr-code-wifi-generator",
    title: "WiFi QR Code Generator: Share WiFi Password Instantly",
    excerpt: "Generate WiFi QR codes to share internet access instantly. Learn how businesses use WiFi QR codes to improve customer experience.",
    category: "WiFi",
    readTime: "4 min read",
    publishDate: "January 13, 2025",
    image: "/blog/wifi-qr.svg"
  },
  {
    slug: "dynamic-qr-codes-explained",
    title: "Dynamic vs Static QR Codes: Which Should You Choose?",
    excerpt: "Understand the difference between dynamic and static QR codes. Learn when to use each type and why dynamic QR codes are better for business.",
    category: "Technology",
    readTime: "5 min read",
    publishDate: "January 12, 2025",
    image: "/blog/dynamic-qr.svg"
  },
  {
    slug: "qr-code-inventory-management",
    title: "QR Code Inventory Management: Streamline Your Operations",
    excerpt: "Use QR codes for efficient inventory tracking and management. Reduce errors, save time, and improve accuracy with QR-based inventory systems.",
    category: "Business",
    readTime: "7 min read",
    publishDate: "January 11, 2025",
    image: "/blog/inventory-qr.svg"
  },
  {
    slug: "qr-code-analytics",
    title: "QR Code Analytics: Track Performance Like a Pro",
    excerpt: "Master QR code analytics to optimize your campaigns. Learn which metrics matter and how to improve scan rates and engagement.",
    category: "Analytics",
    readTime: "7 min read",
    publishDate: "January 10, 2025",
    image: "/blog/analytics-qr.svg"
  },
  {
    slug: "qr-code-event-management",
    title: "QR Codes for Events: Complete Event Management Guide",
    excerpt: "Transform your events with QR codes for registration, check-in, networking, and feedback. Streamline event operations and enhance attendee experience.",
    category: "Events",
    readTime: "9 min read",
    publishDate: "January 9, 2025",
    image: "/blog/events-qr.svg"
  },
  {
    slug: "small-business-qr-codes",
    title: "QR Codes for Small Business: 12 Practical Use Cases",
    excerpt: "Practical QR code applications for small businesses. From customer reviews to inventory management, discover cost-effective solutions.",
    category: "Small Business",
    readTime: "9 min read",
    publishDate: "January 8, 2025",
    image: "/blog/small-business-qr.svg"
  },
  {
    slug: "qr-code-payments",
    title: "QR Code Payments: The Future of Contactless Transactions",
    excerpt: "Everything about QR code payments - how they work, security features, and implementation guide for businesses accepting mobile payments.",
    category: "Payments",
    readTime: "6 min read",
    publishDate: "January 7, 2025",
    image: "/blog/payments-qr.svg"
  },
  {
    slug: "qr-code-retail-stores",
    title: "QR Codes in Retail: Boost Sales and Customer Engagement",
    excerpt: "Discover how retail stores use QR codes for product information, promotions, loyalty programs, and seamless shopping experiences.",
    category: "Retail",
    readTime: "8 min read",
    publishDate: "January 6, 2025",
    image: "/blog/retail-qr.svg"
  },
  {
    slug: "qr-code-contact-information",
    title: "vCard QR Codes: Share Contact Information Instantly",
    excerpt: "Create vCard QR codes to share contact information instantly. Perfect for business networking, trade shows, and professional meetings.",
    category: "Contact",
    readTime: "5 min read",
    publishDate: "January 5, 2025",
    image: "/blog/vcard-qr.svg"
  },
  {
    slug: "qr-code-social-media",
    title: "Social Media QR Codes: Grow Your Following Fast",
    excerpt: "Use QR codes to grow your social media following. Link to Instagram, Facebook, TikTok, and LinkedIn profiles with scannable QR codes.",
    category: "Social Media",
    readTime: "6 min read",
    publishDate: "January 4, 2025",
    image: "/blog/social-qr.svg"
  },
  {
    slug: "qr-code-security-best-practices",
    title: "QR Code Security: Protect Against Fraud and Attacks",
    excerpt: "Essential QR code security practices for businesses. Learn about QR code risks, fraud prevention, and how to keep your QR codes secure.",
    category: "Security",
    readTime: "8 min read",
    publishDate: "January 3, 2025",
    image: "/blog/security-qr.svg"
  },
  {
    slug: "qr-code-print-marketing",
    title: "QR Codes in Print Marketing: Bridge Digital and Physical",
    excerpt: "Integrate QR codes into flyers, brochures, posters, and print ads. Measure print campaign performance and drive digital engagement.",
    category: "Print Marketing",
    readTime: "7 min read",
    publishDate: "January 2, 2025",
    image: "/blog/print-qr.svg"
  },
  {
    slug: "qr-code-healthcare",
    title: "QR Codes in Healthcare: Improve Patient Experience",
    excerpt: "Healthcare applications of QR codes - patient check-in, medical records access, appointment scheduling, and contactless healthcare solutions.",
    category: "Healthcare",
    readTime: "9 min read",
    publishDate: "January 1, 2025",
    image: "/blog/healthcare-qr.svg"
  }
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="py-16 bg-gradient-to-b from-stone-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-light text-foreground tracking-tight mb-6">
              QR Code <span className="text-primary font-medium">Insights</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Expert guides, industry insights, and practical tips to maximize your QR code campaigns and grow your business.
            </p>
          </div>

          {/* Featured Post */}
          <div className="mb-16">
            <Card className="overflow-hidden glass-effect warm-shadow border-0 rounded-2xl">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <div className="w-full h-64 md:h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <ArrowRight className="w-8 h-8 text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground font-medium">Restaurant Guide</p>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2 p-8 md:p-12">
                  <Badge className="mb-4">Featured</Badge>
                  <h2 className="text-3xl font-light text-foreground mb-4 tracking-tight">
                    {blogPosts[0].title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {blogPosts[0].excerpt}
                  </p>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {blogPosts[0].publishDate}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {blogPosts[0].readTime}
                    </div>
                  </div>
                  <Link href={`/blog/${blogPosts[0].slug}`}>
                    <div className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium">
                      Read Article <ArrowRight className="w-4 h-4" />
                    </div>
                  </Link>
                </div>
              </div>
            </Card>
          </div>

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post) => (
              <Card key={post.slug} className="overflow-hidden glass-effect warm-shadow border-0 rounded-2xl hover:shadow-lg transition-shadow">
                <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <ArrowRight className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">{post.category}</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <Badge variant="secondary" className="mb-3">{post.category}</Badge>
                  <h3 className="text-xl font-light text-foreground mb-3 tracking-tight line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.publishDate}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </div>
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                      <ArrowRight className="w-4 h-4 text-primary hover:text-primary/80 transition-colors" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}