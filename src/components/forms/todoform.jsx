import React, { useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
const TASK_API = import.meta.env.VITE_TASK

const selectSubject = [
  "TOC",
  "CD",
  "C",
  "DS",
  "ALGO",
  "DLD",
  "DBMS",
  "COA",
  "OS",
  "CN",
  "EM",
  "DM",
  "APTI",
  "DSA",
  "OTHER",
];

const scheduleList = ["Morning", "Afternoon", "Night"];

const scheduleMap = {
  Morning: "morning",
  Afternoon: "afternoon",
  Night: "night",
};

function Todoform({ onClose }) {
  const [formData, setFormData] = useState({
    subject: selectSubject[0],
    task: "",
    scheduledIn: scheduleMap[scheduleList[0]],
    date: "",
  });
  const [loader, setLoader] = useState(false);


  const today = new Date().toISOString().split("T")[0];


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "scheduledIn" ? scheduleMap[value] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoader(true);
      const res = await axios.post(
        `${TASK_API}`,
        formData
      );
      if (res.status === 200 || res.status === 201) {
        toast.success('Task submitted successfully')
        onClose();
      } else {
        toast.error('Failed to subit task')
        setLoader(false);
      }
    } catch (error) {
      console.error("Error submitting task:", error);
      toast.error('something went wrong, Please try again later')
      setLoader(false);
    }
  };

  return (
    <div className="w-screen h-screen fixed z-20">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[rgba(75,75,75,0.9)] z-30"
      ></div>

      <div className="w-auto h-auto p-6 rounded-2xl fixed bg-amber-50 z-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <form onSubmit={handleSubmit} className="relative block">
          <label htmlFor="subject" className="block">
            Select Subject:
            <select
              name="subject"
              id="subject"
              value={formData.subject}
              onChange={handleChange}
              className="ml-4 border-2 border-gray-800 rounded-sm px-2 py-1"
            >
              {selectSubject.map((item, id) => (
                <option value={item} key={id}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="relative mt-4 block">
            Task:
            <input
              type="text"
              name="task"
              value={formData.task}
              onChange={handleChange}
              className="border-2 border-gray-800 rounded-sm px-2 py-1 block"
              required
            />
          </label>

          <label className="relative mt-5 block">
            Schedule:
            <select
              name="scheduledIn"
              //   value={scheduleList.find(key => scheduleMap[key] === formData.schedule)}
              value={scheduleList.find(
                (key) => scheduleMap[key] === formData.scheduledIn
              )}
              onChange={handleChange}
              className="ml-4 border-2 border-gray-800 rounded-sm px-2 py-1"
            >
              {scheduleList.map((item, id) => (
                <option value={item} key={id}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="block relative mt-5">
            Date:
            <input
              type="date"
              name="date"
              value={formData.date}
              min={today}
              onChange={handleChange}
              className="ml-4 border-2 border-gray-800 rounded-sm px-2 py-1 cursor-pointer"
              required
            />
          </label>

          <div className="w-full flex justify-between mt-10">
            <button
              type="button"
              onClick={onClose}
              className="p-2 bg-red-900 cursor-pointer text-amber-50 rounded-md px-4"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={loader}
              className={`p-2 cursor-pointer text-amber-50
                ${loader ? "bg-gray-500" : "bg-green-600"} rounded-md px-4`}
            >
              {loader ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Todoform;
