import { Link, useLocation } from "wouter";
import { Bell, Settings, NetworkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAlerts } from "@/hooks/use-suppliers";

export default function Header() {
  const [location] = useLocation();
  const { data: alerts } = useAlerts();
  const unreadCount = alerts?.filter(alert => alert.isRead === 0).length || 0;

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/matrix", label: "Segmentation" },
    { href: "/suppliers", label: "Suppliers" },
  ];

  return (
    <header className="bg-card border-b border-border shadow-sm" data-testid="header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <NetworkIcon className="text-primary w-8 h-8" data-testid="logo" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-foreground">Supplier Segmentation</h1>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8" data-testid="main-nav">
            {navItems.map((item) => {
              const isActive = location === item.href || (location === "/" && item.href === "/dashboard");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-medium transition-colors ${
                    isActive
                      ? "text-primary border-b-2 border-primary pb-2"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid={`nav-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              data-testid="notifications-button"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  data-testid="notification-badge"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
            
            <Button variant="ghost" size="icon" data-testid="settings-button">
              <Settings className="h-5 w-5" />
            </Button>

            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8" data-testid="user-avatar">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32" />
                <AvatarFallback>JC</AvatarFallback>
              </Avatar>
              <span className="hidden sm:block text-sm font-medium">John Chen</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
