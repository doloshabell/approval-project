/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Input from "../../components/form/input/InputField";
import { AiFillDelete } from "react-icons/ai";
import MaterialModal from "../../components/modals/MaterialModal";
import { FaSearch } from "react-icons/fa";
import {
  createSppbRequest,
  editSppbRequest,
  getDetailRequest,
} from "../../services/requestSppbService";
import ApprovalProgressBar from "../../components/ui/timeline/ApprovalProgressBar";
import { Approval } from "../../types/approval";

export interface DetailAsset {
  id: number;
  materialCode: string;
  assetName: string;
  measurementUnit: string;
}

export interface DetailRequest {
  id: number;
  reason: string;
  quantity: number;
  detailAsset: DetailAsset;
}

export interface DetailDistrict {
  id: number;
  name: string;
  code: number;
  detailEstate: DetailEstate;
}

export interface DetailEstate {
  id: number;
  reason: string;
  quantity: number;
}

export interface SppbDetailData {
  id: number;
  workCode: string;
  noSppbSupplyRequest: string;
  noSppbGoodDispatch: string;
  warehouseGoodsHandoverDate: string | null;
  companyName: string;
  noRequest: string;
  detailRequest: DetailRequest[];
  detailDistrict: DetailDistrict;
}

export interface SppbDetailResponse {
  data: SppbDetailData;
  responseCode: string;
  responseMessage: string;
}

interface SppbItem {
  assetId: number;
  materialCode: string;
  materialName: string;
  measurementUnit: string;
  qty: number;
  keterangan: string;
}

interface Material {
  assetId: number;
  code: string;
  name: string;
  measurementUnit: string;
}

export default function DetailSppb() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const from = params.get("from");
  const token = localStorage.getItem("userToken");
  const storedUserData = localStorage.getItem("userData");
  const userData = storedUserData ? JSON.parse(storedUserData) : null;
  const [approvals, setApprovals] = useState<Approval[]>([]);

  const [formData, setFormData] = useState({
    noRequest: "",
    noSppbGoodDispatch: "",
    noSppbSupplyRequest: "",
    companyName: "PT SWAKARSA SINARSENTOSA",
    afdeling: userData?.district?.name || "",
    estate: userData?.district?.estate?.name || "",
    workCode: "",
  });

  const getTitleBySource = () => {
    switch (from) {
      case "monitoring":
        return "Detail SPPB Monitoring";
      case "request":
        return "Detail SPPB Approval Request";
      case "filling":
        return "Detail SPPB Filling";
      default:
        return "Create SPPB";
    }
  };

  const [items, setItems] = useState<SppbItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(
    null
  );

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        assetId: 0,
        materialCode: "",
        materialName: "",
        measurementUnit: "",
        qty: 0,
        keterangan: "",
      },
    ]);
  };

  const handleItemChange = (
    index: number,
    field: keyof SppbItem,
    value: string
  ) => {
    const updatedItems: SppbItem[] = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    setItems(updatedItems);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const openMaterialModal = (index: number) => {
    setSelectedItemIndex(index);
    setModalOpen(true);
  };

  const handleSelectMaterial = (material: Material) => {
    if (selectedItemIndex === null) return;
    const updatedItems = [...items];
    updatedItems[selectedItemIndex] = {
      ...updatedItems[selectedItemIndex],
      assetId: material.assetId,
      materialCode: material.code,
      materialName: material.name,
      measurementUnit: material.measurementUnit,
    };
    setItems(updatedItems);
    setModalOpen(false);
  };

  const handleSave = async () => {
    if (!token) return;

    try {
      const requestDetail = items.map((item) => ({
        assetId: item.assetId!,
        quantity: item.qty,
        reason: item.keterangan,
      }));

      const payload = {
        noRequest: formData.noRequest,
        noSppbGoodDispatch: formData.noSppbGoodDispatch,
        noSppbSupplyRequest: formData.noSppbSupplyRequest,
        workCode: formData.workCode,
        requestDetail,
      };

      if (from?.length == 0) await createSppbRequest(payload, token);
      else await editSppbRequest(id!, payload, token);

      alert("SPPB berhasil disimpan.");
      navigate(-1);
    } catch (error) {
      console.error("Gagal menyimpan SPPB:", error);
      alert("Terjadi kesalahan saat menyimpan data.");
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const fetchDetail = async () => {
    if (!token || !id) return;

    try {
      const response = await getDetailRequest(id, token);
      const detailItems = response.data.detailRequest;
      setApprovals(response.data.detailApproval || []);

      // Set formData
      setFormData({
        noRequest: response.data.noRequest || "",
        noSppbGoodDispatch: response.data.noSppbGoodDispatch || "",
        noSppbSupplyRequest: response.data.noSppbSupplyRequest || "",
        companyName: "PT SWAKARSA SINARSENTOSA",
        estate: response.data.detailDistrict?.estate?.name || "",
        afdeling: response.data.detailDistrict?.name || "",
        workCode: response.data.workCode || "",
      });

      // Map items
      const mappedItems: SppbItem[] = detailItems.map((item: any) => ({
        assetId: item.detailAsset?.id || 0,
        materialCode: item.detailAsset?.materialCode || "",
        materialName: item.detailAsset?.assetName || "",
        measurementUnit: item.detailAsset?.measurementUnit || "",
        qty: item.quantity,
        keterangan: item.reason || "",
      }));

      setItems(mappedItems);
    } catch (error) {
      console.error("Error fetching SPPB detail:", error);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  return (
    <>
      <PageMeta title={getTitleBySource()} description="Detail SPPB Page" />
      <PageBreadcrumb pageTitle={from == null ? "Form SPPB" : "SPPB Detail"} />

      {from === "monitoring" && (
          <ApprovalProgressBar approvals={approvals} />
      )}

      <div className="border rounded-2xl bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Input
            label="Company"
            name="company"
            value={formData.companyName}
            readOnly
          />
          <Input
            label="Estate"
            name="estate"
            value={formData.estate}
            readOnly
          />
          <Input
            label="Afdeling"
            name="afdeling"
            value={formData.afdeling}
            readOnly
          />
          <Input
            label="Work Code"
            name="workCode"
            type="text"
            value={formData.workCode}
            onChange={(e) =>
              setFormData({ ...formData, workCode: e.target.value })
            }
          />
        </div>

        <hr className="my-5 border-t-2 rounded-md border-gray-300 dark:border-white/90" />

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2 w-full">
            <h2 className="font-semibold text-lg dark:text-white/90">
              SPPB Items
            </h2>
            <button
              type="button"
              onClick={handleAddItem}
              className={`px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 ${
                userData.role?.id !== 1 && userData.role?.id !== 4
                  ? "hidden"
                  : ""
              }`}
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
                  <th
                    className={`border px-3 py-2 ${
                      userData.role?.id !== 1 && userData.role?.id !== 4
                        ? "hidden"
                        : ""
                    }`}
                  >
                    Action
                  </th>
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
                        value={item.measurementUnit}
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
                    <td
                      className={`border px-3 py-2 text-center ${
                        userData.role?.id !== 1 && userData.role?.id !== 4
                          ? "hidden"
                          : ""
                      }`}
                    >
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
              className={`px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
                userData.role?.id !== 1 && userData.role?.id !== 4
                  ? "hidden"
                  : ""
              }`}
            >
              {from?.length == 0 ? "Save" : "Edit"}
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <MaterialModal
          onSelect={handleSelectMaterial}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
