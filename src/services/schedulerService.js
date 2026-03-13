import apiClient from "./apiClient";

export const upsertScheduler = async (data) => {
  return apiClient.post("/Scheduler/Upsert", data);
};