import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

function toInputDate(d = new Date()) {
  // YYYY-MM-DD สำหรับ <input type="date">
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
}

const TEACHERS = [
  { id: "t1", name: "Dr. Alice" },
  { id: "t2", name: "Dr. Bob" },
  { id: "t3", name: "Prof. Carol" },
];

const CreateEventPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    location: "",
    date: toInputDate(),
    time: "09:00",
    allDay: false,
    sendAll: false,
    sentTo: "",
  });

  const isSubmitDisabled = useMemo(() => !form.title.trim(), [form.title]);

  const onChange = (key) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => {
      // ถ้า allDay ถูกติ๊ก -> ล้างเวลา
      if (key === "allDay" && value === true) {
        return { ...prev, [key]: value, time: "" };
      }
      // ถ้า sendAll ถูกติ๊ก -> ล้างผู้รับ
      if (key === "sendAll" && value === true) {
        return { ...prev, [key]: value, sentTo: "" };
      }
      return { ...prev, [key]: value };
    });
  };

  const handleCancel = () => navigate("/eventslist");

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      title: form.title.trim(),
      location: form.location.trim(),
      date: form.date,
      time: form.allDay ? null : form.time,
      allDay: form.allDay,
      sendAll: form.sendAll,
      sentTo: form.sendAll ? [] : form.sentTo ? [form.sentTo] : [],
    };

    // TODO: เรียก API ที่นี่
    console.log("Create Event payload =>", payload);
    navigate("/eventslist");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="flex h-screen">
        <Sidebar activeMenu="events" />
      </div>

      {/* Main */}
      <div className="flex-1">
        <Navbar title="Create Event" />

        <div className="p-6">
          <div className="bg-white rounded-2xl shadow border border-gray-100">
            <form onSubmit={handleSubmit} className="p-6 md:p-8">
              {/* Header */}
              <div className="mb-6">
                <button type="button" className="px-3 py-1 text-sm border rounded-lg border-[#01399A]">
                  Header
                </button>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <label className="md:col-span-2 text-sm text-gray-700">Event :</label>
                  <input
                    type="text"
                    className="md:col-span-10 w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={form.title}
                    onChange={onChange("title")}
                    placeholder="Enter event name"
                  />
                </div>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <label className="md:col-span-2 text-sm text-gray-700">Location :</label>
                  <input
                    type="text"
                    className="md:col-span-10 w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={form.location}
                    onChange={onChange("location")}
                    placeholder="Room / Building"
                  />
                </div>
              </div>

              {/* Time */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <button type="button" className="px-3 py-1 text-sm border rounded-lg border-[#01399A]">
                    Time
                  </button>

                  <label className="flex items-center gap-2 text-sm">
                    <span>All day</span>
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={form.allDay}
                      onChange={onChange("allDay")}
                    />
                  </label>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <label className="md:col-span-2 text-sm text-gray-700">Date:</label>
                  <input
                    type="date"
                    className="md:col-span-6 w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={form.date}
                    onChange={onChange("date")}
                  />

                  <input
                    type="time"
                    className="md:col-span-4 w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={form.time}
                    onChange={onChange("time")}
                    disabled={form.allDay}
                  />
                </div>
              </div>

              {/* Share */}
              <div className="mb-8">
                <button type="button" className="px-3 py-1 text-sm border rounded-lg border-[#01399A]">
                  Share
                </button>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <label className="md:col-span-2 text-sm text-gray-700">Send to all teacher</label>
                  <input
                    type="checkbox"
                    className="h-4 w-4 md:col-span-1"
                    checked={form.sendAll}
                    onChange={onChange("sendAll")}
                  />
                </div>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <label className="md:col-span-2 text-sm text-gray-700">Sent to</label>
                  <select
                    className="md:col-span-10 w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={form.sentTo}
                    onChange={onChange("sentTo")}
                    disabled={form.sendAll}
                  >
                    <option value="">Select teacher…</option>
                    {TEACHERS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
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
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CreateEventPage;
