import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/api/adminService.js";
import { useNotifications } from "@/context/NotificationContext.jsx";
import PageHeader from "@/components/common/PageHeader.jsx";
import Loader from "@/components/common/Loader.jsx";
import EmptyState from "@/components/common/EmptyState.jsx";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity } from "lucide-react";

const ROLE_OPTIONS = ["all", "citizen", "officer"];
const ACTION_OPTIONS = [
  "all",
  "user_registered",
  "complaint_created",
  "complaint_updated",
  "complaint_assigned",
  "complaint_resolved",
  "status_changed",
  "profile_updated",
  "login",
  "logout",
];

export default function Activities() {
  const [role, setRole] = useState("all");
  const [action, setAction] = useState("all");
  const [q, setQ] = useState("");

  const activityQuery = useQuery({
    queryKey: ["activities", role, action, q],
    queryFn: async () => {
      const response = await adminService.activities({ role: role === "all" ? undefined : role, action: action === "all" ? undefined : action, q });
      if (Array.isArray(response)) return response;
      return response?.data ?? [];
    },
  });
  const { data: activities = [], isLoading, isError, error, refetch } = activityQuery;
  const { activitySignal } = useNotifications();

  useEffect(() => {
    if (activitySignal) {
      refetch();
    }
  }, [activitySignal, refetch]);

  return (
    <div>
      <PageHeader title="Activity Feed" description="Track citizen and officer activity in one place." />

      <Card className="mb-4"><CardContent className="p-4 grid gap-3 md:grid-cols-3">
        <Input placeholder="Search by user, action, or complaint" value={q} onChange={(e) => setQ(e.target.value)} />
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>{ROLE_OPTIONS.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={action} onValueChange={setAction}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>{ACTION_OPTIONS.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
        </Select>
      </CardContent></Card>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <Loader />
          ) : isError ? (
            <EmptyState
              icon={Activity}
              title="Unable to load activity"
              description={error?.message || "There was an issue loading activity. Please try again."}
            />
          ) : activities.length === 0 ? (
            <EmptyState icon={Activity} title="No activity yet" description="No citizen or officer actions were found for these filters." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>When</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                    <TableCell className="font-medium">{item.userName}</TableCell>
                    <TableCell className="capitalize">{item.userRole || "Unknown"}</TableCell>
                    <TableCell className="capitalize">{item.action ? item.action.replace(/_/g, " ") : "Unknown action"}</TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {item.message}
                        {item.target && <span className="block mt-1">Target: {item.target}</span>}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
