import { useQuery } from "@tanstack/react-query";
import { Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { departmentService } from "@/api/departmentService.js";
import PageHeader from "@/components/common/PageHeader.jsx";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Loader from "@/components/common/Loader.jsx";

export default function Departments() {
  const { data, isLoading } = useQuery({ queryKey: ["departments"], queryFn: () => departmentService.list() });
  if (isLoading) return <Loader />;

  return (
    <div>
      <PageHeader title="Departments" description="Categories handled by each department drive AI auto-routing." actions={<Button>+ Add Department</Button>} />
      <p className="max-w-3xl text-sm text-muted-foreground mb-6">
        Select a department to view its officer team, complaint workload, and resolution progress in detail.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(data?.data || []).map((d) => {
          const categories = Array.isArray(d.categories) ? d.categories : [];
          return (
            <Link key={d._id} to={`/admin/departments/${d._id}`} className="group block rounded-lg transition hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary">
              <Card className="h-full">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="size-10 rounded-lg bg-primary/10 text-primary grid place-items-center"><Building2 className="size-5" /></div>
                    <div>
                      <h3 className="font-semibold">{d.name}</h3>
                      <p className="text-xs text-muted-foreground">{categories.join(", ")}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{d.description || "No description available."}</p>
                  <div className="grid grid-cols-3 text-center text-sm border-t border-border pt-3">
                    <div><p className="font-semibold">{d.officerCount ?? 0}</p><p className="text-xs text-muted-foreground">Officers</p></div>
                    <div><p className="font-semibold text-amber-600">{d.openCount ?? 0}</p><p className="text-xs text-muted-foreground">Open</p></div>
                    <div><p className="font-semibold text-emerald-600">{d.resolvedCount ?? 0}</p><p className="text-xs text-muted-foreground">Resolved</p></div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
