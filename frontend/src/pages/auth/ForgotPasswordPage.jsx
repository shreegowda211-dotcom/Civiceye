import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { authService } from "@/api/authService.js";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const onSubmit = async (e) => {
    e.preventDefault();
    await authService.forgotPassword(email);
    setSent(true);
    toast.success("If the email exists, a reset link has been sent.");
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-1">Forgot password</h2>
          <p className="text-sm text-muted-foreground mb-6">Enter your email to receive a reset link.</p>
          {sent ? (
            <p className="text-sm">Check your inbox for instructions.</p>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div><Label className="mb-2 block">Email</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
              <Button type="submit" className="w-full">Send reset link</Button>
            </form>
          )}
          <p className="text-sm text-center text-muted-foreground mt-6">
            <Link to="/login" className="text-primary hover:underline">Back to sign in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
