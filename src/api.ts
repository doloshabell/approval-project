import axios from "axios";

const api = axios.create({
  baseURL: "http://62.72.21.8:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
