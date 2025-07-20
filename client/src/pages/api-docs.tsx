import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code, Key, Zap, Shield, BookOpen, ExternalLink } from "lucide-react";

const endpoints = [
  {
    method: "POST",
    path: "/api/qr-codes",
    description: "Create a new QR code",
    params: {
      name: "string (required)",
      destinationUrl: "string (required)",
      isDynamic: "boolean (optional, default: true)",
      customization: "object (optional)"
    },
    response: {
      id: "number",
      content: "string (QR code redirect URL)",
      destinationUrl: "string",
      createdAt: "timestamp"
    }
  },
  {
    method: "GET",
    path: "/api/qr-codes",
    description: "List all QR codes for authenticated user",
    params: {
      limit: "number (optional, default: 50)",
      offset: "number (optional, default: 0)"
    },
    response: {
      qrCodes: "array",
      total: "number",
      hasMore: "boolean"
    }
  },
  {
    method: "GET",
    path: "/api/qr-codes/{id}",
    description: "Get QR code details and analytics",
    params: {
      id: "number (required)"
    },
    response: {
      id: "number",
      name: "string",
      destinationUrl: "string",
      scans: "number",
      analytics: "object"
    }
  },
  {
    method: "PUT",
    path: "/api/qr-codes/{id}",
    description: "Update QR code (dynamic QR codes only)",
    params: {
      destinationUrl: "string (optional)",
      name: "string (optional)",
      customization: "object (optional)"
    },
    response: {
      id: "number",
      updatedAt: "timestamp",
      message: "string"
    }
  },
  {
    method: "DELETE",
    path: "/api/qr-codes/{id}",
    description: "Delete a QR code",
    params: {
      id: "number (required)"
    },
    response: {
      message: "string",
      deletedAt: "timestamp"
    }
  },
  {
    method: "GET",
    path: "/api/analytics/{id}",
    description: "Get detailed analytics for a QR code",
    params: {
      id: "number (required)",
      period: "string (optional: '7d', '30d', '90d', default: '30d')"
    },
    response: {
      totalScans: "number",
      scanHistory: "array",
      deviceBreakdown: "array",
      locationData: "array"
    }
  }
];

const codeExamples = {
  javascript: `// Initialize QR Pro API client
const API_KEY = 'your_api_key_here';
const BASE_URL = 'https://your-qr-pro-domain.com';

// Create a new QR code
async function createQRCode() {
  const response = await fetch(\`\${BASE_URL}/api/qr-codes\`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${API_KEY}\`
    },
    body: JSON.stringify({
      name: 'Restaurant Menu',
      destinationUrl: 'https://restaurant.com/menu',
      isDynamic: true,
      customization: {
        foregroundColor: '#000000',
        backgroundColor: '#ffffff',
        size: 300
      }
    })
  });
  
  const qrCode = await response.json();
  console.log('Created QR Code:', qrCode);
  return qrCode;
}

// Get QR code analytics
async function getAnalytics(qrCodeId) {
  const response = await fetch(\`\${BASE_URL}/api/analytics/\${qrCodeId}\`, {
    headers: {
      'Authorization': \`Bearer \${API_KEY}\`
    }
  });
  
  const analytics = await response.json();
  console.log('Analytics:', analytics);
  return analytics;
}`,
  
  python: `import requests
import json

# QR Pro API configuration
API_KEY = 'your_api_key_here'
BASE_URL = 'https://your-qr-pro-domain.com'
HEADERS = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {API_KEY}'
}

def create_qr_code():
    """Create a new QR code"""
    data = {
        'name': 'Restaurant Menu',
        'destinationUrl': 'https://restaurant.com/menu',
        'isDynamic': True,
        'customization': {
            'foregroundColor': '#000000',
            'backgroundColor': '#ffffff',
            'size': 300
        }
    }
    
    response = requests.post(
        f'{BASE_URL}/api/qr-codes',
        headers=HEADERS,
        json=data
    )
    
    if response.status_code == 201:
        qr_code = response.json()
        print(f"Created QR Code: {qr_code}")
        return qr_code
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return None

def get_analytics(qr_code_id, period='30d'):
    """Get QR code analytics"""
    response = requests.get(
        f'{BASE_URL}/api/analytics/{qr_code_id}?period={period}',
        headers=HEADERS
    )
    
    if response.status_code == 200:
        analytics = response.json()
        print(f"Analytics: {analytics}")
        return analytics
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return None`,

  curl: `# Create a new QR code
curl -X POST https://your-qr-pro-domain.com/api/qr-codes \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer your_api_key_here" \\
  -d '{
    "name": "Restaurant Menu",
    "destinationUrl": "https://restaurant.com/menu",
    "isDynamic": true,
    "customization": {
      "foregroundColor": "#000000",
      "backgroundColor": "#ffffff",
      "size": 300
    }
  }'

# Get QR code analytics
curl -X GET https://your-qr-pro-domain.com/api/analytics/123?period=30d \\
  -H "Authorization: Bearer your_api_key_here"

# Update QR code destination
curl -X PUT https://your-qr-pro-domain.com/api/qr-codes/123 \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer your_api_key_here" \\
  -d '{
    "destinationUrl": "https://restaurant.com/new-menu"
  }'`
};

export default function APIDocs() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="py-16 bg-gradient-to-b from-stone-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-light text-foreground tracking-tight mb-6">
              API <span className="text-primary font-medium">Documentation</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Integrate QR Pro into your applications with our powerful REST API. Available for Business plan subscribers.
            </p>
          </div>

          {/* API Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card className="glass-effect warm-shadow border-0 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-medium text-foreground mb-2">Fast & Reliable</h3>
              <p className="text-sm text-muted-foreground">99.9% uptime with global CDN distribution</p>
            </Card>
            
            <Card className="glass-effect warm-shadow border-0 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-medium text-foreground mb-2">Secure</h3>
              <p className="text-sm text-muted-foreground">API key authentication with rate limiting</p>
            </Card>
            
            <Card className="glass-effect warm-shadow border-0 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Code className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-medium text-foreground mb-2">RESTful</h3>
              <p className="text-sm text-muted-foreground">Clean, intuitive REST API with JSON responses</p>
            </Card>
            
            <Card className="glass-effect warm-shadow border-0 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-medium text-foreground mb-2">Well Documented</h3>
              <p className="text-sm text-muted-foreground">Comprehensive docs with code examples</p>
            </Card>
          </div>

          {/* Getting Started */}
          <Card className="glass-effect warm-shadow border-0 rounded-2xl mb-12">
            <CardHeader>
              <CardTitle className="text-2xl font-light tracking-tight flex items-center gap-2">
                <Key className="w-6 h-6 text-primary" />
                Getting Started
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-foreground mb-2">1. Get Your API Key</h3>
                  <p className="text-muted-foreground mb-4">
                    API access is available for Business plan subscribers. Generate your API key from your account settings.
                  </p>
                  <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                    Business Plan Required
                  </Badge>
                </div>
                
                <div>
                  <h3 className="font-medium text-foreground mb-2">2. Base URL</h3>
                  <div className="bg-muted rounded-lg p-4 font-mono text-sm">
                    https://your-qr-pro-domain.com/api
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-foreground mb-2">3. Authentication</h3>
                  <p className="text-muted-foreground mb-2">Include your API key in the Authorization header:</p>
                  <div className="bg-muted rounded-lg p-4 font-mono text-sm">
                    Authorization: Bearer YOUR_API_KEY
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-foreground mb-2">4. Rate Limits</h3>
                  <p className="text-muted-foreground">
                    • 1000 requests per hour for Business plan subscribers<br/>
                    • Rate limit headers included in all responses
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Endpoints */}
          <div className="mb-12">
            <h2 className="text-3xl font-light text-foreground tracking-tight mb-8">API Endpoints</h2>
            <div className="space-y-6">
              {endpoints.map((endpoint, index) => (
                <Card key={index} className="glass-effect warm-shadow border-0 rounded-2xl">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Badge variant={endpoint.method === 'GET' ? 'secondary' : endpoint.method === 'POST' ? 'default' : 'outline'}>
                        {endpoint.method}
                      </Badge>
                      <code className="text-lg font-mono">{endpoint.path}</code>
                    </div>
                    <p className="text-muted-foreground">{endpoint.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-foreground mb-3">Parameters</h4>
                        <div className="space-y-2">
                          {Object.entries(endpoint.params).map(([key, value]) => (
                            <div key={key} className="flex justify-between text-sm">
                              <code className="text-primary">{key}</code>
                              <span className="text-muted-foreground">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground mb-3">Response</h4>
                        <div className="space-y-2">
                          {Object.entries(endpoint.response).map(([key, value]) => (
                            <div key={key} className="flex justify-between text-sm">
                              <code className="text-emerald-600">{key}</code>
                              <span className="text-muted-foreground">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Code Examples */}
          <div className="mb-12">
            <h2 className="text-3xl font-light text-foreground tracking-tight mb-8">Code Examples</h2>
            <div className="space-y-8">
              {Object.entries(codeExamples).map(([language, code]) => (
                <Card key={language} className="glass-effect warm-shadow border-0 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-lg capitalize">{language}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto text-sm">
                      <code>{code}</code>
                    </pre>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Support */}
          <Card className="glass-effect warm-shadow border-0 rounded-2xl p-8 bg-gradient-to-r from-primary/5 to-accent/5 text-center">
            <h3 className="text-2xl font-light text-foreground mb-4 tracking-tight">
              Need API Support?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Our development team is here to help you integrate QR Pro into your applications successfully.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="rounded-full">
                <ExternalLink className="w-5 h-5 mr-2" />
                Contact API Support
              </Button>
              <Button variant="outline" size="lg" className="rounded-full">
                View Examples on GitHub
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}