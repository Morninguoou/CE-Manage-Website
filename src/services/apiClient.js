import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// แปลง error ให้อ่านง่าย
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message ||
      err.response?.statusText ||
      err.message ||
      "Request failed";
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
