import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from "../../components/Navbar";
import Sidebar from '../../components/Sidebar';
import { ArrowLeft, PenLine } from 'lucide-react';

const FacultyMemberDetailPage = () => {
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
        doctorate: 'วศ.ม. วิศวกรรมคอมพิวเตอร์ (สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง)',
        master: 'วศ.บ. วิศวกรรมโยธา (สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง)',
        bachelor: '-'
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

  // หาข้อมูลสมาชิกตาม id
  const member = facultyMembers.find(m => m.id === parseInt(id)) || facultyMembers[0];

  const handleBack = () => {
    navigate('/facultymemberslist');
  };

  const handleEdit = () => {
    navigate(`/editfacultymember/${id}`);
  };

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

          {/* Faculty Member Detail Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            {/* Header with Name and Edit Button */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {member.nameTH}
                </h1>
                <p className="text-lg text-gray-600">
                  ({member.nameENG})
                </p>
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
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{member.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">เบอร์โทรศัพท์</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{member.tel}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">ห้องทำงาน</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{member.room}</p>
              </div>
            </div>

            {/* Education Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                การศึกษา
              </h2>
              <div className="space-y-4">
                {/* ปริญญาเอก */}
                <div className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div>
                    <span className="font-medium text-gray-900">ปริญญาตรี :</span>
                    <span className="text-gray-700 ml-2">{member.education.doctorate}</span>
                  </div>
                </div>
                
                {/* ปริญญาโท */}
                <div className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div>
                    <span className="font-medium text-gray-900">ปริญญาโท :</span>
                    <span className="text-gray-700 ml-2">{member.education.master}</span>
                  </div>
                </div>
                
                {/* ปริญญาตรี */}
                <div className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div>
                    <span className="font-medium text-gray-900">ปริญญาเอก :</span>
                    <span className="text-gray-700 ml-2">{member.education.bachelor}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Experience Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                งานวิจัย
              </h2>
              <ul className="space-y-2">
                {member.research.map((exp, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700">{exp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Research Interests Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                ภาระงานสอน
              </h2>
              <ul className="space-y-2">
                {member.subject.map((research, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700">{research}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyMemberDetailPage;