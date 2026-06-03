import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Users, CheckCircle2, Clock, FileText } from "lucide-react";
import { departmentService } from "@/api/departmentService.js";
import { officerService } from "@/api/officerService.js";
import PageHeader from "@/components/common/PageHeader.jsx";
import StatCard from "@/components/charts/StatCard.jsx";
import Loader from "@/components/common/Loader.jsx";
import EmptyState from "@/components/common/EmptyState.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DepartmentDetail() {
  const { id } = useParams();
  const { data: departmentData, isLoading: loadingDepartment } = useQuery({
    queryKey: ["department", id],
    queryFn: () => departmentService.get(id),
    enabled: Boolean(id),
  });
  const { data: statsData, isLoading: loadingStats } = useQuery({
    queryKey: ["department-stats", id],
    queryFn: () => departmentService.stats(id),
    enabled: Boolean(id),
  });
  const { data: officersData, isLoading: loadingOfficers } = useQuery({
    queryKey: ["department-officers", id],
    queryFn: () => officerService.list({ departmentId: id }),
    enabled: Boolean(id),
  });

  const isLoading = loadingDepartment || loadingStats || loadingOfficers;
  const department = departmentData?.data;
  const stats = statsData?.data || {};
  const officers = officersData?.data || [];

  if (isLoading) return <Loader />;
  if (!department) return <EmptyState title="Department not found" />;

  return (
    <div>
      <div className="mb-4">
        <Button asChild variant="outline">
          <Link to="/admin/departments"><ArrowLeft className="size-4" /> Back to departments</Link>
        </Button>
      </div>

      <PageHeader
        title={department.name}
        description={`View performance, complaints, and officer assignments for the ${department.name} department.`}
      />

      <p className="max-w-3xl text-sm text-muted-foreground mb-6">
        This page breaks down department workload, officer coverage, and resolution progress so admins can monitor the operational status of each team.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total complaints" value={stats.totalComplaints ?? 0} icon={FileText} />
        <StatCard label="Open complaints" value={stats.openCount ?? 0} icon={Clock} tone="warn" />
        <StatCard label="Resolved" value={stats.resolvedCount ?? 0} icon={CheckCircle2} tone="success" />
        <StatCard label="Officers" value={stats.officerCount ?? 0} icon={Users} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Department overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{department.description || "No description provided."}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-lg border border-border p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Categories</p>
                <p className="mt-2 text-sm">{(department.categories || []).join(", ") || "—"}</p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Current officer count</p>
                <p className="mt-2 text-sm font-semibold">{stats.officerCount ?? 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border border-border p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Open</p>
              <p className="mt-2 text-sm font-semibold">{stats.openCount ?? 0}</p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Resolved</p>
              <p className="mt-2 text-sm font-semibold">{stats.resolvedCount ?? 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Assigned officers</CardTitle>
        </CardHeader>
        <CardContent>
          {officers.length === 0 ? (
            <EmptyState title="No officers assigned" description="Add officers to this department to start handling complaints." />
          ) : (
            <div className="space-y-3">
              {officers.map((officer) => (
                <div key={officer._id} className="rounded-lg border border-border p-4">
                  <p className="font-medium">{officer.name}</p>
                  <p className="text-sm text-muted-foreground">{officer.email}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span>{officer.phone || "No phone"}</span>
                    <span>Resolved {officer.resolvedCount ?? 0}</span>
                    <span>Active {officer.activeCount ?? 0}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
