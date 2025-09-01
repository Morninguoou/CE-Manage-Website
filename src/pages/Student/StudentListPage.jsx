import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../components/Navbar";
import Sidebar from '../../components/Sidebar';
import { Search, FileText, Plus, } from 'lucide-react';

const StudentListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Mock data for students
  const students = [
    { id: '65010000', name: 'Somchai', lastname: 'Pakpean' },
    { id: '65010000', name: 'Somchai', lastname: 'Pakpean' },
    { id: '65010000', name: 'Somchai', lastname: 'Pakpean' },
    { id: '65010000', name: 'Somchai', lastname: 'Pakpean' },
    { id: '65010000', name: 'Somchai', lastname: 'Pakpean' },
    { id: '65010000', name: 'Somchai', lastname: 'Pakpean' },
    { id: '65010000', name: 'Somchai', lastname: 'Pakpean' },
    { id: '65010000', name: 'Somchai', lastname: 'Pakpean' },
    { id: '65010000', name: 'Somchai', lastname: 'Pakpean' },
    { id: '65010000', name: 'Somchai', lastname: 'Pakpean' },
    { id: '65010000', name: 'Somchai', lastname: 'Pakpean' },
    { id: '65010000', name: 'Somchai', lastname: 'Pakpean' }
  ];

  const handleDetail = () => {
    // navigate(`/subjects/${subject.id}`, { state: { subject } });
    console.log("student detail");
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
                placeholder="Search by Student ID"
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.name} {student.lastname}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleDetail(student)}
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

export default StudentListPage;