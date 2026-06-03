import { NavLink } from "react-router-dom";
import * as Icons from "lucide-react";
import { Eye, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext.jsx";
import { NAV_BY_ROLE } from "@/config/navigation.js";
import { cn } from "@/lib/utils";

export default function Sidebar({ mobileOpen, onClose }) {
  const { user } = useAuth();
  const items = NAV_BY_ROLE[user?.role] || [];

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={onClose} />}

      <aside
        className={cn(
          "fixed top-0 left-0 h-screen w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border z-40 transition-transform",
          "md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-lg bg-primary text-primary-foreground grid place-items-center">
              <Eye className="size-5" />
            </div>
            <div>
              <p className="font-bold leading-none tracking-tight">CivicEye</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">{user?.role}</p>
            </div>
          </div>
          <button className="md:hidden p-1.5 rounded hover:bg-sidebar-accent" onClick={onClose}>
            <X className="size-4" />
          </button>
        </div>

        <nav className="p-3 space-y-0.5">
          {items.map((item) => {
            const Icon = Icons[item.icon] || Icons.Circle;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                      : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground/80",
                  )
                }
              >
                <Icon className="size-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="size-9 rounded-full bg-sidebar-accent grid place-items-center text-sm font-semibold">
              {user?.name?.[0]?.toUpperCase() || "?"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
