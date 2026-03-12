import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { ArrowLeft, PenLine } from "lucide-react";
import { getSubjectById } from "../../services/subjectService";

const DisplayField = ({ label, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-500 mb-2">
      {label}
    </label>
    <div className="bg-gray-50 rounded-lg p-3 text-gray-900 shadow-sm">
      <div className="whitespace-pre-line">{children || "-"}</div>
    </div>
  </div>
);

export default function SubjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSubjectDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getSubjectById(id);
      
      const subject = res.data?.[0];

      if (!subject) {
        throw new Error("ไม่พบข้อมูลรายวิชา");
      }

      setData(subject);
    } catch (err) {
      setError(err.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjectDetail();
  }, [id]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeMenu="subjects" />

      <div className="flex-1 max-h-screen overflow-y-auto">
        <Navbar title={data?.name_en || "Subject Detail"} />

        <div className="p-6">
          {/* Back */}
          <button
            onClick={() => navigate("/subjectslist")}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to List
          </button>

          {/* Loading */}
          {loading && (
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              Loading...
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center text-red-500">
              {error}
            </div>
          )}

          {/* Content */}
          {!loading && !error && data && (
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              {/* Header row */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-lg font-semibold text-gray-900 leading-none">
                    {data.subjectId}
                  </div>
                  <div className="mt-1 text-xl font-semibold text-gray-900">
                    {data.name_en}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-lg font-medium text-gray-900 leading-none">
                    {data.credit} ({data.theoryHr}-{data.practiceHr}-{data.selfLearningHr})
                  </div>

                  <button
                    onClick={() =>
                      navigate(`/subjects/${data.subjectId}/edit`, {
                        state: { subject: data },
                      })
                    }
                    className="flex items-center bg-red-500 text-white px-4 py-2 rounded-2xl hover:bg-red-600 transition-colors"
                  >
                    <PenLine size={16} className="mr-2" />
                    Edit
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Type
                  </label>
                  <div className="text-gray-900 bg-gray-50 p-3 rounded-lg leading-6 break-words">
                    {data.type || "วิชาแกน"}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Prerequisite
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {data.prerequisite_en || "-"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Platform
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {data.platform || "-"}
                  </p>
                </div>
              </div>

              <div className="mb-2">
                <DisplayField label="Detail_TH">
                  {data.description_th}
                </DisplayField>
              </div>

              <div>
                <DisplayField label="Detail_ENG">
                  {data.description_en}
                </DisplayField>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}