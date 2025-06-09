import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { getDashboard } from "../../services/requestSppbService";

interface DashboardDetail {
  countAsst: number;
  countAskep: number;
  countEh: number;
  countPgs: number;
  countGD: number;
  total: number;
}

interface DistrictData {
  districtName: string;
  districtCode: string;
  getDashboardDetailRes: DashboardDetail;
}

export default function Home() {
  const [dashboardData, setDashboardData] = useState<DistrictData[]>([]);
  const token = localStorage.getItem("userToken");

  const fetchData = async () => {
    if (!token) return;

    try {
      const response = await getDashboard(token);

      setDashboardData(response.data);
    } catch (error) {
      console.error("Error fetching SPPB detail:", error);
    }
  };

  useEffect(() => {
    fetchData();
    // Ganti URL ini dengan URL API kamu yang sebenarnya
  }, []);

  return (
    <>
      <PageMeta title="Dashboard" description="Home Dashboard Page" />
      <PageBreadcrumb pageTitle="Dashboard" />

      <div className="border rounded-2xl bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-7 gap-1 font-bold text-white text-center">
            <div className="col-span-1"></div>
            <div className="bg-blue-900 py-1">ASST</div>
            <div className="bg-blue-900 py-1">ASKEP</div>
            <div className="bg-blue-900 py-1">EH</div>
            <div className="bg-blue-900 py-1">PGS</div>
            <div className="bg-blue-900 py-1">GD</div>
            <div className="bg-blue-900 py-1">Total</div>
          </div>

          {dashboardData.map((item) => (
            <div
              key={item.districtCode}
              className="grid grid-cols-7 gap-1 text-center text-gray-800 dark:text-white/90"
            >
              <div className="border py-1 font-bold">{item.districtName}</div>
              <div className="border py-1">
                {item.getDashboardDetailRes.countAsst}
              </div>
              <div className="border py-1">
                {item.getDashboardDetailRes.countAskep}
              </div>
              <div className="border py-1">
                {item.getDashboardDetailRes.countEh}
              </div>
              <div className="border py-1">
                {item.getDashboardDetailRes.countPgs}
              </div>
              <div className="border py-1">
                {item.getDashboardDetailRes.countGD}
              </div>
              <div className="border py-1">
                {item.getDashboardDetailRes.total-1}
              </div>
            </div>
          ))}

          <div className="flex flex-wrap items-start gap-5 mt-7 text-base">
            {/* Tabel Status */}
            <div className="border text-base">
              <div className="grid grid-cols-4 font-bold text-center bg-gray-100 border-b">
                <div className="px-2 py-1">Status</div>
                <div className="px-4 py-1">A</div>
                <div className="px-4 py-1">G</div>
                <div className="px-4 py-1">T</div>
              </div>
              <div className="grid grid-cols-4 text-center border-b">
                <div className="bg-blue-100 px-2 font-semibold">Waiting</div>
                <div className="px-4 py-1 text-gray-800 dark:text-white/90">
                  2
                </div>
                <div className="px-4 py-1 text-gray-800 dark:text-white/90">
                  1
                </div>
                <div className="px-4 py-1 text-gray-800 dark:text-white/90">
                  -
                </div>
              </div>
              <div className="grid grid-cols-4 h-fit text-center">
                <div className="bg-green-100 px-2 font-semibold">Finish</div>
                <div className="px-4 py-1 text-gray-800 dark:text-white/90">
                  8
                </div>
                <div className="px-4 py-1 text-gray-800 dark:text-white/90">
                  8
                </div>
                <div className="px-4 py-1 text-gray-800 dark:text-white/90">
                  8
                </div>
              </div>
            </div>

            {/* Keterangan */}
            <div className="flex flex-col gap-y-1 border p-2 text-gray-800 dark:text-white/90 leading-5 w-auto">
              <div>
                <strong>Keterangan:</strong>
              </div>
              <div>A: Kode Wilayah Kerja</div>
              <div>GD/G: Gudang</div>
              <div>T: Barang diterima</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
