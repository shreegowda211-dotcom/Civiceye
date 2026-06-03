import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Search, FilePlus2 } from "lucide-react";
import { complaintService } from "@/api/complaintService.js";
import PageHeader from "@/components/common/PageHeader.jsx";
import ComplaintCard from "@/components/complaints/ComplaintCard.jsx";
import Loader from "@/components/common/Loader.jsx";
import EmptyState from "@/components/common/EmptyState.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function MyComplaints() {
  const { data, isLoading } = useQuery({ queryKey: ["my-complaints"], queryFn: () => complaintService.mine() });
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  const list = ((data?.data ?? data) || []).filter((c) => {
    if (status !== "all" && c.status !== status) return false;
    if (q && !c.title.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <PageHeader
        title="My Complaints"
        description="Every report you've made and its current state."
        actions={<Button asChild><Link to="/citizen/complaints/new"><FilePlus2 className="size-4" /> New</Link></Button>}
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by title…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            {["all", "pending", "assigned", "in_progress", "resolved", "rejected"].map((s) => (
              <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? <Loader /> : list.length === 0 ? (
        <EmptyState title="No complaints match" description="Try a different filter or create a new complaint." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((c) => <ComplaintCard key={c._id} complaint={c} />)}
        </div>
      )}
    </div>
  );
}
