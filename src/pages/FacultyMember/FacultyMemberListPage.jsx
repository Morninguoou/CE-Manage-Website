import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../components/Navbar";
import Sidebar from '../../components/Sidebar';
import { Search, Plus,Trash2 } from 'lucide-react';

const FacultyMemberListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Mock data for faculty members with id
  const facultyMembers = [
    { 
      id: 1, 
      nameTH: 'ผศ. ธนา หงษ์สุวรรณ', 
      nameENG: 'Asst.Prof. Thana Hongsuwan', 
      email: 'khthana@kmitl.ac.th, khthana@hotmail.com', 
      tel: '02-7392400-2 ต่อ 121', 
      room: 'ECC 911' 
    },
  ];

  // Filter function
  const filteredMembers = facultyMembers.filter(member =>
    member.nameENG.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.nameTH.includes(searchTerm) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDetailClick = (memberId) => {
    navigate(`/facultymember/${memberId}`);
  };

  const handleAddNewClick = () => {
    navigate(`/addfacultymember`);
  };

  const handleDeleteClick = (memberId) => {
    const confirmDelete = window.confirm("คุณต้องการลบข้อมูลนี้หรือไม่?");
    if (confirmDelete) {
      console.log(`ลบสำเร็จ: ${memberId}`);
      // ใส่โค้ดลบข้อมูลจริง ๆ ตรงนี้ เช่น API call
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeMenu="subjects" /> {/* Sidebar */}
      {/* Main Content */}
      <div className="flex-1">
        <Navbar title="Faculty Members List" /> {/* Navbar */}

        {/* Search and Actions */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name or email"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-3 ml-4">
              <button 
                onClick={handleAddNewClick}
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-colors"
                >
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
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thai name</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Eng name</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tel</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {member.nameTH}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-900">
                        {member.nameENG}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-900">
                        {member.email}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-900">
                        {member.tel}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium">
                          {member.room}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleDetailClick(member.id)}
                            className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-200 transition-colors"
                          >
                            Detail
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(member.id)}
                            className="px-2 py-2.5 rounded-xl transition-colors bg-red-100 text-red-600 hover:bg-red-200"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
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

export default FacultyMemberListPage;