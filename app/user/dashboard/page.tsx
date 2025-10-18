import ChartSection from "@/components/dashboard/ChartSection";
import BestSellingItems from "@/components/dashboard/BestSellingItems";
import { PageTitle } from "@/components/common/text";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageTitle>Dashboard</PageTitle>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex lg:flex-row flex-col gap-6">
          <ChartSection />
          <BestSellingItems />
        </div>
      </div>
    </div>
  );
}
