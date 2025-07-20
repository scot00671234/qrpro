import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QrCode, Plus, Copy, Trash2, MoreVertical, Download, Info, Lock } from "lucide-react";
import { Link } from "wouter";

export default function QrCodes() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [qrToDelete, setQrToDelete] = useState<number | null>(null);
  const [qrImages, setQrImages] = useState<Record<number, string>>({});

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  const { data: qrCodes = [], isLoading: qrCodesLoading } = useQuery({
    queryKey: ["/api/qr-codes"],
    enabled: isAuthenticated,
    retry: false,
  });

  const generateQrMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("POST", `/api/qr-codes/${id}/generate`);
      return response.json();
    },
    onSuccess: (data, id) => {
      setQrImages(prev => ({ ...prev, [id]: data.dataUrl }));
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
        description: "Failed to generate QR code",
        variant: "destructive",
      });
    },
  });

  const deleteQrMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/qr-codes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/qr-codes"] });
      toast({
        title: "Success",
        description: "QR code deleted successfully",
      });
      setDeleteDialogOpen(false);
      setQrToDelete(null);
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
        description: "Failed to delete QR code",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    // Generate QR images for all codes
    qrCodes.forEach((qr: any) => {
      if (!qrImages[qr.id]) {
        generateQrMutation.mutate(qr.id);
      }
    });
  }, [qrCodes]);

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied",
        description: "Content copied to clipboard",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to copy content",
        variant: "destructive",
      });
    }
  };

  const handleDownload = (dataUrl: string, name: string) => {
    const link = document.createElement('a');
    link.download = `${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleDelete = (id: number) => {
    setQrToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (qrToDelete) {
      deleteQrMutation.mutate(qrToDelete);
    }
  };

  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const isPro = user.subscriptionStatus === 'active';

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-neutral-100">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-5xl font-light text-foreground tracking-tight">My QR Codes</h1>
            <p className="mt-4 text-xl text-muted-foreground leading-relaxed">Manage and organize your saved QR codes</p>
          </div>
          <Link href="/dashboard">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New
            </Button>
          </Link>
        </div>

        {/* Free User Notice */}
        {!isPro && (
          <Alert className="mb-8 border-amber-200 bg-amber-50">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-amber-800">
              Upgrade to Pro to save and manage unlimited QR codes. Free users can only create one QR code at a time.
            </AlertDescription>
          </Alert>
        )}

        {/* QR Codes Grid */}
        {qrCodesLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : qrCodes.length === 0 ? (
          <Card className="p-12">
            <CardContent className="text-center p-0">
              <QrCode className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No QR codes yet</h3>
              <p className="text-gray-600 mb-6">Create your first QR code to get started</p>
              <Link href="/dashboard">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create QR Code
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {qrCodes.map((qr: any) => (
              <Card key={qr.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 truncate flex-1 mr-2">
                      {qr.name}
                    </h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleCopy(qr.content)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Content
                        </DropdownMenuItem>
                        {qrImages[qr.id] && (
                          <DropdownMenuItem onClick={() => handleDownload(qrImages[qr.id], qr.name)}>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => handleDelete(qr.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  {/* QR Code Display */}
                  <div className="w-full h-32 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                    {qrImages[qr.id] ? (
                      <img 
                        src={qrImages[qr.id]} 
                        alt={qr.name}
                        className="max-w-full max-h-full"
                      />
                    ) : (
                      <div className="animate-pulse w-20 h-20 bg-gray-300 rounded"></div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 truncate" title={qr.content}>
                    {qr.content}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Created {new Date(qr.createdAt).toLocaleDateString()}</span>
                    {qr.scans > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {qr.scans} scans
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Pro Feature Placeholder */}
            {!isPro && (
              <Card className="border-2 border-dashed border-gray-200 bg-gray-50">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                  <Lock className="text-gray-400 h-8 w-8 mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Pro Feature</h3>
                  <p className="text-sm text-gray-600 mb-4">Upgrade to save unlimited QR codes</p>
                  <Link href="/subscribe">
                    <Button size="sm">
                      Upgrade Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete QR Code</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this QR code? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDelete}
                disabled={deleteQrMutation.isPending}
              >
                {deleteQrMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
