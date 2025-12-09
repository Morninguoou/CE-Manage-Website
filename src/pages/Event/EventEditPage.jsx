import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { getEventList, editEvent } from "../../services/eventService";

function toInputDate(d) {
  const dt = d instanceof Date ? d : new Date(d);
  const dd = String(dt.getDate()).padStart(2, "0");
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const yyyy = dt.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
}

function toInputTime(isoString) {
  if (!isoString) return "09:00";
  const dt = new Date(isoString);
  const hh = String(dt.getHours()).padStart(2, "0");
  const mm = String(dt.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function buildDateTime(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null;

  // สร้าง Date จากเวลา local (เช่น เวลาไทย)
  const local = new Date(`${dateStr}T${timeStr}:00`);

  // แปลงเป็น ISO (UTC) สำหรับเก็บใน backend
  return local.toISOString();
}


export default function EditEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    location: "",
    date: toInputDate(new Date()),
    startTime: "09:00",
    endTime: "10:00",
    allDayChecked: false,
    status: 0,
  });

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError("");
      setSuccess("");

      try {
        const events = await getEventList();
        const event = events.find((e) => e.eventId === id);

        if (!event) {
          setError("Event not found");
          setLoading(false);
          return;
        }

        setForm({
          name: event.name || "",
          location: event.location || "",
          date: toInputDate(event.startDateTime || new Date()),
          startTime: event.allDayChecked
            ? "09:00"
            : toInputTime(event.startDateTime),
          endTime: event.allDayChecked
            ? "17:00"
            : toInputTime(event.endDateTime),
          allDayChecked: !!event.allDayChecked,
          status: event.status ?? 0,
        });
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const isSubmitDisabled = useMemo(
    () => !form.name.trim() || submitting,
    [form.name, submitting]
  );

  const onChange = (key) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setForm((prev) => {
      if (key === "allDayChecked" && value === true) {
        // ถ้าเลือก All Day จะไม่ใช้ time
        return {
          ...prev,
          allDayChecked: true,
          startTime: "",
          endTime: "",
        };
      }
      if (key === "allDayChecked" && value === false) {
        // เลิก All Day เอา default time กลับมาก็ได้
        return {
          ...prev,
          allDayChecked: false,
          startTime: prev.startTime || "09:00",
          endTime: prev.endTime || "10:00",
        };
      }

      return { ...prev, [key]: value };
    });
  };

  const handleCancel = () => navigate("/eventslist");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const startDateTime = form.allDayChecked
        ? buildDateTime(form.date, "00:00")
        : buildDateTime(form.date, form.startTime);

      const endDateTime = form.allDayChecked
        ? buildDateTime(form.date, "23:59")
        : buildDateTime(form.date, form.endTime);

      const payload = {
        eventId: id,
        name: form.name.trim(),
        location: form.location.trim(),
        startDateTime,
        endDateTime,
        allDayChecked: form.allDayChecked,
        status: form.status,
      };

      console.log("Edit Event payload =>", payload);

      const res = await editEvent(payload); // { message: "Sucess Update" }
      setSuccess(res.message || "Update success");

      // กลับไปหน้า list หลังจากอัปเดตเสร็จ
      navigate("/eventslist");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update event");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar activeMenu="events" />
        <div className="flex-1">
          <Navbar title="Edit Event" />
          <div className="p-6">Loading…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeMenu="events" />

      <div className="flex-1 max-h-screen overflow-y-auto">
        <Navbar title="Edit Event" />

        <div className="p-6">
          {/* Back link */}
          <button
            type="button"
            onClick={handleCancel}
            className="text-blue-600 hover:text-blue-800 mb-4 text-sm"
          >
            &larr; Back to List
          </button>

          {/* Error / Success */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            {/* Event + Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Event :
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={form.name}
                  onChange={onChange("name")}
                  placeholder="ชื่อกิจกรรม"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Location :
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={form.location}
                  onChange={onChange("location")}
                  placeholder="เช่น ECC-810"
                />
              </div>
            </div>

            {/* Date & Time + All day */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={form.date}
                    onChange={onChange("date")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={form.startTime}
                    onChange={onChange("startTime")}
                    disabled={form.allDayChecked}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-500">
                      End Time
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-600">
                      <span>All Day</span>
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={form.allDayChecked}
                        onChange={onChange("allDayChecked")}
                      />
                    </label>
                  </div>
                  <input
                    type="time"
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={form.endTime}
                    onChange={onChange("endTime")}
                    disabled={form.allDayChecked}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 rounded-2xl bg-red-500 text-white hover:bg-red-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className="px-6 py-2 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}