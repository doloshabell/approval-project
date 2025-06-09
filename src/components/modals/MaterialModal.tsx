/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { getAllAsset } from "../../services/assetService";
import { AiOutlineCloseCircle } from "react-icons/ai";

interface Material {
  assetId: number,
  code: string;
  name: string;
  measurementUnit: string;
}

export default function MaterialModal({
  onSelect,
  onClose,
}: {
  onSelect: (material: Material) => void;
  onClose: () => void;
}) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const itemsPerPage = 10;
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    async function fetchMaterials() {
      if (!token) return;
      try {
        const response = await getAllAsset(token);
        const parsedMaterials: Material[] =
          response?.data?.map((item: any) => ({
            assetId: item.id,
            code: item.materialCode,
            name: item.assetName,
            measurementUnit: item.measurementUnit,
          })) ?? [];
        setMaterials(parsedMaterials);
      } catch (error) {
        console.error("Gagal memuat data aset:", error);
      }
    }

    fetchMaterials();
  }, [token]);

  useEffect(() => {
    setPage(0);
  }, [materials]);

  const filteredMaterials = materials.filter((mat) =>
    `${mat.code} ${mat.name} ${mat.measurementUnit}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
  
  const pageCount = Math.ceil(filteredMaterials.length / itemsPerPage);
  
  const currentItems = filteredMaterials.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  const handlePageClick = (event: { selected: number }) => {
    setPage(event.selected);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-2xl max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center mb-7">
          <h2 className="text-lg font-semibold">Choose Material</h2>
          <button
            className="px-3 py-1 text-sm rounded hover:text-gray-500"
            onClick={onClose}
          >
            <AiOutlineCloseCircle size={20} />
          </button>
        </div>

        <div className="my-5">
          <input
            type="text"
            placeholder="Search material..."
            className="w-full px-3 py-2 border border-gray-300 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Code</th>
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">UOM</th>
              <th className="border px-2 py-1 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((mat, index) => (
              <tr key={`${mat.code}-${index}`}>
                <td className="border px-2 py-1">{mat.code}</td>
                <td className="border px-2 py-1">{mat.name}</td>
                <td className="border px-2 py-1">{mat.measurementUnit}</td>
                <td className="border px-2 py-1 text-center">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => {
                      onSelect(mat);
                    }}
                  >
                    Pilih
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="my-7 flex justify-center">
          <ReactPaginate
            previousLabel={"← Prev"}
            nextLabel={"Next →"}
            pageCount={pageCount}
            onPageChange={handlePageClick}
            containerClassName={"inline-flex items-center -space-x-px"}
            pageClassName={"px-3 py-1 border border-gray-300 cursor-pointer"}
            activeClassName={"bg-blue-500 text-white"}
            previousClassName={
              "px-3 py-1 border border-gray-300 rounded-l cursor-pointer"
            }
            nextClassName={
              "px-3 py-1 border border-gray-300 rounded-r cursor-pointer"
            }
            disabledClassName={"opacity-50 cursor-not-allowed"}
          />
        </div>
      </div>
    </div>
  );
}
