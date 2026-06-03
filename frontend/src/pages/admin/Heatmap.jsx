import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/api/adminService.js";
import PageHeader from "@/components/common/PageHeader.jsx";
import Heatmap from "@/components/map/Heatmap.jsx";
import Loader from "@/components/common/Loader.jsx";
import { Card, CardContent } from "@/components/ui/card";

export default function HeatmapPage() {
  const { data, isLoading } = useQuery({ queryKey: ["heatmap"], queryFn: () => adminService.heatmap() });
  return (
    <div>
      <PageHeader title="Complaint Heatmap" description="Geographic intensity of complaints." />
      <Card><CardContent className="p-4">
        {isLoading ? <Loader /> : <Heatmap points={data?.data || []} />}
      </CardContent></Card>
    </div>
  );
}
