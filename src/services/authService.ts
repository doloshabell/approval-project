import api from "../api";
import { decodeJWT } from "../utils/jwt";

type LoginPayload = {
  username: string;
  password: string;
};

export async function loginUser({ username, password }: LoginPayload) {
  const response = await api.post("/user/login", {
    userName: username,
    password: password,
  });

  const token = response.data?.data?.token;
  const payload = decodeJWT(token);

  if (!token || !payload) {
    throw new Error("Token tidak valid");
  }

  const userData = {
    id: payload.id,
    username: payload.userName,
    firstName: payload.firstName,
    lastName: payload.lastName,
    role: payload.role,
    district: payload.district,
  };

  localStorage.setItem("userToken", token);
  localStorage.setItem("userData", JSON.stringify(userData));

  return userData;
}

export async function logoutUser(token: string): Promise<void> {
  await api.post("/user/logout", null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}