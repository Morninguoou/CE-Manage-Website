import apiClient from "./apiClient";

export async function loginAdminWeb({ username, password }) {
  return apiClient.post("/account/LoginAdminWeb", { username, password });
}