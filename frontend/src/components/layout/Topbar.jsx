import { Bell, Menu, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";
import { useNotifications } from "@/context/NotificationContext.jsx";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Topbar({ onMenu }) {
  const { user, logout } = useAuth();
  const { unread, items, markAllRead } = useNotifications();
  const navigate = useNavigate();

  const notifPath = `/${user?.role}/notifications`;
  const profilePath = `/${user?.role}/profile`;

  return (
    <header className="h-16 border-b border-border bg-card/40 backdrop-blur flex items-center px-4 md:px-6 gap-3 sticky top-0 z-20">
      <button className="md:hidden p-2 rounded hover:bg-accent" onClick={onMenu}>
        <Menu className="size-5" />
      </button>
      <div className="flex-1" />


      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="size-4" />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full size-4 grid place-items-center">
                {unread}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel className="flex items-center justify-between">
            Notifications
            {unread > 0 && (
              <button onClick={markAllRead} className="text-xs text-primary hover:underline">Mark all read</button>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {items.slice(0, 5).map((n) => (
            <DropdownMenuItem key={n._id} onClick={() => n.link && navigate(n.link)} className="flex-col items-start gap-1 cursor-pointer">
              <p className={`text-sm ${n.read ? "" : "font-semibold"}`}>{n.title}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
            </DropdownMenuItem>
          ))}
          {items.length === 0 && <p className="p-4 text-sm text-muted-foreground text-center">No notifications</p>}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild><Link to={notifPath}>View all</Link></DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="size-9 rounded-full bg-primary text-primary-foreground grid place-items-center font-semibold text-sm">
            {user?.name?.[0]?.toUpperCase()}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <p className="font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild><Link to={profilePath}>Profile</Link></DropdownMenuItem>
          <DropdownMenuItem onClick={() => { logout(); navigate("/login"); }}>
            <LogOut className="size-4 mr-2" /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
