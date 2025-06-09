import api from "../api";

export async function approvingRequest(id: string, isApproved: boolean, token: string) {
  const payloadApproval = {
    approvalType: isApproved
  }

  const response = await api.post(`/approval/${encodeURIComponent(id)}`, payloadApproval, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
