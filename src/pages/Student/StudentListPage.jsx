import { useEffect, useState, useRef } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from '../../components/Sidebar';
import {FileText} from 'lucide-react';
import { getStudentList, uploadStudentExcel } from "../../services/studentService";

const StudentListPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const fileInputRef = useRef(null);

  const fetchStudents = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getStudentList();
      setStudents(data || []);
    } catch (err) {
      setError(err.message || "Failed to load student list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (!uploadMessage) return;

    const timer = setTimeout(() => {
      setUploadMessage("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [uploadMessage]);

  const handleClickExcelButton = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadMessage("");
    setError("");

    try {
      await uploadStudentExcel(file);
      setUploadMessage("Upload Excel สำเร็จ และกำลังโหลดข้อมูลใหม่...");
      await fetchStudents(); // refresh list
    } catch (err) {
      setError(err.message || "Upload Excel ล้มเหลว");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeMenu="subjects" /> {/* Sidebar */}
      {/* Main Content */}
      <div className="flex-1">
        <Navbar title="Subjects List" /> {/* Navbar */}

        {/* Search and Actions */}
        <div className="p-6">
          <div className="flex items-center justify-end mb-6">
            <div className="flex space-x-3 ml-4">
              <button 
                onClick={handleClickExcelButton}
                disabled={uploading}
                className="flex items-center px-4 py-2 bg-[#28C195] text-white rounded-2xl hover:bg-green-600 transition-colors"
                >
                <FileText size={16} className="mr-2" />
                {uploading ? "Uploading..." : "Excel"}
              </button>
              {/* hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onClick={(e) => {
                  e.currentTarget.value = "";
                }}
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Error / Upload message / Loading */}
          {error && (
            <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {uploadMessage && (
            <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
              {uploadMessage}
            </div>
          )}
          {loading && (
            <div className="mb-4 text-sm text-gray-500">Loading students...</div>
          )}

          {/* Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="max-h-[700px] overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thai Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Eng Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admission Year</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.accId} className="hover:bg-gray-50">
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.accId}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">
                        {student.fullname_th || "-"}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">
                        {student.fullName_en || "-"}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">
                        {student.year}
                      </td>
                    </tr>
                  ))}

                  {!loading && !error && students.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-5 text-center text-sm text-gray-500"
                      >
                        No students found.
                      </td>
                    </tr>
                  )}
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