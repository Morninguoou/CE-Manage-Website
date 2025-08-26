import React, { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft,} from 'lucide-react';
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const TYPE_OPTIONS = ["บังคับ", "บังคับเลือก", "เลือกเฉพาะสาขา"];

export default function SubjectEditPage() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const initial = useMemo(
    () =>
      state?.subject || {
        id,
        credit: "2(2-0-4)",
        name: "USER EXPERIENCE AND USER INTERFACE DESIGN",
        type: "บังคับ",
        prerequisite: "01076105 OBJECT ORIENTED PROGRAMMING",
        platform: "Google Classroom",
        detail_th:
          "วิชานี้แนะนำขั้นตอนของการออกแบบประสบการณ์และการออกแบบส่วนติดต่อผู้ใช้งาน ...",
        detail_en:
          "This course provides a comprehensive overview of the user experience and user interface design process ...",
      },
    [id, state?.subject]
  );

  const [form, setForm] = useState(initial);

  const onChange = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleCancel = () =>
    navigate(`/subjects/${initial.id}`, { state: { subject: initial } });

  const handleBack = () =>
    navigate(`/subjects/${initial.id}`, { state: { subject: initial } });

  const handleSave = (e) => {
    e.preventDefault();
    // TODO: เรียก API PUT/PATCH ถ้ามี
    console.log("UPDATE SUBJECT =>", form);
    navigate(`/subjects/${form.id}`, { state: { subject: form } });
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
                  placeholder="2(2-0-4)"
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
                  placeholder="01076105 OBJECT ORIENTED PROGRAMMING"
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
                className="px-6 py-2 rounded-2xl bg-blue-600 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}