import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { complaintService } from "@/api/complaintService.js";
import PageHeader from "@/components/common/PageHeader.jsx";
import Loader from "@/components/common/Loader.jsx";
import StatusBadge from "@/components/common/StatusBadge.jsx";
import CategoryIcon, { categoryLabel } from "@/components/common/CategoryIcon.jsx";
import AssignDialog from "@/components/complaints/AssignDialog.jsx";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminComplaints() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["all-complaints"], queryFn: () => complaintService.list() });
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [assigning, setAssigning] = useState(null);

  const list = ((data?.data ?? data) || []).filter((c) => (status === "all" || c.status === status) && (!q || c.title.toLowerCase().includes(q.toLowerCase())));

  return (
    <div>
      <PageHeader title="All Complaints" description="Triage, assign, and monitor every complaint." />

      <Card className="mb-4"><CardContent className="p-4 flex flex-col sm:flex-row gap-3">
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
      </CardContent></Card>

      <Card><CardContent className="p-0">
        {isLoading ? <Loader /> : (
          <Table>
            <TableHeader><TableRow>
              <TableHead>Title</TableHead><TableHead>Category</TableHead><TableHead>Location</TableHead>
              <TableHead>Department</TableHead><TableHead>Status</TableHead><TableHead>Action</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {list.map((c) => (
                <TableRow key={c._id}>
                  <TableCell><Link to={`/admin/complaints/${c._id}`} className="font-medium hover:text-primary">{c.title}</Link></TableCell>
                  <TableCell><span className="inline-flex items-center gap-1.5 text-sm"><CategoryIcon category={c.category} className="size-3.5" /> {categoryLabel(c.category)}</span></TableCell>
                  <TableCell className="text-sm">{c.location?.city}</TableCell>
                  <TableCell className="text-sm">{c.department?.name || <span className="text-muted-foreground">—</span>}</TableCell>
                  <TableCell><StatusBadge status={c.status} /></TableCell>
                  <TableCell><Button size="sm" variant="outline" onClick={() => setAssigning(c)}>Assign</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent></Card>

      {assigning && (
        <AssignDialog
          open={!!assigning}
          onOpenChange={(v) => !v && setAssigning(null)}
          complaint={assigning}
          onSubmit={async (payload) => {
            await complaintService.assign(assigning._id, payload);
            toast.success("Assignment updated");
            qc.invalidateQueries({ queryKey: ["all-complaints"] });
          }}
        />
      )}
    </div>
  );
}
