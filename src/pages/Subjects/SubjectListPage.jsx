import React, { useEffect, useState,} from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../components/Navbar";
import Sidebar from '../../components/Sidebar';
import {FileText, Plus, Trash2, Upload, Sparkles } from 'lucide-react';
import { getSubjects, importSubjectFile, deleteSubject } from "../../services/subjectService";

const SubjectListPage = () => {
  const [openUploadFileModal, setOpenUploadFileModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = React.useRef(null);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    curriculum_year: '',
    gened_credits: '',
    major_credits: '',
    required_credits: '',
    required_elective_credits: '',
    major_elective_credits: '',
    free_elective_credits: '',
    student_year: '',
  });

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const res = await getSubjects();
      setSubjects(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);


  const getStatusColor = (status) => {
    switch (status) {
      case 'วิชาบังคับ': return 'text-[#0070DC] font-bold border border-blue-300';
      case 'วิชาบังคับเลือก': return 'text-[#D02D2D] font-bold border border-red-300';
      case 'วิชาเลือกเฉพาะสาขา': return 'text-[#FFC554] font-bold border border-yellow-300';
      default: return 'text-gray-700 border border-gray-300';
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      alert("กรุณาเลือกไฟล์");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("curriculum_year", form.curriculum_year);
    formData.append("gened_credits", form.gened_credits);
    formData.append("major_credits", form.major_credits);
    formData.append("required_credits", form.required_credits);
    formData.append("required_elective_credits", form.required_elective_credits);
    formData.append("major_elective_credits", form.major_elective_credits);
    formData.append("free_elective_credits", form.free_elective_credits);
    formData.append("student_year", form.student_year);

    try {
      await importSubjectFile(formData);
      await fetchSubjects();
      alert("Import สำเร็จ 🎉");
      setOpenUploadFileModal(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleFileClick = () => {
  fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (subject) => {
    const confirmDelete = window.confirm(
      `คุณต้องการลบวิชา ${subject.subjectId} ใช่หรือไม่ ?`
    );
  
    if (!confirmDelete) return;
  
    try {
      await deleteSubject(subject.subjectId, subject.year);
    
      alert("ลบข้อมูลสำเร็จ 🗑️");
    
      await fetchSubjects();
    } catch (err) {
      alert(err.message || "ลบข้อมูลไม่สำเร็จ");
    }
  };


  const handleDetail = (subject) => {
    navigate(`/subjects/${subject.subjectId}`,{ 
      state: { subject }
    });
  };

  // const handleAddNew = () => {
  //   navigate("/subjects/create");
  // };

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
                onClick={() => setOpenUploadFileModal(true)}
                className="flex items-center px-4 py-2 bg-[#28C195] text-white rounded-2xl hover:bg-green-600 transition-colors"
                >
                  <FileText size={16} className="mr-2" />
                  Upload Doc
              </button>
              {/* <button 
                onClick={handleAddNew}
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-colors">
                <Plus size={16} className="mr-2" />
                Add New
              </button> */}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="max-h-[700px] overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-balance text-xs font-medium text-gray-500 uppercase tracking-wider">Subject ID</th>
                    <th className="px-6 py-3 text-balance text-xs font-medium text-gray-500 uppercase tracking-wider">Credit</th>
                    <th className="px-6 py-3 text-balance text-xs font-medium text-gray-500 uppercase tracking-wider">Subject Name</th>
                    <th className="px-6 py-3 text-balance text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-balance text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                    <th className="px-6 py-3 text-balance text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading && (
                    <tr>
                      <td colSpan="6" className="text-center py-6">Loading...</td>
                    </tr>
                  )}

                  {error && (
                    <tr>
                      <td colSpan="6" className="text-center py-6 text-red-500">
                        {error}
                      </td>
                    </tr>
                  )}
                  {!loading && subjects.map((subject, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900">
                        {subject.subjectId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                        {subject.credit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                        {subject.name_en}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(subject.type)}`}>
                          {subject.type || "วิชาแกน"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                        {subject.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 justify-center">
                        <button
                          onClick={() => handleDetail(subject)}
                          className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-200 transition-colors">
                          Detail
                        </button>
                        <button
                            type="button"
                            onClick={() => handleDelete(subject)}
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
      {openUploadFileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl w-full max-w-3xl p-6 relative">

            {/* Header */}
            <h2 className="text-xl font-bold mb-4">
              ข้อมูลหน่วยกิตในหลักสูตร
            </h2>

            {/* Form */}
            <div className="text-sm">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="font-medium">ปีของหลักสูตร</label>
                  <input
                    name="curriculum_year"
                    value={form.curriculum_year}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="font-medium">ใช้กับนักศึกษารหัส</label>
                  <input
                    name="student_year"
                    value={form.student_year}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
              </div>
              <div className='font-bold text-lg mb-2'>
                Detail
              </div>
              <div className="mb-4">
                  <label className="font-medium">หมวดวิชาศึกษาทั่วไป</label>
                  <input
                    name="gened_credits"
                    value={form.gened_credits}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
              </div>
              <div className="mb-4">
                  <label className="font-medium">หมวดวิชาเฉพาะ</label>
                  <input
                    name="major_credits"
                    value={form.major_credits}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
              <div className='grid grid-cols-3 gap-4 mb-4'>
                <div>
                  <label className="font-medium">วิชาบังคับ</label>
                  <input
                    name="required_credits"
                    value={form.required_credits}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>

                <div>
                  <label className="font-medium">วิชาบังคับเลือก</label>
                  <input
                    name="required_elective_credits"
                    value={form.required_elective_credits}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                    />
                </div>
                <div>
                  <label className="font-medium">วิชาเลือกเฉพาะสาขา</label>
                  <input
                    name="major_elective_credits"
                    value={form.major_elective_credits}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1" />
                </div>
              </div>
              <div className="col-span-2">
                  <label className="font-medium">หมวดวิชาเลือกเสรี</label>
                  <input
                    name="free_elective_credits"
                    value={form.free_elective_credits}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1" />
                </div>
            </div>

            {/* Upload Zone */}
            <div
              onClick={handleFileClick}
              className="mt-6 border-2 border-dashed rounded-xl p-6 text-center text-gray-500 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition"
            >
              <div  className="flex justify-center">
                <Upload className="w-12 h-12 mb-3 text-blue-500 transition-colors" />
              </div>
              <p className="font-medium">
                {selectedFile ? selectedFile.name : 'Drop a file here or click to browse'}
              </p>
              <p className="text-xs mt-1">
                Supports DOCX formats
              </p>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".docx"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-between gap-3 mt-6">
              <button
                onClick={() => setOpenUploadFileModal(false)}
                className="px-4 py-2 rounded-xl border bg-red-500 text-white hover:bg-red-600"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
              >
                Import
              </button>
            </div>

            {/* Close Icon */}
            <button
              onClick={() => setOpenUploadFileModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectListPage;