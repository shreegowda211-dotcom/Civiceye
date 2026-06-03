import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FileText, Users, UserCog, Building2, Clock, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { adminService } from "@/api/adminService.js";
import { officerService } from "@/api/officerService.js";
import { complaintService } from "@/api/complaintService.js";
import { useNotifications } from "@/context/NotificationContext.jsx";
import PageHeader from "@/components/common/PageHeader.jsx";
import StatCard from "@/components/charts/StatCard.jsx";
import Loader from "@/components/common/Loader.jsx";
import OfficerWorkload from "@/components/admin/OfficerWorkload.jsx";
import ComplaintCard from "@/components/complaints/ComplaintCard.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PIE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4", "#84cc16", "#ec4899"];

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const { activitySignal } = useNotifications();
  const { data: a, isLoading } = useQuery({ queryKey: ["analytics"], queryFn: () => adminService.analytics() });
  const { data: w } = useQuery({ queryKey: ["workload"], queryFn: () => officerService.workload() });
  const { data: recent } = useQuery({ queryKey: ["all-complaints"], queryFn: () => complaintService.list() });

  useEffect(() => {
    if (activitySignal) {
      queryClient.invalidateQueries({ queryKey: ["workload"] });
    }
  }, [activitySignal, queryClient]);

  if (isLoading || !a) return <Loader />;
  const t = a.data.totals;

  return (
    <div>
      <PageHeader title="Admin Dashboard" description="System-wide overview of complaints, officers and departments." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Complaints" value={t.complaints} icon={FileText} />
        <StatCard label="Pending" value={t.pending} icon={Clock} tone="warn" />
        <StatCard label="In Progress" value={t.inProgress} icon={AlertCircle} tone="info" />
        <StatCard label="Resolved" value={t.resolved} icon={CheckCircle2} tone="success" />
        <StatCard label="Rejected" value={t.rejected} icon={XCircle} tone="danger" />
        <StatCard label="Users" value={t.users} icon={Users} />
        <StatCard label="Officers" value={t.officers} icon={UserCog} />
        <StatCard label="Departments" value={t.departments} icon={Building2} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Complaints — last 14 days</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={a.data.trends}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={false} name="New" />
                <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} dot={false} name="Resolved" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">By category</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={a.data.byCategory} dataKey="count" nameKey="category" innerRadius={50} outerRadius={80}>
                  {a.data.byCategory.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">By department</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={a.data.byDepartment}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="department" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" name="Total" />
                <Bar dataKey="resolved" fill="#10b981" name="Resolved" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <OfficerWorkload data={w?.data || []} />
      </div>

      <h2 className="text-lg font-semibold mb-3">Recent complaints</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {((recent?.data ?? recent) || []).slice(0, 6).map((c) => <ComplaintCard key={c._id} complaint={c} basePath="/admin/complaints" />)}
      </div>
    </div>
  );
}
