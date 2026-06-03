import { useQuery } from "@tanstack/react-query";
import { ClipboardList, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { complaintService } from "@/api/complaintService.js";
import PageHeader from "@/components/common/PageHeader.jsx";
import StatCard from "@/components/charts/StatCard.jsx";
import ComplaintCard from "@/components/complaints/ComplaintCard.jsx";
import Loader from "@/components/common/Loader.jsx";
import EmptyState from "@/components/common/EmptyState.jsx";
import { useAuth } from "@/context/AuthContext.jsx";

export default function OfficerDashboard() {
  const { user } = useAuth();
  const departmentId = user?.department?._id ?? user?.department;
  const { data, isLoading } = useQuery({
    queryKey: ["officer-complaints", departmentId],
    queryFn: () => complaintService.byDepartment(departmentId),
    enabled: Boolean(departmentId),
  });
  const list = (data?.data || []).filter((c) => c.assignedOfficer?.name === user?.name || true);
  const by = (s) => list.filter((c) => c.status === s).length;

  return (
    <div>
      <PageHeader title={`Welcome, Officer ${user?.name?.split(" ")[0]}`} description={`${user?.department?.name || "Department"} — your active assignments`} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Assigned" value={list.length} icon={ClipboardList} />
        <StatCard label="Pending" value={by("pending")} icon={Clock} tone="warn" />
        <StatCard label="In Progress" value={by("in_progress")} icon={AlertCircle} tone="info" />
        <StatCard label="Resolved" value={by("resolved")} icon={CheckCircle2} tone="success" />
      </div>

      <h2 className="text-lg font-semibold mb-3">Recent assignments</h2>
      {isLoading ? <Loader /> : list.length === 0 ? <EmptyState title="No complaints assigned" /> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.slice(0, 6).map((c) => <ComplaintCard key={c._id} complaint={c} basePath="/officer/complaints" />)}
        </div>
      )}
    </div>
  );
}
