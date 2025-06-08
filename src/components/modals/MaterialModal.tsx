import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

interface Material {
  code: string;
  name: string;
  satuan: string;
}

export default function MaterialModal({
  onSelect,
  onClose,
}: {
  onSelect: (material: Material) => void;
  onClose: () => void;
}) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [page, setPage] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const dummyMaterials = Array.from({ length: 50 }, (_, i) => ({
      code: `MAT-${1000 + i}`,
      name: `Material ${i + 1}`,
      satuan: "Kg",
    }));
    setMaterials(dummyMaterials);
  }, []);

  const pageCount = Math.ceil(materials.length / itemsPerPage);
  const currentItems = materials.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  const handlePageClick = (event: { selected: number }) => {
    setPage(event.selected);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-2xl max-h-[80vh] overflow-auto">
        <h2 className="text-lg font-semibold mb-4">Pilih Material</h2>
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Code</th>
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Satuan</th>
              <th className="border px-2 py-1 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((mat) => (
              <tr key={mat.code}>
                <td className="border px-2 py-1">{mat.code}</td>
                <td className="border px-2 py-1">{mat.name}</td>
                <td className="border px-2 py-1">{mat.satuan}</td>
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

        <div className="mt-4 flex justify-center">
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

        <div className="mt-4 flex justify-end">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}