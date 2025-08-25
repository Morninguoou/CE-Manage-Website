import apiClient from "./apiClient";

const ts = () => Date.now();

export function mapFacultyFromApi(x) {
  if (!x) return null;
  return {
    id: x.accId,
    nameTH: x.fullname_th || "",
    nameENG: x.fullname_en || "",
    email: x.email || "",
    tel: x.tel_office || "",
    room: x.roomNumber || "",
    bachelor: x.bachelor_degree || "",
    master: x.master_degree || "",
    doctorate: x.phD_degree || "",
    imagePath: x.pathImage || "",
    teachDegree: x.teach_degree || "",
    raw: x,
  };
}

export async function getFacultyMembers() {
  const { data } = await apiClient.get("/FacultyMember/Member", {
    params: { _: ts() },
  });
  return (data || []).map(mapFacultyFromApi);
}

export async function getFacultyMemberById(accId) {
  const { data } = await apiClient.get("/FacultyMember/Member", {
    params: { UserId: accId, _: ts() },
  });
  const x = (Array.isArray(data) ? data[0] : data) || null;
  return mapFacultyFromApi(x);
}

function buildUpsertPayloadFromForm(form) {
  return [
    {
      accId: form.id,
      fullname_th: form.nameTH || "",
      fullname_en: form.nameENG || "",
      roomNumber: form.room || "",
      email: form.email || "",
      bachelor_degree: form.bachelor || "",
      master_degree: form.master || "",
      phD_degree: form.doctorate || "",
      pathImage: form.imagePath || "",
      teach_degree: form.teachDegree || "",
      tel_office: form.tel || "",
    },
  ];
}

export async function upsertFacultyMember(form) {
  const body = buildUpsertPayloadFromForm(form);
  const { data } = await apiClient.post("/FacultyMember/UpsertFacultyMember", body);
  const updated = data?.detail?.[0] || null;
  return mapFacultyFromApi(updated);
}

export async function deleteFacultyMember(accId) {
  const { data } = await apiClient.delete(`/FacultyMember/DeleteMemberDetail/${accId}`);
  return data;
}

function buildCreatePayloadFromForm(form) {
  return [
    {
      accId: form.id,
      fullname_th: form.nameTH || "",
      fullname_en: form.nameENG || "",
      roomNumber: form.room || "",
      // รวมอีเมลหลายบรรทัดเป็น comma
      email: (form.email || "")
        .split("\n")
        .map(s => s.trim())
        .filter(Boolean)
        .join(", "),
      bachelor_degree: form.education?.bachelor || "",
      master_degree: form.education?.master || "",
      phD_degree: form.education?.doctorate || "",
      pathImage: form.imagePath || "",
      teach_degree: form.teachDegree || "",
      tel_office: form.tel || "",
    },
  ];
}

export async function createFacultyMember(form) {
  const body = buildCreatePayloadFromForm(form);
  const { data } = await apiClient.post("/FacultyMember/CreateFucultyByAdmin", body);
  const created = Array.isArray(data) ? data[0] : data;
  return mapFacultyFromApi(created);
}