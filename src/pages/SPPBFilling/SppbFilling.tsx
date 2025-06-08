import { useState } from "react";
import ReactPaginate from "react-paginate";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Input from "../../components/form/input/InputField";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { FaPlus, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

type SppbItem = {
  no: string;
  estate: string;
  kdkj: string;
  tanggal: string;
};

// Dummy data
const dummyData: SppbItem[] = Array.from({ length: 53 }, (_, i) => ({
  no: `SPPB-${i + 1}`,
  estate: `Estate ${i + 1}`,
  kdkj: `KDKJ-${i + 1}`,
  tanggal: `${(i % 30) + 1}-06-2025`.padStart(10, "0"),
}));

const perPageOptions = [10, 25, 50, 100];

export default function SppbFilling() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = dummyData.filter((item) =>
    item.no.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  // const currentItems = [];
  const currentItems = filteredData.slice(offset, offset + itemsPerPage);

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected);
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(0);
  };

  return (
    <>
      <PageMeta title="SPPB Filling" description="SPPB Filling Page" />
      <PageBreadcrumb pageTitle="SPPB Filling" />

      <div className="border rounded-2xl bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-y-2">
            <div className="flex flex-wrap gap-x-1 items-center">
              <label className="text-sm text-gray-700 dark:text-white/80">
                Show
              </label>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="text-sm border rounded px-5 py-1 dark:bg-gray-900 dark:text-white"
              >
                {perPageOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-700 dark:text-white">
                entry
              </span>
            </div>

            {/* Search bar */}
            <div className="relative w-full max-w-sm">
              <Input
                type="text"
                placeholder="Search No. SPPB..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(0);
                }}
                className="text-sm w-40 dark:text-white dark:bg-gray-800"
              />
              <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white pointer-events-none" />
            </div>
          </div>
          <button
          onClick={() =>
            navigate(
              `/sppb-filling/add`
            )
          }
            type="button"
            className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
          >
            <FaPlus className="text-xs" />
            Add SPPB
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800 dark:text-white">
              <tr>
                <th className="border px-4 py-2 text-left">No. SPPB</th>
                <th className="border px-4 py-2 text-left">Estate</th>
                <th className="border px-4 py-2 text-left">Work Code</th>
                <th className="border px-4 py-2 text-left">Date Request</th>
                <th className="border px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, idx) => (
                <tr key={idx} className="border dark:text-white">
                  <td className="border-r px-4 py-2">{item.no}</td>
                  <td className="border-r px-4 py-2">{item.estate}</td>
                  <td className="border-r px-4 py-2">{item.kdkj}</td>
                  <td className="border-r px-4 py-2">{item.tanggal}</td>
                  <td className="px-4 py-2 flex gap-x-3 items-center justify-center">
                    <button
                    onClick={() =>
                      navigate(
                        `/sppb-filling/detail/${item.no}`
                      )
                    }
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                      onClick={() => confirm(`Hapus ${item.no}?`)}
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {currentItems.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="border text-center py-5 dark:text-white"
                  >
                    No data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-center">
          <ReactPaginate
            breakLabel="..."
            nextLabel="→"
            onPageChange={handlePageClick}
            pageRangeDisplayed={2}
            marginPagesDisplayed={1}
            pageCount={pageCount}
            previousLabel="←"
            containerClassName="flex items-center gap-2 dark:text-white"
            pageClassName="px-3 py-1 border rounded hover:bg-gray-200 dark:hover:bg-gray-800 dark:text-white"
            activeClassName="bg-blue-500 text-white"
            previousClassName="px-3 py-1 border rounded hover:bg-gray-200 dark:hover:bg-gray-800 dark:text-white"
            nextClassName="px-3 py-1 border rounded hover:bg-gray-200 dark:hover:bg-gray-800 dark:text-white"
            disabledClassName="opacity-50 cursor-not-allowed"
            forcePage={currentPage}
          />
        </div>
      </div>
    </>
  );
}
