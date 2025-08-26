import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { ArrowLeft, PenLine } from "lucide-react";

const DisplayField = ({ label, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-500 mb-2">
      {label}
    </label>
    <div className="bg-gray-50 rounded-lg p-3 text-gray-900 shadow-sm">
      <div className="whitespace-pre-line">
        {children || "-"}
      </div>
    </div>
  </div>
);


export default function SubjectDetailPage() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const data =
    state?.subject || {
      id,
      credit: "2(2-0-4)",
      name: "USER EXPERIENCE AND USER INTERFACE DESIGN",
      type: "บังคับ",
      prerequisite: "01076105 OBJECT ORIENTED PROGRAMMING",
      platform: "Google Classroom",
      detail_th:
        "วิชานี้แนะนำขั้นตอนของการออกแบบประสบการณ์และการออกแบบส่วนติดต่อผู้ใช้งาน โดยจะมีจุดมุ่งหมายให้นักศึกษาได้คุ้นเคยกับแนวคิด วิธีปฏิบัติและเทคนิคที่จำเป็นในการสร้างประสบการณ์ของผู้ใช้งาน ซึ่งเป็นส่วนหนึ่งของการพัฒนาการเชื่อมโยงข่าวสาร วิชานี้จะให้นักศึกษาได้มีโอกาสในการค้นหาทรัพยากร พัฒนาทักษะ และฝึกปฏิบัติที่จำเป็นต่อการออกแบบ พัฒนาและประเมินส่วนติดต่อข้อมูลจากมุมมองของผู้ใช้งาน",
      detail_en:
        "This course provides a comprehensive overview of the user experience and user interface design process, and is intended to familiarize students with the methods, concepts, and techniques necessary to make user experience design an integral part of developing information interfaces. The course provides students with an opportunity to acquire the resources, skills, and hands -on experience they need to design, develop, and evaluate information interfaces from a user -centered design perspective.",
    };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeMenu="subjects" />

      <div className="flex-1 max-h-screen overflow-y-auto">
        <Navbar title={data.name || "Subject Detail"} />

        <div className="p-6">
          {/* Back */}
          <button
            onClick={() => navigate("/subjectslist")}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to List
          </button>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            {/* Header row */}
            <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-lg font-semibold text-gray-900 leading-none">
                    {data.id}
                  </div>
                  <div className="mt-1 text-xl font-semibold text-gray-900">
                    {data.name}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-lg font-medium text-gray-900 leading-none">
                    {data.credit}
                  </div>
                  <button
                    onClick={() =>
                      navigate(`/subjects/${data.id}/edit`, { state: { subject: data } })
                    }
                    className="flex items-center bg-red-500 text-white px-4 py-2 rounded-2xl hover:bg-red-600 transition-colors"
                  >
                    <PenLine size={16} className="mr-2" />
                    Edit
                  </button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Type</label>
                  <div className="text-gray-900 bg-gray-50 p-3 rounded-lg leading-6 break-words">{data.type || "-"}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Prerequisite</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{data.prerequisite || "-"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Platform</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{data.platform || "-"}</p>
                </div>
            </div>
            <div className="mb-2">
              <DisplayField label="Detail_TH">
                {data.detail_th}
              </DisplayField>
            </div>
            <div>
              <DisplayField label="Detail_ENG">
                {data.detail_en}
              </DisplayField>
            </div>
          </div>
          {/* /Card */}
        </div>
      </div>
    </div>
  );
}