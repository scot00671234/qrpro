import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, Save, Crown, AlertTriangle, BarChart3, Edit3, Palette } from "lucide-react";
import { Link } from "wouter";

interface QrGeneratorProps {
  isPro: boolean;
  qrCodeCount: number;
  onQrCodeCreated?: () => void;
}

export function QrGenerator({ isPro, qrCodeCount, onQrCodeCreated }: QrGeneratorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [destinationUrl, setDestinationUrl] = useState("");
  const [isDynamic, setIsDynamic] = useState(true);
  const [size, setSize] = useState("200");
  const [foregroundColor, setForegroundColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [generatedQrId, setGeneratedQrId] = useState<number | null>(null);

  const createQrMutation = useMutation({
    mutationFn: async (qrData: any) => {
      const response = await apiRequest("POST", "/api/qr-codes", qrData);
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedQrId(data.id);
      generateQrMutation.mutate(data.id);
      toast({
        title: "Success",
        description: "QR code created successfully!",
      });
      onQrCodeCreated?.();
    },
    onError: (error: any) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      
      if (error.message.includes("Free plan limited")) {
        toast({
          title: "Upgrade Required",
          description: "Free plan limited to 1 QR code. Upgrade to Pro for unlimited access.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to create QR code",
          variant: "destructive",
        });
      }
    },
  });

  const generateQrMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("POST", `/api/qr-codes/${id}/generate`);
      return response.json();
    },
    onSuccess: (data) => {
      setQrImage(data.dataUrl);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to generate QR code image",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !destinationUrl.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in both name and destination URL fields",
        variant: "destructive",
      });
      return;
    }

    const qrData = {
      name: name.trim(),
      content: destinationUrl.trim(), // This will be updated to redirect URL for dynamic QRs
      destinationUrl: destinationUrl.trim(),
      isDynamic,
      size: isPro ? parseInt(size) : 200,
      customization: isPro ? {
        foregroundColor,
        backgroundColor,
        errorCorrectionLevel: "M" as const
      } : null,
    };

    createQrMutation.mutate(qrData);
  };

  const handleDownload = () => {
    if (qrImage && name) {
      const link = document.createElement('a');
      link.download = `${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
      link.href = qrImage;
      link.click();
    }
  };

  const canCreateQr = isPro || qrCodeCount === 0;

  return (
    <div className="grid lg:grid-cols-2 gap-12">
      <Card className="glass-effect warm-shadow border-0 rounded-2xl">
        <CardHeader className="pb-8">
          <CardTitle className="text-3xl font-light text-foreground tracking-tight">Create New QR Code</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">QR Code Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My QR Code"
                disabled={!canCreateQr}
              />
            </div>

            <div>
              <Label htmlFor="destinationUrl">Destination URL</Label>
              <Input
                id="destinationUrl"
                value={destinationUrl}
                onChange={(e) => setDestinationUrl(e.target.value)}
                placeholder="https://example.com"
                disabled={!canCreateQr}
              />
              <p className="text-sm text-gray-500 mt-1">
                {isDynamic ? "You can change this URL later without regenerating the QR code" : "This URL will be permanent"}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="dynamic"
                checked={isDynamic}
                onCheckedChange={setIsDynamic}
                disabled={!canCreateQr}
              />
              <div>
                <Label htmlFor="dynamic" className="flex items-center">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Dynamic QR Code
                </Label>
                <p className="text-sm text-gray-500">
                  Update destination without changing QR code
                </p>
              </div>
            </div>
            
            {/* Pro Features */}
            <div className={`space-y-4 ${!isPro ? 'opacity-50' : ''}`}>
              <div className="flex items-center space-x-2 mb-4">
                <Crown className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">Pro Features</span>
                {!isPro && <Badge variant="outline">Upgrade Required</Badge>}
              </div>
              
              <div>
                <Label htmlFor="size" className="flex items-center">
                  <Palette className="w-4 h-4 mr-2" />
                  Size
                </Label>
                <Select 
                  value={size} 
                  onValueChange={setSize}
                  disabled={!isPro || !canCreateQr}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="150">Small (150px)</SelectItem>
                    <SelectItem value="200">Medium (200px)</SelectItem>
                    <SelectItem value="300">Large (300px)</SelectItem>
                    <SelectItem value="500">Extra Large (500px)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="foregroundColor">Foreground Color</Label>
                  <Input
                    id="foregroundColor"
                    type="color"
                    value={foregroundColor}
                    onChange={(e) => setForegroundColor(e.target.value)}
                    disabled={!isPro || !canCreateQr}
                  />
                </div>
                <div>
                  <Label htmlFor="backgroundColor">Background Color</Label>
                  <Input
                    id="backgroundColor"
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    disabled={!isPro || !canCreateQr}
                  />
                </div>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={createQrMutation.isPending || !canCreateQr}
            >
              {createQrMutation.isPending ? "Creating..." : "Generate QR Code"}
            </Button>
            
            {!canCreateQr && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>You've used your free QR code. Upgrade to Pro for unlimited access.</span>
                  <Link href="/subscribe">
                    <Button size="sm" className="ml-4">
                      Upgrade
                    </Button>
                  </Link>
                </AlertDescription>
              </Alert>
            )}
          </form>
        </CardContent>
      </Card>
      
      {/* QR Preview */}
      <Card className="glass-effect warm-shadow border-0 rounded-2xl">
        <CardHeader className="pb-8">
          <CardTitle className="text-3xl font-light text-foreground tracking-tight">Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
              {generateQrMutation.isPending ? (
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Generating...</p>
                </div>
              ) : qrImage ? (
                <img 
                  src={qrImage} 
                  alt="Generated QR Code"
                  className="max-w-full max-h-full rounded"
                />
              ) : (
                <p className="text-gray-500 text-center text-sm">
                  Enter content and click generate to create QR code
                </p>
              )}
            </div>
            
            {qrImage && (
              <div className="flex space-x-3">
                <Button onClick={handleDownload} size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                {generatedQrId && (
                  <Link href="/qr-codes">
                    <Button variant="outline" size="sm">
                      <Save className="mr-2 h-4 w-4" />
                      View Saved
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
