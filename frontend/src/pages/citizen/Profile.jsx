import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PageHeader from "@/components/common/PageHeader.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import { authService } from "@/api/authService.js";

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "", email: user?.email || "" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    await authService.updateProfile(form);
    updateUser(form);
    toast.success("Profile updated");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="Profile" description="Manage your account information." />
      <Card>
        <CardContent className="p-6">
          <form onSubmit={save} className="space-y-4">
            <div className="flex items-center gap-4 mb-2">
              <div className="size-16 rounded-full bg-primary text-primary-foreground grid place-items-center text-2xl font-bold">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-semibold">{user?.name}</p>
                <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </div>
            <div><Label className="mb-2 block">Name</Label><Input value={form.name} onChange={set("name")} /></div>
            <div><Label className="mb-2 block">Phone</Label><Input value={form.phone} onChange={set("phone")} /></div>
            <div><Label className="mb-2 block">Email</Label><Input value={form.email} disabled /></div>
            <div className="flex justify-between pt-2">
              <Button type="button" variant="outline" onClick={logout}>Log out</Button>
              <Button type="submit">Save changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
