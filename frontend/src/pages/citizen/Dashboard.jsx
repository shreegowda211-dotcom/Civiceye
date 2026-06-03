import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FilePlus2, ListChecks, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { complaintService } from "@/api/complaintService.js";
import PageHeader from "@/components/common/PageHeader.jsx";
import StatCard from "@/components/charts/StatCard.jsx";
import ComplaintCard from "@/components/complaints/ComplaintCard.jsx";
import EmptyState from "@/components/common/EmptyState.jsx";
import Loader from "@/components/common/Loader.jsx";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext.jsx";

export default function CitizenDashboard() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({ queryKey: ["my-complaints"], queryFn: () => complaintService.mine() });
  const list = data?.data ?? data ?? [];
  const by = (s) => list.filter((c) => c.status === s).length;

  return (
    <div>
      <PageHeader
        title={`Welcome, ${user?.name?.split(" ")[0]}`}
        description="Your civic dashboard — track your reports and stay updated."
        actions={<Button asChild><Link to="/citizen/complaints/new"><FilePlus2 className="size-4" /> New Complaint</Link></Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total" value={list.length} icon={ListChecks} />
        <StatCard label="Pending" value={by("pending")} icon={Clock} tone="warn" />
        <StatCard label="In Progress" value={by("in_progress")} icon={AlertCircle} tone="info" />
        <StatCard label="Resolved" value={by("resolved")} icon={CheckCircle2} tone="success" />
      </div>

      <h2 className="text-lg font-semibold mb-3">Recent complaints</h2>
      {isLoading ? <Loader /> : list.length === 0 ? (
        <EmptyState
          title="No complaints yet"
          description="Tap New Complaint to report your first civic issue."
          action={<Button asChild><Link to="/citizen/complaints/new">Create one</Link></Button>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.slice(0, 6).map((c) => <ComplaintCard key={c._id} complaint={c} />)}
        </div>
      )}
    </div>
  );
}
