/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Input from "../../components/form/input/InputField";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { FaPlus, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  getAllRequestByDistrictId,
  getAllRequest,
  deleteRequest,
} from "../../services/requestSppbService";

interface SupplyRequestItem {
  id: number;
  workCode: string;
  noSppbSupplyRequest: string;
  noSppbGoodDispatch: string;
  warehouseGoodsHandoverDate: string | null;
  companyName: string;
  noRequest: string;
  lastApprovalDate: Date;
  createdDate: Date;
  isFullyApproved: boolean;
}

export interface SupplyRequestResponse {
  data: SupplyRequestItem[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  responseCode: string;
  responseMessage: string;
}

interface MappedRequestItem {
  id: number;
  no: number;
  sppb: string;
  estate: string;
  workCode: string;
  dateApproval: string;
  createdDate: string;
  status: "Approved" | "Rejected";
}

const perPageOptions = [10, 25, 50, 100];

export default function SppbFilling() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<MappedRequestItem[] | null>(null);
  const token = localStorage.getItem("userToken");
  const storedUserData = localStorage.getItem("userData");
  const userData = storedUserData ? JSON.parse(storedUserData) : null;
  console.log(userData.role.id);
  console.log(userData.role?.id != 1 && userData.role?.id != 4);

  const filteredData = data ?? [];

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
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

  const fetchData = async () => {
    try {
      if (!token) throw new Error("Token not found");

      if (storedUserData) {
        const districtId = userData?.district?.id;

        const roleCode = userData?.role?.code;

        const response: SupplyRequestResponse =
          roleCode === "admin"
            ? await getAllRequestByDistrictId(districtId, token)
            : await getAllRequest("", token);

        const mapped: MappedRequestItem[] = response.data.map(
          (item, index) => ({
            id: item.id,
            no: index + 1,
            sppb: item.noSppbSupplyRequest,
            estate: item.companyName.trim(),
            workCode: item.workCode,
            dateApproval: item.lastApprovalDate
              ? new Date(item.lastApprovalDate).toISOString().split("T")[0]
              : "N/A",
            createdDate: item.createdDate
              ? new Date(item.createdDate).toISOString().split("T")[0]
              : "N/A",
            status: item.isFullyApproved ? "Approved" : "Rejected",
          })
        );

        setData(mapped);
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteRequestSppb = async (id: string) => {
    const confirmMsg = "Delete this request?";
    const confirmed = window.confirm(confirmMsg);

    if (!confirmed) return;

    try {
      await deleteRequest(id, token ?? "");
      fetchData();
    } catch (err) {
      console.error("Failed to delete data", err);
    }
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
            {/* <div className="relative w-full max-w-sm">
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
            </div> */}
          </div>
          <button
            onClick={() => navigate(`/sppb-filling/add`)}
            type="button"
            className={`inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition ${
              userData.role?.id !== 1 && userData.role?.id !== 4 ? "hidden" : ""
            }`}
          >
            <FaPlus className="text-xs" />
            Add SPPB
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800 dark:text-white">
              <tr>
                <th className="border px-4 py-2 text-left">No.</th>
                <th className="border px-4 py-2 text-left">No. SPPB</th>
                <th className="border px-4 py-2 text-left">Work Code</th>
                <th className="border px-4 py-2 text-left">Date Request</th>
                <th className="border px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item.id} className="border dark:text-white">
                  <td className="border-r px-4 py-2">{item.no}</td>
                  <td className="border-r px-4 py-2">{item.sppb}</td>
                  <td className="border-r px-4 py-2">{item.workCode}</td>
                  <td className="border-r px-4 py-2">{item.createdDate}</td>
                  <td className="px-4 py-2 flex gap-x-3 items-center justify-center">
                    <button
                      onClick={() =>
                        navigate(`/sppb-filling/detail/${item.id}?from=filling`)
                      }
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      className={`text-red-600 hover:text-red-800 ${
                        userData.role?.id !== 1 && userData.role?.id !== 4
                          ? "hidden"
                          : ""
                      }`}
                      title="Delete"
                      onClick={() => deleteRequestSppb(item.id.toString())}
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
