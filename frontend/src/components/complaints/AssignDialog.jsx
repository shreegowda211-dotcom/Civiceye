import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { departmentService } from "@/api/departmentService.js";
import { officerService } from "@/api/officerService.js";

/**
 * Complaint Assignment dialog
 *   - Department Assignment
 *   - Officer Assignment (filtered by department)
 *   - Persists Assignment History via PATCH /api/complaints/:id/assign
 */
export default function AssignDialog({ open, onOpenChange, complaint, onSubmit }) {
  const [departments, setDepartments] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [deptId, setDeptId] = useState(complaint?.department?._id || "");
  const [officerId, setOfficerId] = useState(complaint?.assignedOfficer?._id || "");

  useEffect(() => { departmentService.list().then((r) => setDepartments(r.data)); }, []);
  useEffect(() => {
    if (deptId) officerService.list({ departmentId: deptId }).then((r) => setOfficers(r.data.filter((o) => o.department._id === deptId)));
    else setOfficers([]);
  }, [deptId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Assign complaint</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Department</Label>
            <Select value={deptId} onValueChange={(v) => { setDeptId(v); setOfficerId(""); }}>
              <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
              <SelectContent>
                {departments.map((d) => <SelectItem key={d._id} value={d._id}>{d.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-2 block">Officer (optional)</Label>
            <Select value={officerId} onValueChange={setOfficerId} disabled={!deptId}>
              <SelectTrigger><SelectValue placeholder="Auto-assign by workload" /></SelectTrigger>
              <SelectContent>
                {officers.map((o) => (
                  <SelectItem key={o._id} value={o._id}>{o.name} · {o.activeCount} open</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button disabled={!deptId} onClick={() => { onSubmit({ departmentId: deptId, officerId: officerId || null }); onOpenChange(false); }}>Assign</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
