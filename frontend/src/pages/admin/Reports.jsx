import { useState } from "react";
import PageHeader from "@/components/common/PageHeader.jsx";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { adminService } from "@/api/adminService.js";

const REPORTS = [
  { type: "complaints",  label: "Complaints report",  description: "All complaints with status, dept and resolution time." },
  { type: "officers",    label: "Officer performance", description: "Per-officer assignments, resolutions and rating." },
  { type: "departments", label: "Department report",  description: "Volume, SLA adherence, resolution rates by dept." },
];

// Convert data to CSV format
function convertToCSV(data, type) {
  if (!data || data.length === 0) return "";

  let headers = [];
  let rows = [];

  if (type === "complaints") {
    headers = ["ID", "Title", "Category", "Status", "Department", "Location", "Created"];
    rows = data.map((c) => [
      c._id,
      c.title,
      c.category,
      c.status,
      c.department?.name || "Unassigned",
      c.location?.city || "",
      new Date(c.createdAt).toLocaleDateString(),
    ]);
  } else if (type === "officers") {
    headers = ["ID", "Name", "Email", "Phone"];
    rows = data.map((o) => [o._id, o.name, o.email, o.phone || ""]);
  } else if (type === "departments") {
    headers = ["ID", "Name"];
    rows = data.map((d) => [d._id, d.name]);
  }

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row
        .map((cell) => {
          // Escape quotes and wrap in quotes if contains comma or newline
          const str = String(cell || "");
          return str.includes(",") || str.includes('"') || str.includes("\n")
            ? `"${str.replace(/"/g, '""')}"`
            : str;
        })
        .join(",")
    ),
  ].join("\n");

  return csvContent;
}

// Trigger file download
function downloadCSV(csvContent, filename) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function Reports() {
  const [loading, setLoading] = useState({});

  const handleDownload = async (type) => {
    setLoading((prev) => ({ ...prev, [type]: true }));
    try {
      const response = await adminService.reports({ type });
      const csvContent = convertToCSV(response.data, type);
      const filename = `${type}-report-${new Date().toISOString().slice(0, 10)}.csv`;
      downloadCSV(csvContent, filename);
      toast.success(`${type} report downloaded successfully`);
    } catch (error) {
      toast.error(`Failed to download ${type} report`);
      console.error(error);
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  return (
    <div>
      <PageHeader title="Reports" description="Generate and download CSV reports." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {REPORTS.map((r) => (
          <Card key={r.type}>
            <CardContent className="p-5">
              <h3 className="font-semibold">{r.label}</h3>
              <p className="text-sm text-muted-foreground mt-1">{r.description}</p>
              <Button
                className="mt-4 w-full"
                variant="outline"
                onClick={() => handleDownload(r.type)}
                disabled={loading[r.type]}
              >
                <Download className="size-4" /> {loading[r.type] ? "Downloading..." : "Download CSV"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
