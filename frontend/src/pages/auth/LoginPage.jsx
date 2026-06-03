import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext.jsx";
import { ROLE_HOME } from "@/config/navigation.js";

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("rakshithadml74@gmail.com");
  const [password, setPassword] = useState("demo1234");
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (user) navigate(ROLE_HOME[user.role] || "/", { replace: true }); }, [user, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const u = await login({ email, password });
      toast.success(`Welcome, ${u.name}`);
      navigate(ROLE_HOME[u.role] || "/", { replace: true });
    } catch (err) {
      toast.error(err.message || "Login failed");
    } finally { setLoading(false); }
  };

  const quick = (e, p) => { setEmail(e); setPassword(p); };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-background">
      <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
        <div className="flex items-center gap-2">
          <div className="size-10 rounded-lg bg-background/15 grid place-items-center"><Eye className="size-5" /></div>
          <span className="text-xl font-bold tracking-tight">CivicEye</span>
        </div>
        <div>
          <h1 className="text-4xl font-bold leading-tight">Report. Track. Resolve.</h1>
          <p className="mt-4 text-primary-foreground/80 max-w-md">A modern civic complaint platform connecting citizens, officers, and city administrators in real time.</p>
        </div>
        <p className="text-xs text-primary-foreground/60">© CivicEye {new Date().getFullYear()}</p>
      </div>

      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-1">Sign in</h2>
            <p className="text-sm text-muted-foreground mb-6">Use the demo accounts below or your own credentials.</p>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="mb-2 block">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot?</Link>
                </div>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</Button>
            </form>

            <div className="mt-6 grid grid-cols-3 gap-2 text-xs">
              <button type="button" onClick={() => quick("rakshithadml74@gmail.com", "demo1234")} className="border rounded-md p-2 hover:bg-accent">Citizen</button>
              <button type="button" onClick={() => quick("rakshithasr990@gmail.com", "demo1234")} className="border rounded-md p-2 hover:bg-accent">Officer</button>
              <button type="button" onClick={() => quick("shreegowda211@gmail.com", "demo1234")} className="border rounded-md p-2 hover:bg-accent">Admin</button>
            </div>

            <p className="text-sm text-center text-muted-foreground mt-6">
              No account? <Link to="/register" className="text-primary hover:underline">Register</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
