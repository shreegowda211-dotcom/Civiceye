import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function StatCard({ label, value, hint = null, icon: Icon = null, tone = "default" }) {
  const tones = {
    default: "bg-primary/10 text-primary",
    success: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    warn:    "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    danger:  "bg-rose-500/15 text-rose-600 dark:text-rose-400",
    info:    "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  };
  return (
    <Card>
      <CardContent className="p-5 flex items-center gap-4">
        {Icon && (
          <div className={cn("size-12 rounded-xl grid place-items-center", tones[tone])}>
            <Icon className="size-5" />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold mt-0.5">{value}</p>
          {hint && <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
