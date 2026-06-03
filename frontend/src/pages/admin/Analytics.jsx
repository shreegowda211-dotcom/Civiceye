import { useQuery } from "@tanstack/react-query";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { adminService } from "@/api/adminService.js";
import PageHeader from "@/components/common/PageHeader.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/components/charts/StatCard.jsx";
import { Activity, TrendingUp, Timer } from "lucide-react";
import Loader from "@/components/common/Loader.jsx";

const PIE = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function Analytics() {
  const { data, isLoading } = useQuery({ queryKey: ["analytics"], queryFn: () => adminService.analytics() });
  if (isLoading || !data) return <Loader />;
  const a = data.data;

  return (
    <div>
      <PageHeader title="Analytics" description="System performance and complaint trends." />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Resolution rate" value={`${a.resolutionRate}%`} icon={TrendingUp} tone="success" />
        <StatCard label="Avg resolution time" value={`${a.avgResolutionHours}h`} icon={Timer} tone="info" />
        <StatCard label="Total complaints" value={a.totals.complaints} icon={Activity} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle className="text-base">Trends</CardTitle></CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer><LineChart data={a.trends}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip />
              <Line dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line dataKey="resolved" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart></ResponsiveContainer>
          </CardContent></Card>

        <Card><CardHeader><CardTitle className="text-base">Status distribution</CardTitle></CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer><PieChart>
              <Pie data={a.byStatus} dataKey="count" nameKey="status" innerRadius={60} outerRadius={100}>
                {a.byStatus.map((_, i) => <Cell key={i} fill={PIE[i % PIE.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart></ResponsiveContainer>
          </CardContent></Card>

        <Card className="lg:col-span-2"><CardHeader><CardTitle className="text-base">By department</CardTitle></CardHeader>
          <CardContent className="h-80 overflow-x-auto">
            <div className={`${a.byDepartment?.length > 4 ? "min-w-[800px]" : "w-full"}`}>
              <ResponsiveContainer width={a.byDepartment?.length > 4 ? 800 : "100%"} height={300}>
                <BarChart data={a.byDepartment}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="department" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" /><Bar dataKey="resolved" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent></Card>
      </div>
    </div>
  );
}
