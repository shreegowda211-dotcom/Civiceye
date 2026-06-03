import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { STATUS_FLOW } from "@/config/constants.js";

export default function StatusUpdateDialog({ open, onOpenChange, current, onSubmit }) {
  const next = STATUS_FLOW[Math.min(STATUS_FLOW.indexOf(current) + 1, STATUS_FLOW.length - 1)];
  const [status, setStatus] = useState(next);
  const [remarks, setRemarks] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Update Status</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">New status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {[...STATUS_FLOW, 'rejected'].map((s) => (
                  <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-2 block">Remarks</Label>
            <Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Add a remark about this update…" rows={4} />
          </div>
          <p className="text-xs text-muted-foreground">For "Resolved", upload resolution proof from the complaint page.</p>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => { onSubmit({ status, remarks }); onOpenChange(false); }}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
