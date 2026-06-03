import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext.jsx";
import { ROLE_HOME } from "@/config/navigation.js";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const u = await register({ ...form, role: "citizen" });
      toast.success("Account created");
      navigate(ROLE_HOME[u.role], { replace: true });
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally { setLoading(false); }
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-1">Create your account</h2>
          <p className="text-sm text-muted-foreground mb-6">Register as a citizen to report civic issues.</p>
          <form onSubmit={onSubmit} className="space-y-4">
            <div><Label className="mb-2 block">Full name</Label><Input required value={form.name} onChange={set("name")} /></div>
            <div><Label className="mb-2 block">Email</Label><Input type="email" required value={form.email} onChange={set("email")} /></div>
            <div><Label className="mb-2 block">Phone</Label><Input value={form.phone} onChange={set("phone")} /></div>
            <div><Label className="mb-2 block">Password</Label><Input type="password" required value={form.password} onChange={set("password")} /></div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Creating…" : "Register"}</Button>
          </form>
          <p className="text-sm text-center text-muted-foreground mt-6">
            Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
