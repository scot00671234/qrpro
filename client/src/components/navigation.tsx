import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { QrCode, Settings, LogOut, User, Crown } from "lucide-react";
import { Link } from "wouter";

export function Navigation() {
  const { user, isAuthenticated, isLoading } = useAuth();

  const handleLogin = () => {
    window.location.href = "/login";
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/";
    }
  };

  const getUserInitials = () => {
    if (user && 'firstName' in user && 'lastName' in user && user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    if (user && 'email' in user && user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  const isPro = user && 'subscriptionStatus' in user && user.subscriptionStatus === 'active';

  return (
    <nav className="glass-effect warm-shadow sticky top-0 z-50 border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <QrCode className="text-primary w-8 h-8 mr-3" />
              <span className="text-2xl font-light text-foreground tracking-tight">QR Pro</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : isAuthenticated && user ? (
              <>
                <div className="hidden md:flex items-center space-x-4">
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/qr-codes">
                    <Button variant="ghost" size="sm">
                      My QR Codes
                    </Button>
                  </Link>

                  {!isPro && (
                    <Link href="/subscribe">
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        <Crown className="w-4 h-4 mr-1" />
                        Upgrade
                      </Button>
                    </Link>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={(user && 'profileImageUrl' in user && user.profileImageUrl) || ""} alt="Profile" />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        {user && 'firstName' in user && 'lastName' in user && user.firstName && user.lastName && (
                          <p className="font-medium">{user.firstName} {user.lastName}</p>
                        )}
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user && 'email' in user ? user.email : ''}
                        </p>
                        {isPro && (
                          <div className="flex items-center text-xs text-emerald-600">
                            <Crown className="w-3 h-3 mr-1" />
                            Pro Member
                          </div>
                        )}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <Link href="/dashboard">
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/qr-codes">
                      <DropdownMenuItem>
                        <QrCode className="mr-2 h-4 w-4" />
                        My QR Codes
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/settings">
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </DropdownMenuItem>
                    </Link>
                    {!isPro && (
                      <>
                        <DropdownMenuSeparator />
                        <Link href="/subscribe">
                          <DropdownMenuItem>
                            <Crown className="mr-2 h-4 w-4" />
                            Upgrade to Pro
                          </DropdownMenuItem>
                        </Link>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button onClick={handleLogin}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
