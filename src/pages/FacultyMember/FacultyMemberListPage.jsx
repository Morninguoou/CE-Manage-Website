import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from "../../components/Navbar";
import Sidebar from '../../components/Sidebar';
import { Search, Plus,Trash2 } from 'lucide-react';
import { getFacultyMembers, deleteFacultyMember } from '../../services/facultyService';

const FacultyMemberListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const fetchData = async () => {
    try {
      setLoading(true);
      setErr("");
      const list = await getFacultyMembers();
      setMembers(list);
    } catch (e) {
      setErr(e.message || "โหลดข้อมูลล้มเหลว");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [location.key]);

  // Filter function
  const filteredMembers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) =>
      (m.nameENG || "").toLowerCase().includes(q) ||
      (m.nameTH || "").includes(searchTerm) ||
      (m.email || "").toLowerCase().includes(q)
    );
  }, [members, searchTerm]);

  const handleDetailClick = (memberId) => {
    navigate(`/facultymember/${memberId}`);
  };

  const handleAddNewClick = () => {
    navigate(`/addfacultymember`);
  };

  const handleDeleteClick = async (memberId) => {
    const confirmDelete = window.confirm("คุณต้องการลบข้อมูลนี้หรือไม่?");
    if (!confirmDelete) return;
    try {
      await deleteFacultyMember(memberId);
      alert("ลบสำเร็จ");
      await fetchData();
    } catch (e) {
      alert(e.message || "ลบไม่สำเร็จ");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <Sidebar activeMenu="subjects" /> {/* Sidebar */}
      </div>
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

          {/* states */}
          {loading && (
            <div className="bg-white rounded-lg shadow p-6">กำลังโหลดข้อมูล…</div>
          )}
          {err && !loading && (
            <div className="bg-white rounded-lg shadow p-6 text-red-600">
              เกิดข้อผิดพลาด: {err}
            </div>
          )}

          {/* Table */}
          {!loading && !err && (
          <div className="bg-white rounded-lg shadow">
            <div className="max-h-[700px] overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-balance text-xs font-medium text-gray-500 uppercase tracking-wider">Thai name</th>
                    <th className="px-4 py-3 text-balance text-xs font-medium text-gray-500 uppercase tracking-wider">Eng name</th>
                    <th className="px-4 py-3 text-balance text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-balance text-xs font-medium text-gray-500 uppercase tracking-wider">Tel</th>
                    <th className="py-3 text-balance text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                    <th className="py-3 text-balance text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-center text-gray-900">
                        {member.nameTH}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                        {member.nameENG}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                        {member.email
                          ? member.email.split(",").map((mail, idx) => (
                              <div key={idx}>{mail.trim()}</div>
                            ))
                          : "-"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                        {member.tel}
                      </td>
                      <td className="py-4 whitespace-nowrap">
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium">
                          {member.room}
                        </span>
                      </td>
                      <td className="py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 justify-center">
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
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyMemberListPage;