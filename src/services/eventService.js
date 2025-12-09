
import apiClient from "./apiClient";

export const getEventList = async () => {
  const res = await apiClient.get("/Event/GetAll");
  return res.data;
};

export const editEvent = async (payload) => {
  const res = await apiClient.post("/Event/Edit", payload);
  return res.data;
};

export const createEvent = async (payload) => {
  const res = await apiClient.post("/Event/Create", payload);
  return res.data;
};

export const deleteEvent = async (eventId) => {
  const res = await apiClient.post("/Event/Delete", null, {
    params: { eventId },
  });
  return res.data;
};