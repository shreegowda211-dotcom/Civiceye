import { useEffect, useState } from "react";
import { toast } from "sonner";
import PageHeader from "@/components/common/PageHeader.jsx";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { adminService } from "@/api/adminService.js";

export default function Settings() {
  const [s, setS] = useState(null);
  useEffect(() => { adminService.getSettings().then((r) => setS(r.data)); }, []);
  if (!s) return null;
  const set = (k, v) => setS((x) => ({ ...x, [k]: v }));

  return (
    <div className="max-w-2xl">
      <PageHeader title="System Settings" />
      <Card><CardContent className="p-6 space-y-5">
        <div><Label className="mb-2 block">Site name</Label><Input value={s.siteName} onChange={(e) => set("siteName", e.target.value)} /></div>
        <div><Label className="mb-2 block">Support email</Label><Input value={s.supportEmail} onChange={(e) => set("supportEmail", e.target.value)} /></div>
        <div><Label className="mb-2 block">SLA (hours)</Label><Input type="number" value={s.slaHours} onChange={(e) => set("slaHours", Number(e.target.value))} /></div>
        <div className="flex items-center justify-between"><Label>Allow self-registration</Label><Switch checked={s.allowSelfRegistration} onCheckedChange={(v) => set("allowSelfRegistration", v)} /></div>
        <div className="flex items-center justify-between"><Label>AI auto-routing</Label><Switch checked={s.autoRoutingEnabled} onCheckedChange={(v) => set("autoRoutingEnabled", v)} /></div>
        <Button onClick={async () => { await adminService.updateSettings(s); toast.success("Settings saved"); }}>Save</Button>
      </CardContent></Card>
    </div>
  );
}
