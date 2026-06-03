import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, User, LogOut, Bell, Menu, X, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext.jsx";
import { useNotifications } from "@/context/NotificationContext.jsx";
import { ROLE_HOME } from "@/config/navigation.js";

export default function Header() {
  const { user, logout } = useAuth();
  const { unread } = useNotifications();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isAuth = !!user;
  const dashboardPath = user ? ROLE_HOME[user.role] || "/" : "/";
  const initials = (user?.name || "U").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow grid place-items-center shadow-md text-primary-foreground">
            <ShieldCheck className="size-5" />
          </div>
          <div className="leading-tight">
            <p className="font-bold text-lg tracking-tight">CivicEye</p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Smart Issue Reporting</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-3">
          {isAuth ? (
            <>
              {user.role === "citizen" && (
                <button
                  onClick={() => navigate("/citizen/notifications")}
                  className="relative p-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <Bell className="size-5" />
                  {unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full size-4 grid place-items-center">
                      {unread > 9 ? "9+" : unread}
                    </span>
                  )}
                </button>
              )}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 hover:bg-accent rounded-lg transition-colors"
                >
                  <div className="size-9 rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground grid place-items-center font-semibold text-sm">
                    {initials}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium leading-tight">{user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize leading-tight">{user.role}</p>
                  </div>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-card border border-border rounded-xl shadow-lg overflow-hidden">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => { navigate(dashboardPath); setDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-accent flex items-center gap-2"
                    >
                      <LayoutDashboard className="size-4" /> Dashboard
                    </button>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm hover:bg-accent flex items-center gap-2 text-destructive">
                      <LogOut className="size-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild><Link to="/login">Login</Link></Button>
              <Button asChild className="bg-gradient-to-r from-primary to-primary-glow shadow-md">
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 hover:bg-accent rounded-lg transition-colors"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur">
          <div className="px-4 py-4 space-y-2">
            {isAuth ? (
              <>
                <div className="px-3 py-2 rounded-lg bg-accent">
                  <p className="font-medium text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                  <p className="text-xs text-muted-foreground capitalize">Role: {user.role}</p>
                </div>
                <button
                  onClick={() => { navigate(dashboardPath); setMobileOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-accent flex items-center gap-2 text-sm"
                >
                  <LayoutDashboard className="size-4" /> Dashboard
                </button>
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-accent flex items-center gap-2 text-sm text-destructive"
                >
                  <LogOut className="size-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-accent text-sm">Login</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg bg-gradient-to-r from-primary to-primary-glow text-primary-foreground text-sm font-medium text-center">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
