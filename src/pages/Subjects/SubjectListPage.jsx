import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../components/Navbar";
import Sidebar from '../../components/Sidebar';
import { Search, FileText, Plus, } from 'lucide-react';

const SubjectListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Mock data for subjects
  const subjects = [
    { id: '01076036', credit: '2(2-0-4)', name: 'USER EXPERIENCE AND USER INTERFACE DESIGN', type: 'บังคับ', status: 'บังคับเลือก',prerequisite: "01076105 OBJECT ORIENTED PROGRAMMING",
      platform: "Google Classroom",
      detail_th:
        "วิชานี้แนะนำขั้นตอนของการออกแบบประสบการณ์และการออกแบบส่วนติดต่อผู้ใช้งาน โดยจะมีจุดมุ่งหมายให้นักศึกษาได้คุ้นเคยกับแนวคิด วิธีปฏิบัติ และเทคนิคที่จำเป็นในการสร้างประสบการณ์ของผู้ใช้งาน ซึ่งเป็นส่วนหนึ่งของการพัฒนาการเชื่อมโยงข่าวสาร วิชานี้จะให้นักศึกษาได้มีโอกาสในการค้นหาทรัพยากร พัฒนาทักษะ และฝึกปฏิบัติที่จำเป็นต่อการออกแบบ พัฒนาและประเมินส่วนติดต่อข้อมูลจากมุมมองของผู้ใช้งาน",
      detail_en:
        "This course provides a comprehensive overview of the user experience and user interface design process, and is intended to familiarize students with the methods, concepts, and techniques necessary to make user experience design an integral part of developing information interfaces. The course provides students with an opportunity to acquire the resources, skills, and hands -on experience they need to design, develop, and evaluate information interfaces from a user -centered design perspective.", },
    { id: '01076036', credit: '2(2-0-4)', name: 'USER EXPERIENCE AND USER INTERFACE DESIGN', type: 'บังคับ', status: 'บังคับ' },
    { id: '01076036', credit: '2(2-0-4)', name: 'USER EXPERIENCE AND USER INTERFACE DESIGN', type: 'เลือกเฉพาะสาขา', status: 'บังคับ' },
    { id: '01076036', credit: '2(2-0-4)', name: 'USER EXPERIENCE AND USER INTERFACE DESIGN', type: 'บังคับเลือก', status: 'เลือกเฉพาะสาขา' },
    { id: '01076036', credit: '2(2-0-4)', name: 'USER EXPERIENCE AND USER INTERFACE DESIGN', type: 'บังคับเลือก', status: 'บังคับ' },
    { id: '01076036', credit: '2(2-0-4)', name: 'USER EXPERIENCE AND USER INTERFACE DESIGN', type: 'เลือกเฉพาะสาขา', status: 'บังคับ' },
    { id: '01076036', credit: '2(2-0-4)', name: 'USER EXPERIENCE AND USER INTERFACE DESIGN', type: 'บังคับ', status: 'บังคับเลือก' },
    { id: '01076036', credit: '2(2-0-4)', name: 'USER EXPERIENCE AND USER INTERFACE DESIGN', type: 'เลือกเฉพาะสาขา', status: 'บังคับ' },
    { id: '01076036', credit: '2(2-0-4)', name: 'USER EXPERIENCE AND USER INTERFACE DESIGN', type: 'เลือกเฉพาะสาขา', status: 'บังคับ' },
    { id: '01076036', credit: '2(2-0-4)', name: 'USER EXPERIENCE AND USER INTERFACE DESIGN', type: 'เลือกเฉพาะสาขา', status: 'บังคับ' },
    { id: '01076036', credit: '2(2-0-4)', name: 'USER EXPERIENCE AND USER INTERFACE DESIGN', type: 'เลือกเฉพาะสาขา', status: 'บังคับ' },
    { id: '01076036', credit: '2(2-0-4)', name: 'USER EXPERIENCE AND USER INTERFACE DESIGN', type: 'เลือกเฉพาะสาขา', status: 'บังคับ' },
    { id: '01076036', credit: '2(2-0-4)', name: 'USER EXPERIENCE AND USER INTERFACE DESIGN', type: 'บังคับ', status: 'เลือกเฉพาะสาขา' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'บังคับ': return 'text-[#0070DC] font-bold border border-blue-300';
      case 'บังคับเลือก': return 'text-[#D02D2D] font-bold border border-red-300';
      case 'เลือกเฉพาะสาขา': return 'text-[#FFC554] font-bold border border-yellow-300';
      default: return 'text-gray-700 border border-gray-300';
    }
  };

  const handleDetail = (subject) => {
    navigate(`/subjects/${subject.id}`, { state: { subject } });
  };

  const handleAddNew = () => {
    navigate("/subjects/create");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeMenu="subjects" /> {/* Sidebar */}
      {/* Main Content */}
      <div className="flex-1">
        <Navbar title="Subjects List" /> {/* Navbar */}

        {/* Search and Actions */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by subject ID"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-3 ml-4">
              <button className="flex items-center px-4 py-2 bg-[#28C195] text-white rounded-2xl hover:bg-green-600 transition-colors">
                <FileText size={16} className="mr-2" />
                Excel
              </button>
              <button 
                onClick={handleAddNew}
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-colors">
                <Plus size={16} className="mr-2" />
                Add New
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="max-h-[700px] overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subjects.map((subject, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {subject.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {subject.credit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {subject.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(subject.status)}`}>
                          {subject.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleDetail(subject)}
                          className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-200 transition-colors">
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectListPage;