import { useState } from "react";
import ReactPaginate from "react-paginate";
import Input from "../../components/form/input/InputField";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { FaSearch, FaCheck, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const dummyData = Array.from({ length: 75 }, (_, i) => ({
  no: i + 1,
  sppb: `SPPB-${1000 + i}`,
  estate: `Estate ${i % 5}`,
  kdkj: `KDKJ-${i % 3}`,
  tanggal: `2025-06-${((i % 30) + 1).toString().padStart(2, "0")}`,
}));

export default function ApprovalRequest() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = dummyData.filter((item) =>
    item.sppb.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredData.slice(offset, offset + itemsPerPage);

  const perPageOptions = [10, 25, 50, 100];

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(0);
  };

  return (
    <>
      <PageMeta title="Approval Request" description="Approval Request Page" />
      <PageBreadcrumb pageTitle="Approval Request" />

      <div className="border rounded-2xl bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-x-1 items-center w-full">
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
            <span className="text-sm text-gray-700 dark:text-white">entry</span>
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

        {/* Tabel */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border text-sm dark:text-white/90">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr className="text-left">
                <th className="border px-4 py-2">No</th>
                <th className="border px-4 py-2">No SPPB</th>
                <th className="border px-4 py-2">Estate</th>
                <th className="border px-4 py-2">KDKJ</th>
                <th className="border px-4 py-2">Tanggal</th>
                <th className="border px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item, idx) => (
                  <tr key={item.no}>
                    <td className="border px-4 py-2">{offset + idx + 1}</td>
                    <td className="border px-4 py-2">{item.sppb}</td>
                    <td className="border px-4 py-2">{item.estate}</td>
                    <td className="border px-4 py-2">{item.kdkj}</td>
                    <td className="border px-4 py-2">{item.tanggal}</td>
                    <td className="border px-4 py-2 text-center space-x-2">
                      <button
                        onClick={() =>
                          navigate(
                            `/approval-request/detail/${item.sppb}?from=request`
                          )
                        }
                        className="inline-flex items-center justify-center w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded"
                        title="Approve"
                      >
                        <FaCheck size={14} />
                      </button>
                      <button
                        onClick={() =>
                          navigate(
                            `/approval-request/detail/${item.sppb}?from=request`
                          )
                        }
                        className="inline-flex items-center justify-center w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded"
                        title="Reject"
                      >
                        <FaTimes size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center px-4 py-4">
                    No data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-center">
          <ReactPaginate
            previousLabel={"←"}
            nextLabel={"→"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageChange}
            containerClassName={"flex space-x-2 text-sm"}
            activeClassName={"font-bold text-blue-600"}
            pageClassName={"px-3 py-1 border rounded"}
            previousClassName={"px-3 py-1 border rounded"}
            nextClassName={"px-3 py-1 border rounded"}
            disabledClassName={"opacity-50 cursor-not-allowed"}
            forcePage={currentPage}
          />
        </div>
      </div>
    </>
  );
}
