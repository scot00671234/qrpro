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
    slug: "real-estate-qr-codes",
    title: "Real Estate QR Codes: Transform Property Marketing",
    excerpt: "Discover how real estate agents use QR codes for property listings, virtual tours, and lead generation. Boost your property sales today.",
    category: "Real Estate",
    readTime: "6 min read",
    publishDate: "January 18, 2025",
    image: "/blog/real-estate-qr.svg"
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
    slug: "dynamic-qr-codes-explained",
    title: "Dynamic vs Static QR Codes: Which Should You Choose?",
    excerpt: "Understand the difference between dynamic and static QR codes. Learn when to use each type and why dynamic QR codes are better for business.",
    category: "Technology",
    readTime: "5 min read",
    publishDate: "January 12, 2025",
    image: "/blog/dynamic-qr.svg"
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
    slug: "small-business-qr-codes",
    title: "QR Codes for Small Business: 12 Practical Use Cases",
    excerpt: "Practical QR code applications for small businesses. From customer reviews to inventory management, discover cost-effective solutions.",
    category: "Small Business",
    readTime: "9 min read",
    publishDate: "January 8, 2025",
    image: "/blog/small-business-qr.svg"
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
                  <img 
                    src="/blog/restaurant-qr.jpg" 
                    alt="Restaurant QR code guide"
                    className="w-full h-64 md:h-full object-cover"
                  />
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
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
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