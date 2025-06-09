/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import Input from "../../components/form/input/InputField";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { FaSearch, FaCheck, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  getAllRequestByDistrictId,
  getAllRequest,
} from "../../services/requestSppbService";

interface SupplyRequestItem {
  id: number;
  workCode: string;
  noSppbSupplyRequest: string;
  noSppbGoodDispatch: string;
  warehouseGoodsHandoverDate: string | null;
  companyName: string;
  noRequest: string;
  createdDate: Date;
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
  createdDate: string;
  lastApprovalDate: string;
  status: "Approved" | "Rejected";
}

export default function ApprovalRequest() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<MappedRequestItem[] | null>(null);
  const storedUserData = localStorage.getItem("userData");
  const userData = storedUserData ? JSON.parse(storedUserData) : null;

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
      const token = localStorage.getItem("userToken");
      if (!token) throw new Error("Token not found");

      const userDataString = localStorage.getItem("userData");

      if (userDataString) {
        const userData = JSON.parse(userDataString);
        const districtId = userData?.district?.id;

        const roleCode = userData?.role?.code;

        console.log("District ID:", userData);

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

        {/* Tabel */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border text-sm dark:text-white/90">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr className="text-left">
                <th className="border px-4 py-2">No.</th>
                <th className="border px-4 py-2">No. SPPB</th>
                <th className="border px-4 py-2">Work Code</th>
                <th className="border px-4 py-2">Date Request</th>
                <th className="border px-4 py-2">Last Date Approval</th>
                <th
                  className="border px-4 py-2 text-center"
                  hidden={userData.role?.id == 1}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="border px-4 py-2">{offset + idx + 1}</td>
                    <td className="border px-4 py-2">{item.sppb}</td>
                    <td className="border px-4 py-2">{item.workCode}</td>
                    <td className="border px-4 py-2">{item.createdDate}</td>
                    <td className="border px-4 py-2">
                      {item.lastApprovalDate}
                    </td>
                    <td
                      className="border px-4 py-2 text-center space-x-2"
                      hidden={userData.role?.id == 1}
                    >
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
