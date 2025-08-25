import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Navbar from "../../components/Navbar";
import Sidebar from '../../components/Sidebar';
import { ArrowLeft, PenLine } from 'lucide-react';
import { getFacultyMemberById } from "../../services/facultyService";

const FacultyMemberDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); 
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setErr("");
        const data = await getFacultyMemberById(id);
        setMember(data);
      } catch (e) {
        setErr(e.message || "โหลดข้อมูลล้มเหลว");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id, location.key]);

  const emails = useMemo(() => {
    if (!member?.email) return [];
    return member.email.split(",").map((m) => m.trim()).filter(Boolean);
  }, [member]);

  const handleBack = () => navigate('/facultymemberslist');
  const handleEdit = () => navigate(`/editfacultymember/${id}`);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeMenu="subjects" />

      <div className="flex-1 max-h-screen overflow-y-auto">
        <Navbar title="Faculty Member Detail" />

        <div className="p-6">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to List
          </button>

          {loading && (
            <div className="bg-white rounded-2xl shadow p-6">กำลังโหลดข้อมูล…</div>
          )}

          {err && !loading && (
            <div className="bg-white rounded-2xl shadow p-6 text-red-600">
              เกิดข้อผิดพลาด: {err}
            </div>
          )}

          {/* Faculty Member Detail Card */}
          {!loading && !err && member && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-start gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {member.nameTH || "-"}
                    </h1>
                    <p className="text-lg text-gray-600">
                      ({member.nameENG || "-"})
                    </p>
                    {member.teachDegree && (
                      <p className="text-xs mt-1 text-gray-500">
                        ระดับที่สอน: {member.teachDegree}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleEdit}
                  className="flex items-center bg-red-500 text-white px-4 py-2 rounded-2xl hover:bg-red-600 transition-colors"
                >
                  <PenLine size={16} className="mr-2" />
                  Edit
                </button>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Email</label>
                  <div className="text-gray-900 bg-gray-50 p-3 rounded-lg leading-6 break-words">
                    {emails.length ? emails.map((mail, i) => <div key={i}>{mail}</div>) : "-"}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">เบอร์โทรศัพท์</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{member.tel || "-"}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">ห้องทำงาน</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{member.room || "-"}</p>
                </div>
              </div>

              {/* Education Section */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  การศึกษา
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <div>
                      <span className="font-medium text-gray-900">ปริญญาตรี :</span>
                      <span className="text-gray-700 ml-2">{member.bachelor || "-"}</span>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <div>
                      <span className="font-medium text-gray-900">ปริญญาโท :</span>
                      <span className="text-gray-700 ml-2">{member.master || "-"}</span>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <div>
                      <span className="font-medium text-gray-900">ปริญญาเอก :</span>
                      <span className="text-gray-700 ml-2">{member.doctorate || "-"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!loading && !err && !member && (
            <div className="bg-white rounded-2xl shadow p-6">ไม่พบข้อมูล</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyMemberDetailPage;