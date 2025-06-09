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

export async function getDashboard(token: string) {
  const response = await api.get(
    `/request/dashboard`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function getRequestReportById(id: number, token: string) {
  try {
    const response = await api.get(`/approval/${encodeURIComponent(id)}/report`, {
      responseType: 'blob', // penting!
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Buat URL dari blob
    const url = window.URL.createObjectURL(new Blob([response.data]));

    // Ambil nama file dari header jika tersedia (opsional)
    const disposition = response.headers['content-disposition'];
    const match = disposition?.match(/filename="?(.+)"?/);
    const filename = match?.[1] ?? `report-${id}.pdf`;

    // Buat dan klik link
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Gagal download file:", error);
  }
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

export async function editSppbRequest(id: string, payload: SppbPayload, token: string) {
  const response = await api.put(`/request/${encodeURIComponent(id)}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
