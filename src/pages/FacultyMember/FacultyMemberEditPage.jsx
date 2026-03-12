import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from "../../components/Navbar";
import Sidebar from '../../components/Sidebar';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { getFacultyMemberById, upsertFacultyMember } from "../../services/facultyService";

const FacultyMemberEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: "",
    nameTH: "",
    nameENG: "",
    email: "",
    tel: "",
    room: "",
    bachelor: "",
    master: "",
    doctorate: "",
    imagePath: "",
    teachDegree: "",
  });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setErr("");
        const data = await getFacultyMemberById(id);
        if (data) {
          setFormData((prev) => ({
            ...prev,
            id: data.id || id,
            nameTH: data.nameTH,
            nameENG: data.nameENG,
            email: data.email,
            tel: data.tel,
            room: data.room,
            bachelor: data.bachelor,
            master: data.master,
            doctorate: data.doctorate,
            imagePath: data.imagePath,
            teachDegree: data.teachDegree,
          }));
        }
      } catch (e) {
        setErr(e.message || "โหลดข้อมูลล้มเหลว");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBack = () => navigate(`/facultymember/${id}`);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        email: (formData.email || "")
          .split("\n")
          .map(s => s.trim())
          .filter(Boolean)
          .join(", "),
      };
      const updated = await upsertFacultyMember(payload);

      navigate(`/facultymember/${updated?.id || id}`);
    } catch (e) {
      setErr(e.message || "อัปเดตไม่สำเร็จ");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar activeMenu="subjects" />
        <div className="flex-1 max-h-screen overflow-y-auto">
          <Navbar title="Edit Faculty Member" />
          <div className="p-6 flex items-center justify-center">กำลังโหลดข้อมูล...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeMenu="subjects" />
      <div className="flex-1 max-h-screen overflow-y-auto">
        <Navbar title="Edit Faculty Member" />

        <div className="p-6">
          <button
            onClick={handleBack}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Detail
          </button>

          {err && (
            <div className="bg-white rounded-2xl shadow p-4 mb-4 text-red-600">เกิดข้อผิดพลาด: {err}</div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">แก้ไขข้อมูลอาจารย์</h1>
            </div>

            {/* Basic */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                ข้อมูลพื้นฐาน
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ชื่อ-นามสกุล (ภาษาไทย) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text" required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.nameTH}
                    onChange={(e) => handleInputChange('nameTH', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ชื่อ-นามสกุล (ภาษาอังกฤษ) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text" required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.nameENG}
                    onChange={(e) => handleInputChange('nameENG', e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="ใส่ได้หลายบรรทัด ระบบจะรวมเป็นคอมมาอัตโนมัติ"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    หลายอีเมล: กดขึ้นบรรทัดใหม่แต่ละอัน (เช่น a@kmitl.ac.th ↵ b@gmail.com)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">เบอร์โทรศัพท์</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.tel}
                    onChange={(e) => handleInputChange('tel', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ห้องทำงาน</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.room}
                    onChange={(e) => handleInputChange('room', e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Path รูป (เช่น /faculty/download/Thana)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.imagePath}
                    onChange={(e) => handleInputChange('imagePath', e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">ระดับที่สอน (เช่น ปริญญาตรี, ปริญญาโท)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.teachDegree}
                    onChange={(e) => handleInputChange('teachDegree', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">การศึกษา</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ปริญญาตรี</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.bachelor}
                    onChange={(e) => handleInputChange('bachelor', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ปริญญาโท</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.master}
                    onChange={(e) => handleInputChange('master', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ปริญญาเอก</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.doctorate}
                    onChange={(e) => handleInputChange('doctorate', e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-between space-x-4">
              <button type="button" onClick={handleBack}
                className="px-6 py-2 border border-gray-300 rounded-2xl  bg-red-500 text-white hover:bg-red-600">
                Cancel
              </button>
              <button type="submit"
                className="flex items-center px-6 py-2 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
                <Save size={16} className="mr-2" /> Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FacultyMemberEditPage;