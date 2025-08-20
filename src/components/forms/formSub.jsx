import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function SubjectForm({ onClose }) {
  const [formData, setFormData] = useState({
    subject: "",
    theory: false,
    revision: false,
    pyq: false,
    testSeries: false,
    isCompleted: false,
    noOfLectures: 0,
    noOfLecturesCompleted: 0,
    subjectStart: "",
    subjectEnd: "",
  });

  const [loader, setLoader] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoader(true);
      const res = await axios.post(
        "https://gateplanbe.onrender.com/api/subject",
        formData
      );

      if (res.status === 200 || res.status === 201) {
        toast.success("Subject added successfully!");
        onClose();
      } else {
        toast.error("Failed to add subject");
        setLoader(false);
      }
    } catch (error) {
      console.error("Error adding subject:", error);
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

      <div className="w-auto h-auto p-6 rounded-2xl fixed bg-amber-50 z-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <form onSubmit={handleSubmit} className="relative block space-y-4">
          {/* Subject Name */}
          <label className="block">
            Subject:
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="ml-4 border-2 border-gray-800 rounded-sm px-2 py-1"
            />
          </label>

          {/* Checkboxes */}
          <div className="grid grid-cols-2 gap-3 mt-2">
            {["theory", "revision", "pyq", "testSeries", "isCompleted"].map(
              (field) => (
                <label key={field} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name={field}
                    checked={formData[field]}
                    onChange={handleChange}
                  />
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
              )
            )}
          </div>

          {/* Lectures */}
          <label className="block">
            No. of Lectures:
            <input
              type="number"
              name="noOfLectures"
              value={formData.noOfLectures}
              onChange={handleChange}
              className="ml-4 border-2 border-gray-800 rounded-sm px-2 py-1 w-28"
              min="0"
            />
          </label>

          <label className="block">
            Lectures Completed:
            <input
              type="number"
              name="noOfLecturesCompleted"
              value={formData.noOfLecturesCompleted}
              onChange={handleChange}
              className="ml-4 border-2 border-gray-800 rounded-sm px-2 py-1 w-28"
              min="0"
            />
          </label>

          {/* Dates */}
          <label className="block">
            Start Date:
            <input
              type="date"
              name="subjectStart"
              value={formData.subjectStart}
              onChange={handleChange}
              className="ml-4 border-2 border-gray-800 rounded-sm px-2 py-1 cursor-pointer"
              min={today}
              required
            />
          </label>

          <label className="block">
            End Date:
            <input
              type="date"
              name="subjectEnd"
              value={formData.subjectEnd}
              onChange={handleChange}
              className="ml-4 border-2 border-gray-800 rounded-sm px-2 py-1 cursor-pointer"
              min={formData.subjectStart || today}
              required
            />
          </label>

          {/* Buttons */}
          <div className="w-full flex justify-between mt-6">
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
              className={`p-2 cursor-pointer text-amber-50 ${
                loader ? "bg-gray-500" : "bg-green-600"
              } rounded-md px-4`}
            >
              {loader ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SubjectForm;
