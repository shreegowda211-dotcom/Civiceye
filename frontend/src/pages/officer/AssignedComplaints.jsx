import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { complaintService } from "@/api/complaintService.js";
import PageHeader from "@/components/common/PageHeader.jsx";
import ComplaintCard from "@/components/complaints/ComplaintCard.jsx";
import Loader from "@/components/common/Loader.jsx";
import EmptyState from "@/components/common/EmptyState.jsx";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext.jsx";

export default function AssignedComplaints() {
  const { user } = useAuth();
  const departmentId = user?.department?._id ?? user?.department;
  const { data, isLoading } = useQuery({
    queryKey: ["officer-complaints", departmentId],
    queryFn: () => complaintService.byDepartment(departmentId),
    enabled: Boolean(departmentId),
  });
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const list = ((data?.data ?? data) || []).filter((c) => (status === "all" || c.status === status) && (!q || c.title.toLowerCase().includes(q.toLowerCase())));

  return (
    <div>
      <PageHeader title="Assigned Complaints" description="All complaints routed to your department." />
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            {["all", "pending", "assigned", "in_progress", "resolved", "rejected"].map((s) => <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      {isLoading ? <Loader /> : list.length === 0 ? <EmptyState title="No matches" /> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((c) => <ComplaintCard key={c._id} complaint={c} basePath="/officer/complaints" />)}
        </div>
      )}
    </div>
  );
}
