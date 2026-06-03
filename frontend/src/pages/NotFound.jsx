import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center bg-background p-6 text-center">
      <div>
        <h1 className="text-7xl font-bold">404</h1>
        <p className="mt-2 text-muted-foreground">This page doesn't exist.</p>
        <Button asChild className="mt-6"><Link to="/">Go home</Link></Button>
      </div>
    </div>
  );
}
