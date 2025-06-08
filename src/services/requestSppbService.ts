import api from "../api";

type RequestDetailItem = {
  assetId: number;
  quantity: number;
  reason: string;
};

type SppbPayload = {
  noRequest: string;
  noSppbGoodDispatch: string;
  noSppbSupplyRequest: string;
  requestDetail: RequestDetailItem[];
  workCode: string;
};

export async function createSppbRequest(payload: SppbPayload, token: string) {
    const response = await api.post("/request", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    return response.data;
  }


  export async function getAllRequest(workCode: string, token: string) {
    const response = await api.get(`/request?workCode=${encodeURIComponent(workCode)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    return response.data;
  }