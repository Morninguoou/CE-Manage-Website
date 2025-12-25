import apiClient from "./apiClient";

export const importSubjectFile = (formData) => {
  return apiClient.post("/subject/ImportFile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getSubjects = () => {
  return apiClient.get("/subject/GetSubject");
};

export const getSubjectById = (subjectId) => {
  return apiClient.get("/subject/GetSubject", {
    params: { subjectId },
  });
};