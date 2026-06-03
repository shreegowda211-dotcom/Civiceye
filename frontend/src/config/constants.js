export const ROLES = {
  CITIZEN: "citizen",
  OFFICER: "officer",
  ADMIN: "admin",
};

export const COMPLAINT_CATEGORIES = [
  { key: "roads", label: "Roads", icon: "Construction", department: "Public Works" },
  { key: "water_supply", label: "Water Supply", icon: "Droplet", department: "Water Board" },
  { key: "electricity", label: "Electricity", icon: "Zap", department: "Electricity Board" },
  { key: "sanitation", label: "Sanitation", icon: "Trash2", department: "Sanitation" },
  { key: "health", label: "Health", icon: "HeartPulse", department: "Health" },
  { key: "drainage", label: "Drainage", icon: "Waves", department: "Drainage" },
  { key: "environment", label: "Environment", icon: "Trees", department: "Environment" },
  { key: "public_safety", label: "Public Safety", icon: "Shield", department: "Public Safety" },
];

export const COMPLAINT_STATUS = {
  PENDING: "pending",
  ASSIGNED: "assigned",
  IN_PROGRESS: "in_progress",
  RESOLVED: "resolved",
  REJECTED: "rejected",
};

export const STATUS_META = {
  pending:     { label: "Pending",     color: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30" },
  assigned:    { label: "Assigned",    color: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30" },
  in_progress: { label: "In Progress", color: "bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/30" },
  resolved:    { label: "Resolved",    color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" },
  rejected:    { label: "Rejected",    color: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30" },
};

export const STATUS_FLOW = ["pending", "assigned", "in_progress", "resolved"];
