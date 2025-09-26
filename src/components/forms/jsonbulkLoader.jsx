import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const TASK_API = import.meta.env.VITE_TASK;

function JsonBulkUploader({ onClose }) {
  const [jsonInput, setJsonInput] = useState(`{
  "tasks": [
    { "subject": "OTHER", "task": "REVISION", "scheduledIn": "night", "date": "2025-11-17", "status": "todo" }
  ]
}`);
  const [loader, setLoader] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let parsed;
      try {
        parsed = JSON.parse(jsonInput);
      } catch (err) {
        toast.error("Invalid JSON format", err);
        return;
      }

      if (!parsed.tasks || !Array.isArray(parsed.tasks)) {
        toast.error("JSON must contain a 'tasks' array");
        return;
      }

      setLoader(true);
      const res = await axios.post(`${TASK_API}bulk`, parsed);
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

      <div className="w-11/12 max-w-4xl max-h-[90vh] p-6 rounded-2xl fixed bg-amber-50 z-40 
                top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                overflow-y-auto shadow-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="font-semibold text-lg">Paste JSON here:</label>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            rows={15}
            className="w-full border border-gray-400 rounded p-3 font-mono text-sm"
            placeholder={`{\n  "tasks": [\n    { "subject": "OTHER", "task": "REVISION", "scheduledIn": "night", "date": "2025-11-17", "status": "todo" }\n  ]\n}`}
            required
          />

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-red-700 text-white px-4 py-2 rounded cursor-pointer"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={loader}
              className={`px-4 py-2 rounded cursor-pointer text-white ${
                loader ? "bg-gray-500" : "bg-green-600"
              }`}
            >
              {loader ? "Submitting..." : "Submit JSON"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JsonBulkUploader;
