import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorState({ title = "Something went wrong", message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="size-14 rounded-2xl bg-destructive/10 text-destructive grid place-items-center mb-4">
        <AlertTriangle className="size-7" />
      </div>
      <p className="font-medium">{title}</p>
      {message && <p className="text-sm text-muted-foreground mt-1 max-w-sm">{message}</p>}
      {onRetry && <Button className="mt-4" variant="outline" onClick={onRetry}>Try again</Button>}
    </div>
  );
}
