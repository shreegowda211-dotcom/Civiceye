import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/api/adminService.js";
import PageHeader from "@/components/common/PageHeader.jsx";
import Loader from "@/components/common/Loader.jsx";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import UserEditDialog from "./UserEditDialog";

export default function Users() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["users"], queryFn: () => adminService.users() });
  const [q, setQ] = useState("");
  const [role, setRole] = useState("all");
  const [editingUser, setEditingUser] = useState(null);
  
  const list = (data?.data || []).filter((u) => (role === "all" || u.role === role) && (!q || u.name.toLowerCase().includes(q.toLowerCase())));

  const handleEditSuccess = () => {
    qc.invalidateQueries({ queryKey: ["users"] });
    setEditingUser(null);
  };

  return (
    <div>
      <PageHeader title="Users" description="Citizens, officers and admins of the system." />
      <Card className="mb-4"><CardContent className="p-4 flex gap-3">
        <Input placeholder="Search users…" value={q} onChange={(e) => setQ(e.target.value)} />
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>{["all", "citizen", "officer", "admin"].map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
        </Select>
      </CardContent></Card>
      <Card><CardContent className="p-0">
        {isLoading ? <Loader /> : (
          <Table>
            <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Phone</TableHead><TableHead>Role</TableHead><TableHead></TableHead></TableRow></TableHeader>
            <TableBody>
              {list.map((u) => (
                <TableRow key={u._id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.phone}</TableCell>
                  <TableCell className="capitalize">{u.role}</TableCell>
                  <TableCell><Button size="sm" variant="outline" onClick={() => setEditingUser(u)}>Edit</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent></Card>

      {editingUser && (
        <UserEditDialog
          open={!!editingUser}
          onOpenChange={(v) => !v && setEditingUser(null)}
          user={editingUser}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}
