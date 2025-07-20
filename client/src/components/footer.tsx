import { Link } from "wouter";
import { QrCode } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-stone-900 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <QrCode className="w-8 h-8 text-primary" />
              <span className="text-2xl font-light">QR Pro</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Trackable QR codes for real businesses. Create, customize, and analyze your QR code campaigns.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-lg font-medium mb-4">Product</h3>
            <ul className="space-y-3">
              <li><Link href="/login" className="text-gray-400 hover:text-white transition-colors">QR Generator</Link></li>
              <li><Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/login" className="text-gray-400 hover:text-white transition-colors">Analytics</Link></li>
              <li><Link href="/login" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-medium mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/blog/qr-codes-for-restaurants" className="text-gray-400 hover:text-white transition-colors">Restaurant Guide</Link></li>
              <li><Link href="/blog/real-estate-qr-codes" className="text-gray-400 hover:text-white transition-colors">Real Estate Guide</Link></li>
              <li><Link href="/blog/qr-code-marketing" className="text-gray-400 hover:text-white transition-colors">Marketing Tips</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-medium mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms</Link></li>
              <li><Link href="/support" className="text-gray-400 hover:text-white transition-colors">Support</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 QR Pro. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}