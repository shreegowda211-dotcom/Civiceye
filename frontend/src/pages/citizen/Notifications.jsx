import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import PageHeader from "@/components/common/PageHeader.jsx";
import { useNotifications } from "@/context/NotificationContext.jsx";
import EmptyState from "@/components/common/EmptyState.jsx";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Notifications() {
  const { items, markRead, markAllRead, unread } = useNotifications();
  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title="Notifications"
        description={`${unread} unread`}
        actions={unread > 0 ? <Button variant="outline" onClick={markAllRead}>Mark all read</Button> : null}
      />
      {items.length === 0 ? <EmptyState icon={Bell} title="You're all caught up" /> : (
        <div className="space-y-2">
          {items.map((n) => (
            <Card key={n._id} className={cn("transition-colors", !n.read && "border-primary/40 bg-primary/5")}>
              <CardContent className="p-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium">{n.title}</p>
                  <p className="text-sm text-muted-foreground">{n.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  {n.link && <Button asChild size="sm" variant="ghost"><Link to={n.link} onClick={() => markRead(n._id)}>Open</Link></Button>}
                  {!n.read && <Button size="sm" variant="outline" onClick={() => markRead(n._id)}>Mark read</Button>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
