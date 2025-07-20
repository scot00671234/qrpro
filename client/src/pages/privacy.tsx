import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="py-16 bg-gradient-to-b from-stone-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-light text-foreground tracking-tight mb-6">
              Privacy <span className="text-primary font-medium">Policy</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Last updated: January 20, 2025
            </p>
          </div>

          <div className="prose prose-lg max-w-none prose-headings:font-light prose-headings:tracking-tight prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-p:leading-relaxed prose-a:text-primary prose-strong:font-medium">
            <h2>Information We Collect</h2>
            
            <h3>Account Information</h3>
            <p>When you create an account with QR Pro, we collect:</p>
            <ul>
              <li>Email address (required for login and notifications)</li>
              <li>Name (optional, for personalization)</li>
              <li>Password (encrypted and securely stored)</li>
              <li>Subscription and billing information through Stripe</li>
            </ul>

            <h3>QR Code Data</h3>
            <p>We store information about the QR codes you create, including:</p>
            <ul>
              <li>QR code content and destination URLs</li>
              <li>Customization settings (colors, sizes, logos)</li>
              <li>QR code names and descriptions you provide</li>
              <li>Creation and modification timestamps</li>
            </ul>

            <h3>Analytics Data</h3>
            <p>When someone scans your QR codes, we collect anonymous analytics data:</p>
            <ul>
              <li>Scan timestamps and frequency</li>
              <li>General location data (country/city level)</li>
              <li>Device type (mobile, tablet, desktop)</li>
              <li>Browser information (for compatibility)</li>
              <li>Referrer information (where the scan originated)</li>
            </ul>

            <h2>How We Use Your Information</h2>
            
            <h3>Service Provision</h3>
            <ul>
              <li>Creating and managing your QR codes</li>
              <li>Providing scan analytics and performance insights</li>
              <li>Processing subscription payments and billing</li>
              <li>Sending service-related notifications</li>
            </ul>

            <h3>Communication</h3>
            <ul>
              <li>Responding to your support requests</li>
              <li>Sending important account updates</li>
              <li>Providing product updates and feature announcements (with consent)</li>
              <li>Password reset and security notifications</li>
            </ul>

            <h3>Service Improvement</h3>
            <ul>
              <li>Analyzing usage patterns to improve our platform</li>
              <li>Identifying and fixing technical issues</li>
              <li>Developing new features based on user needs</li>
              <li>Ensuring platform security and preventing abuse</li>
            </ul>

            <h2>Data Sharing and Disclosure</h2>
            
            <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in these limited circumstances:</p>

            <h3>Service Providers</h3>
            <ul>
              <li><strong>Stripe:</strong> For payment processing and subscription management</li>
              <li><strong>Email Service:</strong> For transactional emails and notifications</li>
              <li><strong>Hosting Provider:</strong> For secure data storage and platform hosting</li>
            </ul>

            <h3>Legal Requirements</h3>
            <p>We may disclose your information if required by law, court order, or government regulation, or to protect our rights and the safety of our users.</p>

            <h2>Data Security</h2>
            
            <p>We implement industry-standard security measures to protect your data:</p>
            <ul>
              <li>Encryption of data in transit and at rest</li>
              <li>Secure password hashing using bcrypt</li>
              <li>Regular security audits and updates</li>
              <li>Limited access to personal data on a need-to-know basis</li>
              <li>Secure hosting with SSL/TLS certificates</li>
            </ul>

            <h2>Your Rights and Choices</h2>
            
            <h3>Account Access</h3>
            <p>You can access and update your account information at any time through your account settings.</p>

            <h3>Data Portability</h3>
            <p>You can export your QR code data and analytics at any time through your dashboard.</p>

            <h3>Account Deletion</h3>
            <p>You can delete your account and all associated data from your account settings. This action is permanent and cannot be undone.</p>

            <h3>Communication Preferences</h3>
            <p>You can opt out of marketing emails while still receiving essential service notifications.</p>

            <h2>Data Retention</h2>
            
            <p>We retain your data as long as your account is active or as needed to provide our services. When you delete your account:</p>
            <ul>
              <li>Account data is immediately deleted</li>
              <li>QR code data is permanently removed</li>
              <li>Analytics data may be retained in anonymized form for service improvement</li>
              <li>Billing records may be retained as required by law</li>
            </ul>

            <h2>International Data Transfers</h2>
            
            <p>QR Pro operates globally. Your data may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your privacy rights.</p>

            <h2>Children's Privacy</h2>
            
            <p>QR Pro is not intended for use by children under 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will promptly delete it.</p>

            <h2>Changes to This Policy</h2>
            
            <p>We may update this Privacy Policy periodically to reflect changes in our practices or applicable laws. We will notify you of significant changes via email or through our platform.</p>

            <h2>Contact Us</h2>
            
            <p>If you have questions about this Privacy Policy or our data practices, please contact us:</p>
            <ul>
              <li>Email: <a href="mailto:clientservicesdigital@gmail.com">clientservicesdigital@gmail.com</a></li>
              <li>Subject Line: "Privacy Policy Question"</li>
            </ul>

            <p>We will respond to privacy-related inquiries within 30 days.</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}