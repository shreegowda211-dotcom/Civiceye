import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageHeader from "@/components/common/PageHeader.jsx";
import LocationPicker from "@/components/map/LocationPicker.jsx";
import { COMPLAINT_CATEGORIES } from "@/config/constants.js";
import { locationService } from "@/api/locationService.js";
import { complaintService } from "@/api/complaintService.js";
import { useGeolocation } from "@/hooks/useGeolocation.js";
import { useAuth } from "@/context/AuthContext.jsx";

export default function NewComplaint() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const geo = useGeolocation();
  const [form, setForm] = useState({ title: "", description: "", category: "", state: "", city: "", area: "" });
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [pin, setPin] = useState(null);
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: typeof v === "string" ? v : v.target.value }));

  useEffect(() => { locationService.states("IN").then((r) => setStates(r.data)); }, []);
  useEffect(() => {
    if (form.state) locationService.cities("IN", form.state).then((r) => setCities(r.data));
    else setCities([]);
  }, [form.state]);

  const detectGPS = async () => {
    const c = await geo.detect();
    if (!c) {
      toast.info("Location permission denied. Please select manually below.");
      return;
    }
    setPin([c.latitude, c.longitude]);
    const rev = await locationService.reverseGeocode(c.latitude, c.longitude);
    if (rev?.data) {
      setForm((f) => ({ ...f, area: rev.data.area || f.area, city: rev.data.city || f.city }));
      toast.success("Location detected");
    }
  };

  const addFiles = (e) => {
    const list = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...list].slice(0, 5));
  };

  const removeFile = (i) => setFiles((arr) => arr.filter((_, idx) => idx !== i));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category) return toast.error("Title and category required");
    setSubmitting(true);
    try {
      if (!user?.email) {
        toast.error("Please log in before submitting a complaint.");
        return;
      }

      const stateName = states.find((s) => s.iso2 === form.state)?.name || form.state;
      const res = await complaintService.create({
        ...form,
        state: stateName,
        location: {
          state: stateName,
          city: form.city,
          area: form.area,
          latitude: pin?.[0] || null,
          longitude: pin?.[1] || null,
          gps: !!pin && !geo.denied,
        },
        citizen: { _id: user._id, name: user.name, email: user.email },
      });
      const complaintId = res?.data?._id || res?._id;
      toast.success("Complaint submitted");
      navigate(`/citizen/complaints/${complaintId}`);
    } catch (err) {
      toast.error(err.message || "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Report a civic issue" description="Help your city stay clean, safe, and functional." />

      <form onSubmit={onSubmit} className="space-y-6">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div><Label className="mb-2 block">Title *</Label><Input value={form.title} onChange={set("title")} placeholder="e.g. Large pothole on 5th Cross" required /></div>
            <div>
              <Label className="mb-2 block">Category *</Label>
              <Select value={form.category} onValueChange={set("category")}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {COMPLAINT_CATEGORIES.map((c) => <SelectItem key={c.key} value={c.key}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label className="mb-2 block">Description</Label><Textarea rows={4} value={form.description} onChange={set("description")} placeholder="Describe the issue clearly…" /></div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Location</h3>
                <p className="text-xs text-muted-foreground">GPS is optional — manual entry works if you decline permission.</p>
              </div>
              <Button type="button" variant="outline" onClick={detectGPS} disabled={geo.loading}>
                {geo.loading ? <Loader2 className="size-4 animate-spin" /> : <MapPin className="size-4" />}
                Use my location
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <Label className="mb-2 block">State</Label>
                <Select value={form.state} onValueChange={set("state")}>
                  <SelectTrigger><SelectValue placeholder="State" /></SelectTrigger>
                  <SelectContent>{states.map((s) => <SelectItem key={s.iso2} value={s.iso2}>{s.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-2 block">City</Label>
                <Select value={form.city} onValueChange={set("city")} disabled={!form.state}>
                  <SelectTrigger><SelectValue placeholder="City" /></SelectTrigger>
                  <SelectContent>{cities.map((c) => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label className="mb-2 block">Area / locality</Label><Input value={form.area} onChange={set("area")} placeholder="e.g. Indiranagar" /></div>
            </div>

            <div>
              <Label className="mb-2 block">Pin on map (optional)</Label>
              <LocationPicker value={pin} onChange={setPin} />
              {pin && <p className="text-xs text-muted-foreground mt-1">{pin[0].toFixed(5)}, {pin[1].toFixed(5)}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-3">
            <Label className="block">Photos (up to 5)</Label>
            <label className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-accent/50">
              <Upload className="size-5 mb-2 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Click to upload images</span>
              <input type="file" multiple accept="image/*" className="hidden" onChange={addFiles} />
            </label>
            {files.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {files.map((f, i) => (
                  <div key={i} className="relative aspect-square rounded-md overflow-hidden border border-border">
                    <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeFile(i)} className="absolute top-1 right-1 size-6 rounded-full bg-black/60 text-white grid place-items-center">
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
          <Button type="submit" disabled={submitting}>{submitting ? "Submitting…" : "Submit complaint"}</Button>
        </div>
      </form>
    </div>
  );
}
