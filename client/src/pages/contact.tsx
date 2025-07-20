import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would send the email
    toast({
      title: "Message Sent",
      description: "Thank you for contacting us. We'll get back to you within 24 hours.",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="py-16 bg-gradient-to-b from-stone-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-light text-foreground tracking-tight mb-6">
              Contact <span className="text-primary font-medium">Us</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Have questions about QR Pro? Need help with your QR code campaigns? We're here to help you succeed.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="glass-effect warm-shadow border-0 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-2xl font-light tracking-tight">Send us a message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="mt-1"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full rounded-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="glass-effect warm-shadow border-0 rounded-2xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                    <Mail className="text-primary w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Email Support</h3>
                    <p className="text-muted-foreground mb-1">Get help with your account or technical issues</p>
                    <a href="mailto:clientservicesdigital@gmail.com" className="text-primary hover:text-primary/80 transition-colors">
                      clientservicesdigital@gmail.com
                    </a>
                  </div>
                </div>
              </Card>

              <Card className="glass-effect warm-shadow border-0 rounded-2xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-200/40 to-teal-200/40 rounded-xl flex items-center justify-center">
                    <Clock className="text-emerald-600 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Response Time</h3>
                    <p className="text-muted-foreground mb-1">We typically respond within 24 hours</p>
                    <p className="text-sm text-muted-foreground">Monday - Friday, 9 AM - 6 PM EST</p>
                  </div>
                </div>
              </Card>

              <Card className="glass-effect warm-shadow border-0 rounded-2xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-200/40 to-orange-200/40 rounded-xl flex items-center justify-center">
                    <Phone className="text-amber-600 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Priority Support</h3>
                    <p className="text-muted-foreground mb-1">Pro and Business subscribers get priority email support</p>
                    <p className="text-sm text-muted-foreground">Faster response times and dedicated assistance</p>
                  </div>
                </div>
              </Card>

              {/* FAQ Quick Links */}
              <Card className="glass-effect warm-shadow border-0 rounded-2xl p-6">
                <h3 className="text-lg font-medium text-foreground mb-4">Common Questions</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-foreground text-sm">How do I upgrade my plan?</h4>
                    <p className="text-sm text-muted-foreground">Visit your account settings and click "Upgrade Plan" to access Pro or Business features.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground text-sm">Can I change my QR code destination?</h4>
                    <p className="text-sm text-muted-foreground">Yes! Dynamic QR codes allow you to update destination URLs without changing the QR code image.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground text-sm">Do you offer API access?</h4>
                    <p className="text-sm text-muted-foreground">API access is available for Business plan subscribers. Contact us for integration details.</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}