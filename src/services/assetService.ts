import api from "../api";

export async function getAllAsset(token: string) {
  const response = await api.get("/asset?advance_search=", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
