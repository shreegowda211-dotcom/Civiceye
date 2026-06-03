import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MapPin, Building2, User } from "lucide-react";
import { complaintService } from "@/api/complaintService.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/common/StatusBadge.jsx";
import ComplaintTimeline from "@/components/complaints/ComplaintTimeline.jsx";
import LocationPicker from "@/components/map/LocationPicker.jsx";
import Loader from "@/components/common/Loader.jsx";
import CategoryIcon, { categoryLabel } from "@/components/common/CategoryIcon.jsx";

export default function ComplaintDetail() {
  const { id } = useParams();
  const { data, isLoading } = useQuery({ queryKey: ["complaint", id], queryFn: () => complaintService.get(id) });
  if (isLoading) return <Loader />;
  const c = data?.data ?? data;
  if (!c) return <p>Not found</p>;
  const pin = c.location?.latitude ? [c.location.latitude, c.location.longitude] : null;

  return (
    <div className="max-w-5xl mx-auto">
      <Button asChild variant="ghost" className="mb-4"><Link to="/citizen/complaints"><ArrowLeft className="size-4" /> Back</Link></Button>

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

              {c.images?.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
                  {c.images.map((src, i) => <img key={i} src={src} alt="" className="aspect-video object-cover rounded-md border border-border" />)}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Location</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2"><MapPin className="size-4" /> {c.location?.area}, {c.location?.city}, {c.location?.state}</p>
              <LocationPicker value={pin} interactive={false} height={260} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Complaint history</CardTitle></CardHeader>
            <CardContent><ComplaintTimeline entries={c.timeline} /></CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-5 space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Submitted</p>
                <p className="text-sm font-medium">{new Date(c.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Building2 className="size-3.5" /> Department</p>
                <p className="text-sm font-medium">{c.department?.name || "Awaiting assignment"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5"><User className="size-3.5" /> Officer</p>
                <p className="text-sm font-medium">{c.assignedOfficer?.name || "—"}</p>
              </div>
            </CardContent>
          </Card>

          {c.resolutionImages?.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Resolution proof</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {c.resolutionImages.map((src, i) => <img key={i} src={src} alt="" className="rounded-md border border-border" />)}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
