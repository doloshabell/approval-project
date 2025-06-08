/* eslint-disable @typescript-eslint/no-unused-vars */
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Input from "../../components/form/input/InputField";
import { AiFillDelete } from "react-icons/ai";
import MaterialModal from "../../components/modals/MaterialModal";
import { FaSearch } from "react-icons/fa";

interface SppbItem {
  materialCode: string;
  materialName: string;
  satuan: string;
  qty: string;
  keterangan: string;
}

interface Material {
  code: string;
  name: string;
  satuan: string;
}

export default function DetailSppb() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const from = params.get("from");
  const token = localStorage.getItem("userToken");

  const getTitleBySource = () => {
    switch (from) {
      case "monitoring":
        return "Detail SPPB Monitoring";
      case "request":
        return "Detail SPPB Approval Request";
      case "filling":
        return "Detail SPPB Filling";
      default:
        return "Detail SPPB";
    }
  };

  const [items, setItems] = useState<SppbItem[]>([
    { materialCode: "", materialName: "", satuan: "", qty: "", keterangan: "" },
  ]);

  // State untuk modal material
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(
    null
  );

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        materialCode: "",
        materialName: "",
        satuan: "",
        qty: "",
        keterangan: "",
      },
    ]);
  };

  const handleItemChange = (
    index: number,
    field: keyof SppbItem,
    value: string
  ) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  // Buka modal untuk item index tertentu
  const openMaterialModal = (index: number) => {
    setSelectedItemIndex(index);
    setModalOpen(true);
  };

  // Setelah pilih material, update items dan tutup modal
  const handleSelectMaterial = (material: Material) => {
    if (selectedItemIndex === null) return;
    const updatedItems = [...items];
    updatedItems[selectedItemIndex] = {
      ...updatedItems[selectedItemIndex],
      materialCode: material.code,
      materialName: material.name,
      satuan: material.satuan,
    };
    setItems(updatedItems);
    setModalOpen(false);
  };

  // contoh fungsi simpan data (bisa kamu ganti sesuai kebutuhan)
  const handleSave = () => {
    alert("Data disimpan!");
    // TODO: logic save data ke backend / state management
  };

  // cancel kembali ke halaman sebelumnya
  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <>
      <PageMeta title={getTitleBySource()} description="Detail SPPB Page" />
      <PageBreadcrumb pageTitle="SPPB Detail" />
      <div className="border rounded-2xl bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        {/* Header Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Input label="No. SPPB" name="noSppb" />
          <Input label="Kode Kerja" name="kodeKerja" />
          <Input label="Nama Perusahaan" name="namaPerusahaan" />
          <Input label="Estate" name="estate" />
          <Input label="Afdeling" name="afdeling" />
        </div>

        <hr className="my-5 border-t-2 rounded-md border-gray-300 dark:border-white/90" />

        {/* Items Table */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2 w-full">
            <h2 className="font-semibold text-lg dark:text-white/90">
              SPPB Items
            </h2>
            <button
              type="button"
              onClick={handleAddItem}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              Add Item
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm mt-4 dark:text-white/90">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="border px-3 py-2">Material Code</th>
                  <th className="border px-3 py-2">Material Name</th>
                  <th className="border px-3 py-2">Satuan</th>
                  <th className="border px-3 py-2">Qty</th>
                  <th className="border px-3 py-2">Keterangan</th>
                  <th className="border px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td className="border px-3 py-2 relative max-w-xs">
                      <div className="relative w-full">
                        <Input
                          readOnly
                          value={item.materialCode}
                          placeholder="Klik untuk pilih material"
                          onClick={() => openMaterialModal(index)}
                          className="cursor-pointer pr-8 bg-gray-50 dark:bg-gray-700"
                        />
                        <FaSearch
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white pointer-events-none"
                          size={16}
                        />
                      </div>
                    </td>

                    <td className="border px-3 py-2">
                      <Input
                        readOnly
                        value={item.materialName}
                        placeholder="Material Name"
                        className="bg-gray-50 dark:bg-gray-700"
                      />
                    </td>
                    <td className="border px-3 py-2">
                      <Input
                        readOnly
                        value={item.satuan}
                        placeholder="Satuan"
                        className="bg-gray-50 dark:bg-gray-700"
                      />
                    </td>
                    <td className="border px-3 py-2">
                      <Input
                        type="number"
                        value={item.qty}
                        onChange={(e) =>
                          handleItemChange(index, "qty", e.target.value)
                        }
                      />
                    </td>
                    <td className="border px-3 py-2">
                      <Input
                        type="textarea"
                        value={item.keterangan}
                        onChange={(e) =>
                          handleItemChange(index, "keterangan", e.target.value)
                        }
                        rows={2}
                      />
                    </td>
                    <td className="border px-3 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <AiFillDelete size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Buttons Save & Cancel */}
          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 dark:text-white/90 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Modal Material */}
      {modalOpen && (
        <MaterialModal
          onSelect={handleSelectMaterial}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
