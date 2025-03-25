import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  return (
    <>
      <PageMeta
        title="MediaSlot Portal"
        description="MediaSLOT Portal"
      />

      <div className="space-y-6 p-6">
        {/* Metrics Section - Full Width, One Per Row */}
        <div className="grid grid-cols-1 gap-4">
          <EcommerceMetrics />
        </div>

      </div>
    </>
  );
}
