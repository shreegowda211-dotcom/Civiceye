import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, MapPin, Building2, User, Upload } from "lucide-react";
import { toast } from "sonner";
import { complaintService } from "@/api/complaintService.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/common/StatusBadge.jsx";
import ComplaintTimeline from "@/components/complaints/ComplaintTimeline.jsx";
import StatusUpdateDialog from "@/components/complaints/StatusUpdateDialog.jsx";
import LocationPicker from "@/components/map/LocationPicker.jsx";
import Loader from "@/components/common/Loader.jsx";
import CategoryIcon, { categoryLabel } from "@/components/common/CategoryIcon.jsx";

export default function AdminComplaintDetail() {
  const { id } = useParams();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["complaint", id], queryFn: () => complaintService.get(id) });
  const [open, setOpen] = useState(false);

  if (isLoading) return <Loader />;
  const c = data?.data ?? data;
  if (!c) return <p>Not found</p>;
  const pin = c.location?.latitude ? [c.location.latitude, c.location.longitude] : null;

  const update = async (payload) => {
    await complaintService.updateStatus(c._id, payload);
    toast.success("Status updated");
    qc.invalidateQueries({ queryKey: ["complaint", id] });
    qc.invalidateQueries({ queryKey: ["all-complaints"] });
  };

  const uploadProof = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    await complaintService.uploadImages(c._id, files);
    toast.success("Resolution proof uploaded");
  };

  return (
    <div className="max-w-5xl mx-auto">
      <Button asChild variant="ghost" className="mb-4"><Link to="/admin/dashboard"><ArrowLeft className="size-4" /> Back to Dashboard</Link></Button>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CategoryIcon category={c.category} /><span>{categoryLabel(c.category)}</span>
                </div>
                <StatusBadge status={c.status} />
              </div>
              <h1 className="text-2xl font-bold mb-2">{c.title}</h1>
              <p className="text-muted-foreground">{c.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Button onClick={() => setOpen(true)}>Update status</Button>
                <label className="inline-flex items-center gap-2 cursor-pointer rounded-md border px-3 py-2 text-sm hover:bg-accent">
                  <Upload className="size-4" /> Upload resolution proof
                  <input type="file" multiple accept="image/*" className="hidden" onChange={uploadProof} />
                </label>
              </div>
            </CardContent>
          </Card>

          <Card><CardHeader><CardTitle className="text-base">Location</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2"><MapPin className="size-4" /> {c.location?.area}, {c.location?.city}</p>
              <LocationPicker value={pin} interactive={false} height={240} />
            </CardContent>
          </Card>

          <Card><CardHeader><CardTitle className="text-base">Timeline</CardTitle></CardHeader>
            <CardContent><ComplaintTimeline entries={c.timeline} /></CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card><CardContent className="p-5 space-y-3">
            <div><p className="text-xs text-muted-foreground">Citizen</p><p className="text-sm font-medium flex items-center gap-1.5"><User className="size-3.5" /> {c.citizen?.name}</p></div>
            <div><p className="text-xs text-muted-foreground">Department</p><p className="text-sm font-medium flex items-center gap-1.5"><Building2 className="size-3.5" /> {c.department?.name}</p></div>
            <div><p className="text-xs text-muted-foreground">Submitted</p><p className="text-sm">{new Date(c.createdAt).toLocaleString()}</p></div>
          </CardContent></Card>
        </div>
      </div>

      <StatusUpdateDialog open={open} onOpenChange={setOpen} current={c.status} onSubmit={update} />
    </div>
  );
}

