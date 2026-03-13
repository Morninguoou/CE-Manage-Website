import React, {useState} from "react";
import { Sparkles } from "lucide-react";
import { upsertScheduler } from "../services/schedulerService";

const CronScheduleModal = ({ open, onClose }) => {
  const [form, setForm] = useState({
    minutes: "",
    hours: "",
    dayof_month: "",
    month: "",
    dayof_week: "",
  });

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const payload = {
      minutes: form.minutes || "*",
      hours: form.hours || "*",
      dayof_month: form.dayof_month || "*",
      month: form.month || "*",
      dayof_week: form.dayof_week || "*",
    };

    try {
      await upsertScheduler(payload);
      alert("Schedule saved ✅");
      onClose();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-7xl p-6 relative">

        <div className="grid grid-cols-[300px_1fr] gap-8">

          {/* FORM */}
          <div className="w-[260px]">
            <h2 className="text-lg font-bold mb-4">
              Cron Schedule
            </h2>

            <div className="space-y-3 text-sm">

              <div>
                <label className="font-medium">Minutes</label>
                <input
                  name="minutes"
                  value={form.minutes}
                  onChange={handleChange}
                  className="w-full border rounded-md px-2 py-1 mt-1"
                  placeholder="*/5"
                />
              </div>

              <div>
                <label className="font-medium">Hours</label>
                <input
                  name="hours"
                  value={form.hours}
                  onChange={handleChange}
                  className="w-full border rounded-md px-2 py-1 mt-1"
                  placeholder="*"
                />
              </div>

              <div>
                <label className="font-medium">Day of Month</label>
                <input
                  name="day_of_month"
                  value={form.dayof_month}
                  onChange={handleChange}
                  className="w-full border rounded-md px-2 py-1 mt-1"
                  placeholder="*"
                />
              </div>

              <div>
                <label className="font-medium">Month</label>
                <input
                  name="month"
                  value={form.month}
                  onChange={handleChange}
                  className="w-full border rounded-md px-2 py-1 mt-1"
                  placeholder="*"
                />
              </div>

              <div>
                <label className="font-medium">Day of Week</label>
                <input
                  name="day_of_week"
                  value={form.dayof_week}
                  onChange={handleChange}
                  className="w-full border rounded-md px-2 py-1 mt-1"
                  placeholder="MON-FRI"
                />
              </div>

            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 mt-6">

              <button
                onClick={onClose}
                className="px-3 py-1 bg-gray-200 rounded-md text-sm"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
              >
                Save
              </button>

            </div>
          </div>


          {/* GUIDE TABLE */}
          <div className="bg-gray-50 rounded-xl p-4 overflow-auto max-h-[520px]">

            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Sparkles size={16} />
              Cron Format Guide
            </h3>

            <table className="text-sm w-full border border-gray-300">
              <thead className="bg-gray-200 text-xs">
                <tr>
                  <th className="p-2 border">Field Name</th>
                  <th className="p-2 border">Mandatory</th>
                  <th className="p-2 border">Allowed Values</th>
                  <th className="p-2 border">Special Characters</th>
                  <th className="p-2 border text-left">ความหมายของเครื่องหมาย</th>
                </tr>
              </thead>

              <tbody className="text-xs align-top">

                <tr>
                  <td className="border p-2 font-medium">Minutes</td>
                  <td className="border p-2">Yes</td>
                  <td className="border p-2">0–59</td>
                  <td className="border p-2">* / , -</td>
                  <td className="border p-2 space-y-1">
                    <div>* = ทุกนาที</div>
                    <div>/ = ทุก ๆ n นาที (เช่น */5)</div>
                    <div>, = หลายค่า (เช่น 0,15,30)</div>
                    <div>- = ช่วงค่า (เช่น 10-20)</div>
                  </td>
                </tr>

                <tr>
                  <td className="border p-2 font-medium">Hours</td>
                  <td className="border p-2">Yes</td>
                  <td className="border p-2">0–23</td>
                  <td className="border p-2">* / , -</td>
                  <td className="border p-2 space-y-1">
                    <div>* = ทุกชั่วโมง</div>
                    <div>/ = ทุก ๆ n ชั่วโมง (เช่น */2)</div>
                    <div>, = หลายชั่วโมง (เช่น 9,12,18)</div>
                    <div>- = ช่วง (เช่น 8-17)</div>
                  </td>
                </tr>

                <tr>
                  <td className="border p-2 font-medium">Day of Month</td>
                  <td className="border p-2">Yes</td>
                  <td className="border p-2">1–31</td>
                  <td className="border p-2">* / , - ?</td>
                  <td className="border p-2 space-y-1">
                    <div>* = ทุกวันในเดือน</div>
                    <div>/ = ทุก ๆ n วัน (เช่น */2)</div>
                    <div>, = หลายวัน (เช่น 1,15,30)</div>
                    <div>- = ช่วง (เช่น 10-20)</div>
                    <div>? = ไม่กำหนดค่า (ใช้เมื่อกำหนด Day of Week แทน)</div>
                  </td>
                </tr>

                <tr>
                  <td className="border p-2 font-medium">Month</td>
                  <td className="border p-2">Yes</td>
                  <td className="border p-2">1–12 หรือ JAN–DEC</td>
                  <td className="border p-2">* / , -</td>
                  <td className="border p-2 space-y-1">
                    <div>* = ทุกเดือน</div>
                    <div>/ = ทุก ๆ n เดือน (เช่น */3)</div>
                    <div>, = หลายเดือน (เช่น 1,6,12)</div>
                    <div>- = ช่วง (เช่น 3-8)</div>
                  </td>
                </tr>

                <tr>
                  <td className="border p-2 font-medium">Day of Week</td>
                  <td className="border p-2">Yes</td>
                  <td className="border p-2">0–6 หรือ SUN–SAT</td>
                  <td className="border p-2">* / , - ?</td>
                  <td className="border p-2 space-y-1">
                    <div>* = ทุกวันในสัปดาห์</div>
                    <div>/ = ทุก ๆ n วัน (เช่น */2)</div>
                    <div>, = หลายวัน (เช่น MON,WED,FRI)</div>
                    <div>- = ช่วง (เช่น MON-FRI)</div>
                    <div>? = ไม่กำหนดค่า (ใช้เมื่อกำหนด Day of Month แทน)</div>
                  </td>
                </tr>

              </tbody>
            </table>

          </div>

        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

      </div>
    </div>
  );
};

export default CronScheduleModal;