import { cn } from "@/lib/utils";
import { STATUS_META } from "@/config/constants.js";

/**
 * @param {{ status?: string; className?: string }} props
 */
export default function StatusBadge({ status = "", className = "" } = {}) {
  const meta = STATUS_META[status] || { label: status, color: "" };
  return (
    <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border", meta.color, className)}>
      {meta.label}
    </span>
  );
}
