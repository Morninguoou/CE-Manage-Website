import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { Search, Plus, Pen } from "lucide-react";

const MOCK_EVENTS = [
  { id: 1, title: "ส่งข้อสอบกลางภาค", location: "ECC-810", date: "2024-12-12", time: "All Day" },
  { id: 2, title: "ส่งข้อสอบกลางภาค", location: "ECC-811", date: "2024-12-13", time: "09:00 - 12:00" },
  { id: 3, title: "ส่งข้อสอบกลางภาค", location: "ECC-809", date: "2024-12-14", time: "13:00 - 14:00" },
  { id: 4, title: "ส่งข้อสอบกลางภาค", location: "E12-603", date: "2024-12-20", time: "All Day" },
  { id: 5, title: "ส่งข้อสอบกลางภาค", location: "ECC-810", date: "2024-12-31", time: "09:00 - 12:00" },
  { id: 6, title: "ส่งข้อสอบกลางภาค", location: "ECC-810", date: "2025-01-01", time: "13:00 - 14:00" },
  { id: 7, title: "ส่งข้อสอบกลางภาค", location: "ECC-810", date: "2025-01-03", time: "All Day" },
  { id: 8, title: "ส่งข้อสอบกลางภาค", location: "ECC-810", date: "2025-02-01", time: "10:00 - 12:00" },
  { id: 9, title: "ส่งข้อสอบกลางภาค", location: "ECC-810", date: "2025-02-04", time: "All Day" },
];

function formatDateToDDMMYYYY(iso) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

const EventListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return MOCK_EVENTS;
    return MOCK_EVENTS.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        formatDateToDDMMYYYY(e.date).includes(q) ||
        e.time.toLowerCase().includes(q)
    );
  }, [searchTerm]);

  const handleCreate = () => navigate("/event/create");
  const handleEditClick = (id) => navigate(`/event/edit/${id}`)

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="flex h-screen">
        <Sidebar activeMenu="events" />
      </div>

      {/* Main */}
      <div className="flex-1">
        <Navbar title="Events List" />

        <div className="p-6">
          {/* Search + Create */}
          <div className="flex items-center justify-between mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search events, location, date…"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              onClick={handleCreate}
              className="ml-4 inline-flex items-center px-4 py-2 rounded-2xl bg-red-500 text-white hover:bg-red-600 transition"
            >
              <Plus size={16} className="mr-2" />
              Create Events
            </button>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-lg shadow">
            <div className="max-h-[700px] overflow-y-auto rounded-xl">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-balance text-xs font-medium text-gray-500 uppercase tracking-wider">Event </th>
                    <th className="px-6 py-3 text-balance text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-balance text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-balance text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-balance text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filtered.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4 text-sm text-gray-900">
                        <div className="flex items-center justify-center">
                          <span className="font-medium">{event.title}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-700 text-center">{event.location}</td>
                      <td className="px-5 py-4 text-sm text-gray-700 text-center">
                        {formatDateToDDMMYYYY(event.date)}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-700 text-center">{event.time}</td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 justify-center">
                          <button
                            type="button"
                            onClick={() => handleEditClick(event.id)}
                            className="px-2 py-2.5 rounded-xl transition-colors bg-[#8ecae647] text-black hover:bg-[#8ecae6d1]"
                          >
                            <Pen size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-5 py-10 text-center text-sm text-gray-500">
                        No events found
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

export default EventListPage;