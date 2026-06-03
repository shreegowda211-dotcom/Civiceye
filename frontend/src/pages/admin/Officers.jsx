import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { officerService } from "@/api/officerService.js";
import { departmentService } from "@/api/departmentService.js";
import { useNotifications } from "@/context/NotificationContext.jsx";
import PageHeader from "@/components/common/PageHeader.jsx";
import Loader from "@/components/common/Loader.jsx";
import OfficerWorkload from "@/components/admin/OfficerWorkload.jsx";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  departmentId: "",
};

export default function Officers() {
  const qc = useQueryClient();
  const { activitySignal } = useNotifications();
  const { data, isLoading } = useQuery({ queryKey: ["officers"], queryFn: () => officerService.list() });
  const { data: w } = useQuery({ queryKey: ["workload"], queryFn: () => officerService.workload() });
  const { data: departmentsData, isLoading: isDepartmentsLoading } = useQuery({ queryKey: ["departments"], queryFn: () => departmentService.list() });

  useEffect(() => {
    if (activitySignal) {
      qc.invalidateQueries({ queryKey: ["workload"] });
      qc.invalidateQueries({ queryKey: ["officers"] });
    }
  }, [activitySignal, qc]);

  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const list = (data?.data || []).filter((o) => !q || o.name.toLowerCase().includes(q.toLowerCase()));
  const departments = departmentsData?.data || [];

  const resetForm = () => setForm(initialForm);

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.password || !form.departmentId) {
      toast.error("Please complete all required fields.");
      return;
    }
    setSaving(true);
    try {
      await officerService.create(form);
      toast.success("Officer added successfully.");
      qc.invalidateQueries({ queryKey: ["officers"] });
      qc.invalidateQueries({ queryKey: ["workload"] });
      setOpen(false);
      resetForm();
    } catch (err) {
      toast.error(err.message || "Unable to add officer.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title="Officers" description="Manage department officers and view performance." actions={<Button onClick={() => setOpen(true)}>+ Add Officer</Button>} />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Input placeholder="Search officers…" value={q} onChange={(e) => setQ(e.target.value)} />
          <Card><CardContent className="p-0">
            {isLoading ? <Loader /> : (
              <Table>
                <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Department</TableHead><TableHead>Active</TableHead><TableHead>Resolved</TableHead><TableHead>Rating</TableHead></TableRow></TableHeader>
                <TableBody>
                  {list.map((o) => (
                    <TableRow key={o._id}>
                      <TableCell>
                        <p className="font-medium">{o.name}</p>
                        <p className="text-xs text-muted-foreground">{o.email}</p>
                      </TableCell>
                      <TableCell>{o.department?.name || "Unassigned"}</TableCell>
                      <TableCell>{o.activeCount}</TableCell>
                      <TableCell>{o.resolvedCount}</TableCell>
                      <TableCell><span className="inline-flex items-center gap-1"><Star className="size-3.5 fill-amber-400 text-amber-400" /> {o.rating}</span></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent></Card>
        </div>
        <OfficerWorkload data={w?.data || []} />
      </div>

      <Dialog open={open} onOpenChange={(value) => { setOpen(value); if (!value) resetForm(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Officer</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Officer full name" />
            </div>
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} placeholder="officer@domain.com" />
            </div>
            <div className="grid gap-2">
              <Label>Phone</Label>
              <Input type="tel" value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} placeholder="+91 90000 00000" />
            </div>
            <div className="grid gap-2">
              <Label>Password</Label>
              <Input type="password" value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} placeholder="Minimum 4 characters" />
            </div>
            <div className="grid gap-2">
              <Label>Department</Label>
              <Select value={form.departmentId} onValueChange={(value) => setForm((prev) => ({ ...prev, departmentId: value }))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={isDepartmentsLoading ? "Loading departments…" : "Select department"} />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d._id} value={d._id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="mt-4 gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>Cancel</Button>
            <Button onClick={handleCreate} disabled={saving || !form.name || !form.email || !form.password || !form.departmentId}>
              {saving ? "Saving…" : "Create Officer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
