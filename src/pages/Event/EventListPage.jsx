import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { Plus, Pen, Trash2 } from "lucide-react";
import { getEventList, deleteEvent } from "../../services/eventService";
import CronScheduleModal from '../../components/CronScheduleModal';

function formatDateToDDMMYYYY(iso) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

function formatTime(startIso, endIso, allDayChecked) {
  if (allDayChecked) return "All Day";

  const start = new Date(startIso);
  const end = new Date(endIso);

  const fmt = (d) =>
    d.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  return `${fmt(start)} - ${fmt(end)}`;
}

const EventListPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openScheduleModal, setOpenScheduleModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null); // สำหรับ disable ปุ่มระหว่างลบ

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getEventList();

        const mapped = data.map((e) => ({
          id: e.eventId,
          title: e.name,
          location: e.location,
          date: e.startDateTime,
          time: formatTime(e.startDateTime, e.endDateTime, e.allDayChecked),
          status: e.status,
        }));

        setEvents(mapped);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleCreate = () => navigate("/event/create");
  const handleEditClick = (id) => navigate(`/event/edit/${id}`);

  const handleDeleteClick = async (id) => {
    const ok = window.confirm("ต้องการลบ Event นี้หรือไม่?");
    if (!ok) return;

    setError("");
    setDeletingId(id);
    try {
      const res = await deleteEvent(id); // { message: "Deleted" }
      console.log("Delete result:", res);

      // ลบออกจาก state ทันที
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete event");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="flex h-screen">
        <Sidebar 
          activeMenu="eventslist"
          onOpenSchedule={() => setOpenScheduleModal(true)}
        /> {/* Sidebar */}
      </div>

      {/* Main */}
      <div className="flex-1">
        <Navbar title="Events List" />

        <div className="p-6">
          {/* Create */}
          <div className="flex items-center justify-end mb-6">
            <button
              onClick={handleCreate}
              className="inline-flex items-center px-4 py-2 rounded-2xl bg-red-500 text-white hover:bg-red-600 transition"
            >
              <Plus size={16} className="mr-2" />
              Create Events
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Table Card */}
          <div className="bg-white rounded-lg shadow">
            {loading ? (
              <div className="py-16 text-center text-gray-500 text-sm">
                Loading events...
              </div>
            ) : (
              <div className="max-h-[700px] overflow-y-auto rounded-xl">
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-3 text-balance text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Event
                      </th>
                      <th className="px-6 py-3 text-balance text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-balance text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-balance text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-3 text-balance text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {events.map((event) => (
                      <tr key={event.id} className="hover:bg-gray-50">
                        <td className="px-5 py-4 text-sm text-gray-900">
                          <div className="flex items-center justify-center">
                            <span className="font-medium">{event.title}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-700 text-center">
                          {event.location}
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-700 text-center">
                          {formatDateToDDMMYYYY(event.date)}
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-700 text-center">
                          {event.time}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 justify-center">
                            <button
                              type="button"
                              onClick={() => handleEditClick(event.id)}
                              className="px-2 py-2.5 rounded-xl transition-colors bg-[#DBEAFE] text-[#498EFF] hover:bg-[#b4d2f9] hover:text-white"
                            >
                              <Pen size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteClick(event.id)}
                              className="px-2 py-2.5 rounded-xl transition-colors bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50"
                              disabled={deletingId === event.id}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {events.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-5 py-10 text-center text-sm text-gray-500"
                        >
                          No events found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            <CronScheduleModal
              open={openScheduleModal}
              onClose={() => setOpenScheduleModal(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventListPage;