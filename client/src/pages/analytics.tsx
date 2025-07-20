import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Smartphone, Globe, Calendar, Crown } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";

interface AnalyticsSummary {
  totalScans: number;
  topPerformingQr: {
    id: number;
    name: string;
    scans: number;
  } | null;
  recentScans: Array<{
    id: number;
    qrCodeId: number;
    scannedAt: string;
    deviceType: string;
    country?: string;
  }>;
}

export default function Analytics() {
  const { user } = useAuth();
  const isPro = user?.subscriptionStatus === 'active';

  const { data: analytics, isLoading, error } = useQuery<AnalyticsSummary>({
    queryKey: ['/api/analytics/summary'],
    enabled: isPro,
  });

  if (!isPro) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Analytics Dashboard</h1>
            <p className="text-xl text-gray-600 mb-8">
              Track your QR code performance with detailed analytics
            </p>
            
            <Card className="max-w-md mx-auto">
              <CardContent className="p-8 text-center">
                <Crown className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Pro Feature</h3>
                <p className="text-gray-600 mb-6">
                  Analytics dashboard is available for Pro subscribers only
                </p>
                <Button asChild>
                  <Link href="/subscribe">Upgrade to Pro</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Analytics</h1>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your QR code performance and engagement</p>
        </div>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.totalScans || 0}</div>
              <p className="text-xs text-muted-foreground">
                Across all QR codes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Performing QR</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics?.topPerformingQr?.scans || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {analytics?.topPerformingQr?.name || "No QR codes yet"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics?.recentScans?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Scans in last 30 days
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Scans */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Scans</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics?.recentScans && analytics.recentScans.length > 0 ? (
              <div className="space-y-4">
                {analytics.recentScans.slice(0, 10).map((scan) => (
                  <div key={scan.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {scan.deviceType === 'mobile' && <Smartphone className="w-4 h-4" />}
                        {scan.deviceType === 'desktop' && <Globe className="w-4 h-4" />}
                        {scan.deviceType === 'tablet' && <Smartphone className="w-4 h-4" />}
                        <Badge variant="outline">{scan.deviceType}</Badge>
                      </div>
                      {scan.country && (
                        <Badge variant="secondary">{scan.country}</Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(scan.scannedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No scans recorded yet</p>
                <p className="text-sm text-gray-500">
                  Share your QR codes to start seeing analytics data
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Button asChild variant="outline">
            <Link href="/qr-codes">View All QR Codes</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}