import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from "../../components/Navbar";
import Sidebar from '../../components/Sidebar';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';

const FacultyMemberEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - ในความเป็นจริงคุณจะดึงข้อมูลจาก API ตาม id
  const facultyMembers = [
    { 
      id: 1, 
      nameTH: 'ผศ. ธนา หงษ์สุวรรณ', 
      nameENG: 'Asst.Prof. Thana Hongsuwan', 
      email: 'khthana@kmitl.ac.th, khthana@hotmail.com', 
      tel: '02-7392400-2 ต่อ 121', 
      room: 'ECC 911',
      education: {
        bachelor: 'วศ.ม. วิศวกรรมคอมพิวเตอร์ (สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง)',
        master: 'วศ.บ. วิศวกรรมโยธา (สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง)',
        doctorate: '-'
      },
      research: [
        'วศ.บ. วิศวกรรมคอมพิวเตอร์ (สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง)'
      ],
      subject: [
        'TCP/IP Networks',
        'Campus Network Design'
      ]
    }
  ];

  const [formData, setFormData] = useState({
    nameTH: '',
    nameENG: '',
    email: '',
    tel: '',
    room: '',
    education: {
      doctorate: '',
      master: '',
      bachelor: ''
    },
    research: [''],
    subject: ['']
  });

  const [loading, setLoading] = useState(true);

  // Load existing data when component mounts
  useEffect(() => {
    // หาข้อมูลสมาชิกตาม id
    const member = facultyMembers.find(m => m.id === parseInt(id));
    
    if (member) {
      setFormData({
        nameTH: member.nameTH,
        nameENG: member.nameENG,
        email: member.email,
        tel: member.tel,
        room: member.room,
        education: {
          doctorate: member.education.doctorate || '',
          master: member.education.master || '',
          bachelor: member.education.bachelor || ''
        },
        research: member.research && member.research.length > 0 ? member.research : [''],
        subject: member.subject && member.subject.length > 0 ? member.subject : ['']
      });
    }
    setLoading(false);
  }, [id]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEducationChange = (level, value) => {
    setFormData(prev => ({
      ...prev,
      education: {
        ...prev.education,
        [level]: value
      }
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updating data:', formData);
    
    // ที่นี่คุณจะส่งข้อมูลไปยัง API เพื่ออัพเดต
    alert('อัพเดตข้อมูลสำเร็จ!');
    navigate(`/facultymember/${id}`);
  };

  const handleBack = () => {
    navigate(`/facultymember/${id}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar activeMenu="subjects" />
        <div className="flex-1 max-h-screen overflow-y-auto">
          <Navbar title="Edit Faculty Member" />
          <div className="p-6 flex items-center justify-center">
            <div className="text-gray-500">กำลังโหลดข้อมูล...</div>
          </div>
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
          {/* Back Button */}
          <button 
            onClick={handleBack}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Detail
          </button>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">แก้ไขข้อมูลอาจารย์</h1>
            </div>

            {/* Basic Information */}
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
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.nameTH}
                    onChange={(e) => handleInputChange('nameTH', e.target.value)}
                    placeholder="เช่น ผศ. ธนา หงษ์สุวรรณ"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ชื่อ-นามสกุล (ภาษาอังกฤษ) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.nameENG}
                    onChange={(e) => handleInputChange('nameENG', e.target.value)}
                    placeholder="เช่น Asst.Prof. Thana Hongsuwan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="เช่น example@kmitl.ac.th"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    เบอร์โทรศัพท์
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.tel}
                    onChange={(e) => handleInputChange('tel', e.target.value)}
                    placeholder="เช่น 02-7392400-2 ต่อ 121"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ห้องทำงาน
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.room}
                    onChange={(e) => handleInputChange('room', e.target.value)}
                    placeholder="เช่น ECC 911"
                  />
                </div>
              </div>
            </div>

            {/* Education Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                การศึกษา
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ปริญญาตรี
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.education.bachelor}
                    onChange={(e) => handleEducationChange('bachelor', e.target.value)}
                    placeholder="เช่น วศ.บ. วิศวกรรมคอมพิวเตอร์ (สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง) หรือ -"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ปริญญาโท
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.education.master}
                    onChange={(e) => handleEducationChange('master', e.target.value)}
                    placeholder="เช่น วศ.ม. วิศวกรรมคอมพิวเตอร์ (สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง) หรือ -"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ปริญญาเอก
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.education.doctorate}
                    onChange={(e) => handleEducationChange('doctorate', e.target.value)}
                    placeholder="เช่น วศ.ด. วิศวกรรมคอมพิวเตอร์ (สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง) หรือ -"
                  />
                </div>
              </div>
            </div>

            {/* Research Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                งานวิจัย
              </h2>
              
              {formData.research.map((research, index) => (
                <div key={index} className="flex items-center gap-3 mb-3">
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={research}
                    onChange={(e) => handleArrayChange('research', index, e.target.value)}
                    placeholder={`งานวิจัยที่ ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('research', index)}
                    disabled={formData.research.length === 1}
                    className={`p-2 rounded-lg transition-colors ${
                      formData.research.length === 1 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-red-100 text-red-600 hover:bg-red-200'
                    }`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => addArrayItem('research')}
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <Plus size={16} className="mr-1" />
                เพิ่มงานวิจัย
              </button>
            </div>

            {/* Subject Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                ภาระงานสอน
              </h2>
              
              {formData.subject.map((subject, index) => (
                <div key={index} className="flex items-center gap-3 mb-3">
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={subject}
                    onChange={(e) => handleArrayChange('subject', index, e.target.value)}
                    placeholder={`วิชาที่ ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('subject', index)}
                    disabled={formData.subject.length === 1}
                    className={`p-2 rounded-lg transition-colors ${
                      formData.subject.length === 1 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-red-100 text-red-600 hover:bg-red-200'
                    }`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => addArrayItem('subject')}
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <Plus size={16} className="mr-1" />
                เพิ่มวิชา
              </button>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                Cancle
              </button>
              <button
                type="submit"
                className="flex items-center px-6 py-2 bg-[#28C195] text-white rounded-2xl hover:bg-green-600 transition-colors"
              >
                <Save size={16} className="mr-2" />
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FacultyMemberEditPage;