/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import Input from "../../components/form/input/InputField";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { FaSearch } from "react-icons/fa";
import { IoDocumentOutline } from "react-icons/io5";
import { FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {
  getAllRequestByDistrictId,
  getAllRequest,
  getRequestReportById,
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
  lastApprovalDate: string;
  status: "Approved" | "Rejected";
}

export default function ApprovalMonitoring() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<MappedRequestItem[] | null>(null);

  const token = localStorage.getItem("userToken");

  const filteredData = data ?? [];

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

  const fetchData = async () => {
    try {
      if (!token) throw new Error("Token not found");
      // console.log(localStorage.getItem("userData"));

      const userDataString = localStorage.getItem("userData");

      if (userDataString) {
        const userData = JSON.parse(userDataString);
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
            lastApprovalDate: item.lastApprovalDate
              ? new Date(item.lastApprovalDate).toISOString().split("T")[0]
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

  return (
    <>
      <PageMeta
        title="Approval Monitoring"
        description="Approval Monitoring Page"
      />
      <PageBreadcrumb pageTitle="Approval Monitoring" />
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

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border text-sm dark:text-white/90">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr className="text-left">
                <th className="border px-4 py-2">No</th>
                <th className="border px-4 py-2">SPPB</th>
                <th className="border px-4 py-2">Work Code</th>
                <th className="border px-4 py-2">Date Approval</th>
                <th className="border px-4 py-2">Fully Approved Request</th>
                <th className="border px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item, idx) => (
                  <tr key={item.no}>
                    <td className="border px-4 py-2">{offset + idx + 1}</td>
                    <td className="border px-4 py-2">{item.sppb}</td>
                    <td className="border px-4 py-2">{item.workCode}</td>
                    <td className="border px-4 py-2">
                      {item.lastApprovalDate}
                    </td>
                    <td className="border px-4 py-2">{item.status}</td>
                    <td className="border px-4 py-2 text-center">
                      <button
                        onClick={() =>
                          navigate(
                            `/approval-monitoring/detail/${item.id}?from=monitoring`
                          )
                        }
                        className="mr-2 text-blue-600 hover:text-blue-800"
                      >
                        <FiEye size={18} />
                      </button>

                      {/* <a
                        href={`/approval/${item.id}/report`}
                        className="mr-2 text-blue-600 hover:text-blue-800"
                        download
                      >
                        <IoDocumentOutline size={18} />
                      </a> */}

                      <button
                        className="mr-2 text-blue-600 hover:text-blue-800"
                        onClick={() => {
                          getRequestReportById(item.id, token!);
                        }}
                      >
                        <IoDocumentOutline size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center px-4 py-4">
                    No data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-center">
          <ReactPaginate
            previousLabel={"←"}
            nextLabel={"→"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageChange}
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
