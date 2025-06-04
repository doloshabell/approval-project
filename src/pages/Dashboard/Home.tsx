import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  return (
    <>
      <PageMeta title="Dashboard" description="Home Dashboard Page" />
      <PageBreadcrumb pageTitle="Dashboard" />
      <div className="rounded-2xl bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-6 gap-1">
            <div></div>
            {["A", "B", "C", "D", "E"].map((code) => (
              <div
                key={code}
                className="bg-blue-900 text-white font-bold py-1 rounded text-center"
              >
                {code}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-6 gap-1">
            <div></div>
            {[3, 3, 1, 4, 5].map((val, i) => (
              <div key={i} className="border py-1 text-center text-gray-800 dark:text-white/90">
                {val}
              </div>
            ))}
          </div>

          {["ASST", "ASKEP", "EH", "PGS", "GD", "T"].map((label, rowIdx) => (
            <div key={label} className="grid grid-cols-6 gap-1">
              <div className="border py-1 text-center font-bold text-gray-800 dark:text-white/90">{label}</div>
              {[
                ["-", "-", "-", "-", "-"],
                ["-", "1", "1", "-", "-"],
                ["1", "1", "-", "1", "2"],
                ["-", "-", "-", "1", "-"],
                ["-", "1", "1", "-", "2"],
                [8, 12, 9, 7, 2],
              ][rowIdx].map((cell, i) => (
                <div key={i} className="border py-1 text-center text-gray-800 dark:text-white/90">
                  {cell}
                </div>
              ))}
            </div>
          ))}

          <div className="flex flex-wrap gap-5 mt-7 text-base">
            {/* Tabel Status */}
            <div className="border text-base">
              <div className="grid grid-cols-4 font-bold text-center bg-gray-100 border-b">
                <div className="px-2 py-1">Status</div>
                <div className="px-4 py-1">A</div>
                <div className="px-4 py-1">G</div>
                <div className="px-4 py-1">T</div>
              </div>
              <div className="grid grid-cols-4 h-fit text-center border-b">
                <div className="bg-blue-100 px-2 font-semibold">
                  Waiting
                </div>
                <div className="px-4 py-1">2</div>
                <div className="px-4 py-1">1</div>
                <div className="px-4 py-1">-</div>
              </div>
              <div className="grid grid-cols-4 h-fit text-center">
                <div className="bg-green-100 px-2 font-semibold">
                  Finish
                </div>
                <div className="px-4 py-1">8</div>
                <div className="px-4 py-1">8</div>
                <div className="px-4 py-1">8</div>
              </div>
            </div>

            {/* Keterangan */}
            <div className="flex flex-col gap-y-1 border p-2 leading-5 w-48">
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
