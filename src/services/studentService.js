import apiClient from "./apiClient";

export const getStudentList = async () => {
  const res = await apiClient.get("/account/StudentList");
  return res.data;
};

export const uploadStudentExcel = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await apiClient.post("/account/ImportExcel", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};