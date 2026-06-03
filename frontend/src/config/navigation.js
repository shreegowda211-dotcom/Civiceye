// Role-based sidebar navigation definitions.
export const NAV_BY_ROLE = {
  citizen: [
    { to: "/citizen/dashboard",      label: "Dashboard",    icon: "LayoutDashboard" },
    { to: "/citizen/complaints/new", label: "New Complaint", icon: "FilePlus2" },
    { to: "/citizen/complaints",     label: "My Complaints", icon: "ListChecks" },
    { to: "/citizen/notifications",  label: "Notifications", icon: "Bell" },
    { to: "/citizen/profile",        label: "Profile",       icon: "User" },
  ],
  officer: [
    { to: "/officer/dashboard",     label: "Dashboard",   icon: "LayoutDashboard" },
    { to: "/officer/complaints",    label: "Assigned",    icon: "ClipboardList" },
    { to: "/officer/notifications", label: "Notifications", icon: "Bell" },
    { to: "/officer/profile",       label: "Profile",     icon: "User" },
  ],
  admin: [
    { to: "/admin/dashboard",   label: "Dashboard",     icon: "LayoutDashboard" },
    { to: "/admin/analytics",   label: "Analytics",     icon: "BarChart3" },
    { to: "/admin/activities",  label: "Activities",    icon: "Activity" },
    { to: "/admin/notifications", label: "Notifications", icon: "Bell" },
    { to: "/admin/complaints",  label: "Complaints",    icon: "FileText" },
    { to: "/admin/officers",    label: "Officers",      icon: "UserCog" },
    { to: "/admin/departments", label: "Departments",   icon: "Building2" },
    { to: "/admin/users",       label: "Users",         icon: "Users" },
    { to: "/admin/heatmap",     label: "Heatmap",       icon: "Map" },
    { to: "/admin/reports",     label: "Reports",       icon: "FileBarChart" },
    { to: "/admin/settings",    label: "Settings",      icon: "Settings" },
    { to: "/admin/profile",     label: "Profile",       icon: "User" },
  ],
};

export const ROLE_HOME = {
  citizen: "/citizen/dashboard",
  officer: "/officer/dashboard",
  admin:   "/admin/dashboard",
};
