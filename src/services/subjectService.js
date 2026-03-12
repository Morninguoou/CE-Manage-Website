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

export const upsertSubject = (payload) => {
  return apiClient.post("/subject/upsertSubject", payload);
};

export const deleteSubject = (subjectId, curriculumYear) => {
  return apiClient.delete("/subject/DeleteSubject", {
    params: {
      subjectId,
      curriculumYear,
    },
  });
};