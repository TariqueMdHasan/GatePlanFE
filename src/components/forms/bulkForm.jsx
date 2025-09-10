import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const TASK_API = import.meta.env.VITE_TASK;

const selectSubject = [
  "TOC", "CD", "C", "DS", "ALGO", "DLD", "DBMS", "COA",
  "OS", "CN", "EM", "DM", "APTI", "DSA", "OTHER"
];

const scheduleList = ["Morning", "Afternoon", "Night"];
const scheduleMap = { Morning: "morning", Afternoon: "afternoon", Night: "night" };

function BulkTodoForm({ onClose }) {
  const today = new Date().toISOString().split("T")[0];

  const [formDataList, setFormDataList] = useState([
    { subject: selectSubject[0], task: "", scheduledIn: scheduleMap[scheduleList[0]], date: "", status: "todo" }
  ]);
  const [loader, setLoader] = useState(false);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const newList = [...formDataList];
    newList[index][name] = name === "scheduledIn" ? scheduleMap[value] : value;
    setFormDataList(newList);
  };

  const addRow = () => {
    setFormDataList([
      ...formDataList,
      { subject: selectSubject[0], task: "", scheduledIn: scheduleMap[scheduleList[0]], date: "", status: "todo" }
    ]);
  };

  const removeRow = (index) => {
    const newList = formDataList.filter((_, i) => i !== index);
    setFormDataList(newList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoader(true);
      const res = await axios.post(`${TASK_API}bulk`, { tasks: formDataList });
      if (res.status === 200 || res.status === 201) {
        toast.success("Tasks submitted successfully");
        onClose();
      } else {
        toast.error("Failed to submit tasks");
        setLoader(false);
      }
    } catch (error) {
      console.error("Error submitting tasks:", error);
      toast.error("Something went wrong, please try again later");
      setLoader(false);
    }
  };

  return (
    <div className="w-screen h-screen fixed z-20">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[rgba(75,75,75,0.9)] z-30"
      ></div>

      <div className="w-11/12 max-w-5xl h-auto p-6 rounded-2xl fixed bg-amber-50 z-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-auto">
        <form onSubmit={handleSubmit}>
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-2 py-1">Subject</th>
                <th className="border px-2 py-1">Task</th>
                <th className="border px-2 py-1">Schedule</th>
                <th className="border px-2 py-1">Date</th>
                <th className="border px-2 py-1">Action</th>
              </tr>
            </thead>
            <tbody>
              {formDataList.map((data, index) => (
                <tr key={index}>
                  <td className="border px-2 py-1">
                    <select
                      name="subject"
                      value={data.subject}
                      onChange={(e) => handleChange(index, e)}
                      className="border p-1 rounded"
                    >
                      {selectSubject.map((item, id) => (
                        <option key={id} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      name="task"
                      value={data.task}
                      onChange={(e) => handleChange(index, e)}
                      className="border p-1 rounded w-full"
                      required
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <select
                      name="scheduledIn"
                      value={scheduleList.find(
                        (key) => scheduleMap[key] === data.scheduledIn
                      )}
                      onChange={(e) => handleChange(index, e)}
                      className="border p-1 rounded"
                    >
                      {scheduleList.map((item, id) => (
                        <option key={id} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="date"
                      name="date"
                      value={data.date}
                      min={today}
                      onChange={(e) => handleChange(index, e)}
                      className="border p-1 rounded"
                      required
                    />
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {formDataList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRow(index)}
                        className="bg-red-600 cursor-pointer text-white px-2 py-1 rounded"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={addRow}
              className="bg-blue-600 cursor-pointer text-white px-3 py-2 rounded"
            >
              + Add Row
            </button>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-red-700 cursor-pointer text-white px-4 py-2 rounded"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={loader}
                className={`px-4 py-2 cursor-pointer rounded text-white ${
                  loader ? "bg-gray-500" : "bg-green-600"
                }`}
              >
                {loader ? "Submitting..." : "Submit All"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BulkTodoForm;
