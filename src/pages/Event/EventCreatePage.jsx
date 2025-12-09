import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { createEvent } from "../../services/eventService";

function toInputDate(d = new Date()) {
  // YYYY-MM-DD สำหรับ <input type="date">
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
}

// รวม date + time เป็น ISO (จะกลายเป็น UTC)
function buildDateTime(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null;
  const local = new Date(`${dateStr}T${timeStr}:00`);
  return local.toISOString();
}

const CreateEventPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    location: "",
    date: toInputDate(),
    startTime: "09:00",
    endTime: "12:00",
    allDayChecked: false,
    status: 1,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isSubmitDisabled = useMemo(
    () => !form.name.trim() || submitting,
    [form.name, submitting]
  );

  const onChange = (key) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setForm((prev) => {
      if (key === "allDayChecked" && value === true) {
        // ถ้า All Day → ไม่ใช้เวลา
        return {
          ...prev,
          allDayChecked: true,
          startTime: "",
          endTime: "",
        };
      }
      if (key === "allDayChecked" && value === false) {
        // เลิก All Day → ใส่ default time กลับ
        return {
          ...prev,
          allDayChecked: false,
          startTime: prev.startTime || "09:00",
          endTime: prev.endTime || "12:00",
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
        name: form.name.trim(),
        location: form.location.trim(),
        startDateTime,
        endDateTime,
        allDayChecked: form.allDayChecked,
        status: form.status,
        accId: "Jirasak",
      };

      console.log("Create Event payload =>", payload);

      const res = await createEvent(payload); // { message: "Sucess" }
      setSuccess(res.message || "Create success");

      // เสร็จแล้วกลับไปหน้า list
      navigate("/eventslist");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create event");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeMenu="events" />

      <div className="flex-1 max-h-screen overflow-y-auto">
        <Navbar title="Create Event" />

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
};

export default CreateEventPage;