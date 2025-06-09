import api from "../api";

type RequestDetailItem = {
  assetId: number;
  quantity: number;
  reason: string;
};

type SppbPayload = {
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
  const response = await api.get(
    `/request?workCode=${encodeURIComponent(workCode)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function getAllRequestByDistrictId(
  districtId: number,
  token: string
) {
  const response = await api.get(
    `/approval/?districtId=${encodeURIComponent(districtId)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function getDetailRequest(id: string, token: string) {
  const response = await api.get(`/request/${encodeURIComponent(id)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function deleteRequest(id: string, token: string) {
  const response = await api.delete(`/request/${encodeURIComponent(id)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
