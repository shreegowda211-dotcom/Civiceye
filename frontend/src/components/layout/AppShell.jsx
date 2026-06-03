import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import { useState } from "react";

export default function AppShell() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen flex w-full bg-background text-foreground">
      <Sidebar mobileOpen={open} onClose={() => setOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        <Topbar onMenu={() => setOpen(true)} />
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
