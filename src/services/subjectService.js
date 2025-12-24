import apiClient from "./apiClient";

export const importSubjectFile = (formData) => {
  return apiClient.post("/subject/ImportFile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};