import { Link } from "react-router-dom";
import { MapPin, Calendar, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import StatusBadge from "@/components/common/StatusBadge.jsx";
import CategoryIcon, { categoryLabel } from "@/components/common/CategoryIcon.jsx";

export default function ComplaintCard({ complaint, basePath = "/citizen/complaints" }) {
  const c = complaint;
  return (
    <Link to={`${basePath}/${c._id}`} className="block group">
      <Card className="hover:border-primary/40 transition-colors h-full">
        <CardContent className="p-5 flex flex-col gap-3 h-full">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CategoryIcon category={c.category} className="size-3.5" />
              <span>{categoryLabel(c.category)}</span>
            </div>
            <StatusBadge status={c.status} />
          </div>
          <h3 className="font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">{c.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{c.description}</p>
          <div className="mt-auto pt-3 border-t border-border space-y-1.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5"><MapPin className="size-3.5" /><span className="truncate">{c.location?.area}, {c.location?.city}</span></div>
            <div className="flex items-center gap-1.5"><Building2 className="size-3.5" /><span>{c.department?.name || "Unassigned"}</span></div>
            <div className="flex items-center gap-1.5"><Calendar className="size-3.5" /><span>{new Date(c.createdAt).toLocaleDateString()}</span></div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
