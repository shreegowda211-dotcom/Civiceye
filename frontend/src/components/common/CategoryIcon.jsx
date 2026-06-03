import * as Icons from "lucide-react";
import { COMPLAINT_CATEGORIES } from "@/config/constants.js";

export default function CategoryIcon({ category, className = "size-4" }) {
  const meta = COMPLAINT_CATEGORIES.find((c) => c.key === category);
  const Icon = (meta && Icons[meta.icon]) || Icons.Tag;
  return <Icon className={className} />;
}

export function categoryLabel(key) {
  return COMPLAINT_CATEGORIES.find((c) => c.key === key)?.label || key;
}
