import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function OfficerWorkload({ data = [] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Officer Workload</CardTitle>
        <p className="text-xs text-muted-foreground">Active complaints per officer · auto-balanced</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.length === 0 && <p className="text-sm text-muted-foreground">No officers yet.</p>}
        {data.map((o) => (
          <div key={o.officerId}>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <div className="min-w-0">
                <p className="font-medium truncate">{o.name}</p>
                <p className="text-xs text-muted-foreground">{o.department}</p>
              </div>
              <div className="text-right text-xs">
                <p><span className="font-semibold">{o.assigned}</span> open</p>
                <p className="text-muted-foreground">{o.resolved} resolved</p>
              </div>
            </div>
            <Progress value={o.load} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
