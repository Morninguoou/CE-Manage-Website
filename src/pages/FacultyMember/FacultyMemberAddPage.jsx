import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../components/Navbar";
import Sidebar from '../../components/Sidebar';
import { ArrowLeft, Save } from 'lucide-react';
import { createFacultyMember } from '../../services/facultyService';

const FacultyMemberAddPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // ❌ ไม่มี id (accId) ให้กรอกแล้ว
    nameTH: '',
    nameENG: '',
    email: '',
    tel: '',
    room: '',
    imagePath: '',
    teachDegree: '',
    education: {
      doctorate: '',
      master: '',
      bachelor: ''
    },
  });
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  // ลิสต์คำนำหน้า/ตำแหน่งที่มักพบ เพื่อตัดออกก่อน gen
  const TITLE_TOKENS = new Set([
    'mr','mrs','ms','miss',
    'dr','prof',
    'asst','assoc',
    'asstprof','assocprof',
    'asst.prof','assoc.prof','prof.dr','asst.prof.dr','assoc.prof.dr'
  ]);

  // gen accId จาก "คำแรกหลังคำนำหน้า" แล้วเก็บไว้เป็น a-zA-Z0-9 เท่านั้น
  const genAccIdFromEng = (eng) => {
    if (!eng) return "";

    // ตัดเครื่องหมายทั่วไปออก แล้วแตกเป็นคำ
    const words = eng
      .replace(/[.,()]/g, " ")
      .split(/\s+/)
      .map(w => w.trim())
      .filter(Boolean);

    // กรองคำนำหน้า (เช็คหลังเอา . ออกและเป็น lower)
    const cleaned = words.filter(w => !TITLE_TOKENS.has(w.toLowerCase().replace(/\./g, '')));

    if (!cleaned.length) return "";

    // เอาคำแรกเป็นชื่อ (ตามตัวอย่างอยากได้ "Amnach" จาก "Amnach Khawne")
    const first = cleaned[0];

    // เก็บเฉพาะ a-zA-Z0-9
    const onlyAN = first.replace(/[^A-Za-z0-9]/g, "");

    return onlyAN;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEducationChange = (level, value) => {
    setFormData(prev => ({
      ...prev,
      education: { ...prev.education, [level]: value }
    }));
  };

  const handleBack = () => navigate('/facultymemberslist');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErr("");

      // ✅ gen accId จากชื่ออังกฤษเสมอ (ไม่ต้องมีช่องให้กรอก)
      const accId = genAccIdFromEng(formData.nameENG);
      if (!accId) {
        throw new Error("โปรดกรอกชื่อภาษาอังกฤษให้ถูกต้องเพื่อสร้าง Acc ID อัตโนมัติ");
      }

      // ส่งขึ้น API โดยแนบ id (accId) ที่ gen มา
      const created = await createFacultyMember({ ...formData, id: accId });

      // ไปหน้า Detail ของ accId ที่สร้าง
      navigate(`/facultymember/${created?.id || accId}`);
    } catch (e2) {
      setErr(e2.message || "บันทึกไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeMenu="subjects" />

      <div className="flex-1 max-h-screen overflow-y-auto">
        <Navbar title="Add Faculty Member" />

        <div className="p-6">
          <button
            onClick={handleBack}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to List
          </button>

          {err && <div className="bg-white rounded-2xl shadow p-4 mb-4 text-red-600">{err}</div>}

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">เพิ่มข้อมูลอาจารย์</h1>
            </div>

            {/* ข้อมูลพื้นฐาน */}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.nameENG}
                    onChange={(e) => handleInputChange('nameENG', e.target.value)}
                    placeholder="เช่น Asst.Prof. Dr. Amnach Khawne"
                  />
                  {/* แสดงตัวอย่าง accId ที่จะถูกสร้าง (read-only) */}
                  <p className="text-xs text-gray-500 mt-1">
                    Acc ID ที่จะสร้าง: <span className="font-mono">
                      {genAccIdFromEng(formData.nameENG) || "-"}
                    </span>
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email" required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="เช่น example@kmitl.ac.th"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">เบอร์โทรศัพท์</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.tel}
                    onChange={(e) => handleInputChange('tel', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ห้องทำงาน</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.room}
                    onChange={(e) => handleInputChange('room', e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Path รูป (เช่น /faculty/download/Amnach)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.imagePath || ""}
                    onChange={(e) => handleInputChange('imagePath', e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">ระดับที่สอน</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.teachDegree || ""}
                    onChange={(e) => handleInputChange('teachDegree', e.target.value)}
                    placeholder="เช่น ปริญญาตรี, ปริญญาโท, ปริญญาเอก"
                  />
                </div>
              </div>
            </div>

            {/* การศึกษา */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">การศึกษา</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ปริญญาตรี</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.education.bachelor}
                    onChange={(e) => handleEducationChange('bachelor', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ปริญญาโท</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.education.master}
                    onChange={(e) => handleEducationChange('master', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ปริญญาเอก</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.education.doctorate}
                    onChange={(e) => handleEducationChange('doctorate', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center px-6 py-2 bg-[#28C195] text-white rounded-2xl hover:bg-green-600 disabled:opacity-60"
              >
                <Save size={16} className="mr-2" />
                {saving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FacultyMemberAddPage;