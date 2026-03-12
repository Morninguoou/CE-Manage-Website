import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { getSubjectById, upsertSubject } from "../../services/subjectService";

const TYPE_OPTIONS = ["วิชาแกน", "บังคับ", "บังคับเลือก", "เลือกเฉพาะสาขา"];

export default function SubjectEditPage() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const initialForm = useMemo(() => {
    if (state?.subject) {
      return {
        id: state.subject.subjectId || id,
        name: state.subject.name_en || "",
        credit: state.subject.credit ?? "",
        type: state.subject.type || "วิชาแกน",
        prerequisite: state.subject.prerequisite_en || "",
        platform: state.subject.platform || "",
        detail_th: state.subject.description_th || "",
        detail_en: state.subject.description_en || "",
        theoryHr: state.subject.theoryHr ?? "0",
        practiceHr: state.subject.practiceHr ?? "0",
        selfLearningHr: state.subject.selfLearningHr ?? "0",
      };
    }

    return {
      id,
      name: "",
      credit: "",
      type: "วิชาแกน",
      prerequisite: "",
      platform: "",
      detail_th: "",
      detail_en: "",
      theoryHr: "0",
      practiceHr: "0",
      selfLearningHr: "0",
    };
  }, [id, state?.subject]);

  const [form, setForm] = useState(initialForm);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const onChange = (key) => (e) => {
    setForm((p) => ({ ...p, [key]: e.target.value }));
  };

  const fetchSubjectToEdit = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getSubjectById(id);
      const subject = res.data?.[0];

      if (!subject) throw new Error("ไม่พบข้อมูลรายวิชา");

      setForm({
        id: subject.subjectId || id,
        name: subject.name_en || "",
        credit: subject.credit ?? "",
        type: subject.type || "วิชาแกน",
        prerequisite: subject.prerequisite_en || "",
        platform: subject.platform || "",
        detail_th: subject.description_th || "",
        detail_en: subject.description_en || "",
        theoryHr: subject.theoryHr ?? "0",
        practiceHr: subject.practiceHr ?? "0",
        selfLearningHr: subject.selfLearningHr ?? "0",
      });
    } catch (err) {
      setError(err.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!state?.subject) {
      fetchSubjectToEdit();
    }
  }, [id]);

  const handleCancel = () => {
    navigate(`/subjects/${id}`);
  };

  const handleBack = () => {
    navigate(`/subjects/${id}`);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);

      const payload = {
        subjectId: form.id,
        year: state?.subject?.year || "2564",
        name_en: form.name,
        name_th: state?.subject?.name_th || form.name,
        theoryHr: state?.subject?.theoryHr || "0",
        practiceHr: state?.subject?.practiceHr || "0",
        selfLearningHr: state?.subject?.selfLearningHr || "0",
        prerequisite_th: state?.subject?.prerequisite_th || "ไม่มี",
        prerequisite_en: form.prerequisite || "NONE",
        credit: Number(form.credit) || 0,
        description_th: form.detail_th,
        description_en: form.detail_en,
        semester: state?.subject?.semester || "",
        type: form.type === "วิชาแกน" ? "" : form.type,
        platform: form.platform,
      };

      await upsertSubject(payload);

      alert("บันทึกสำเร็จ ✅");

      navigate(`/subjects/${form.id}`);
    } catch (err) {
      setError(err.message || "บันทึกไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeMenu="subjects" />
      <div className="flex-1 max-h-screen overflow-y-auto">
        <Navbar title="Edit Subject" />

        <div className="p-6">
          <button
            onClick={handleBack}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Detail
          </button>

          {/* ✅ Loading */}
          {loading && (
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              Loading...
            </div>
          )}

          {/* ✅ Error */}
          {error && (
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center text-red-500 mb-4">
              {error}
            </div>
          )}

          {!loading && (
            <form
              onSubmit={handleSave}
              className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
            >
              {/* Subject ID */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Subject ID
                </label>
                <input
                  type="text"
                  className="w-full md:w-80 rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={form.id}
                  onChange={onChange("id")}
                  placeholder="เช่น 01076123"
                />
              </div>

              {/* Subject Name + Credit */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Subject Name
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={form.name}
                    onChange={onChange("name")}
                    placeholder="Subject name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Credit
                  </label>
                  <input
                    type="text"
                    className="w-full md:w-40 rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={form.credit}
                    onChange={onChange("credit")}
                    placeholder="3"
                  />
                </div>
              </div>

              {/* Theory / Practice / Self Learning Hours */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Theory Hr
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={form.theoryHr}
                    onChange={onChange("theoryHr")}
                    placeholder="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Practice Hr
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={form.practiceHr}
                    onChange={onChange("practiceHr")}
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Self Learning Hr
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={form.selfLearningHr}
                    onChange={onChange("selfLearningHr")}
                    placeholder="6"
                  />
                </div>
              </div>

              {/* Type + Prerequisite */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Type
                  </label>
                  <select
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={form.type}
                    onChange={onChange("type")}
                  >
                    {TYPE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Prerequisite
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={form.prerequisite}
                    onChange={onChange("prerequisite")}
                    placeholder="NONE"
                  />
                </div>
              </div>

              {/* Platform */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Platform
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={form.platform}
                  onChange={onChange("platform")}
                  placeholder="Google Classroom"
                />
              </div>

              {/* Details */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Detail_TH
                </label>
                <textarea
                  className="w-full min-h-32 rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={form.detail_th}
                  onChange={onChange("detail_th")}
                  placeholder="รายละเอียดภาษาไทย"
                />
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Detail_EN
                </label>
                <textarea
                  className="w-full min-h-32 rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={form.detail_en}
                  onChange={onChange("detail_en")}
                  placeholder="Detail in English"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 rounded-2xl bg-red-500 text-white hover:bg-red-600"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}