import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const SUB_API = import.meta.env.VITE_SUBJECT


const ProgressBar = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editedValue, setEditedValue] = useState("");

  const fetchSubjects = async () => {
    try {
      const cachedData = localStorage.getItem("subjects");
      if (cachedData) {
        setSubjects(JSON.parse(cachedData));
        setLoading(false);
      }
      const { data } = await axios.get(`${SUB_API}`);
      setSubjects(data.subjectInfo);
      localStorage.setItem("subjects", JSON.stringify(data.subjectInfo));
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch subjects");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${SUB_API}delete/${id}`);
      toast.success("Subject deleted");
      fetchSubjects();
    } catch (error) {
      toast.error("Failed to delete subject", error);
    }
  };

  const handleEdit = (id, currentValue) => {
    setEditingId(id);
    setEditedValue(currentValue);
  };

  const handleSave = async (id) => {
    try {
      const value = Number(editedValue);
      if (isNaN(value) || value < 0) {
        toast.error("Invalid number");
        return;
      }

      await axios.put(`${SUB_API}update/${id}`, {
        noOfLecturesCompleted: value,
      });

      const updatedSubjects = subjects.map((subj) =>
        subj._id === id ? { ...subj, noOfLecturesCompleted: value } : subj
      );
      setSubjects(updatedSubjects);
      localStorage.setItem("subjects", JSON.stringify(updatedSubjects));
      setEditingId(null);
      toast.success("Lectures updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update lectures");
    }
  };

  const calculateProgress = (completed, total) => {
    if (!total || total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="p-4 shadow-lg rounded-2xl bg-white max-w-6xl mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4 text-center">📚 Subjects Progress</h2>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <table className="w-full border-collapse rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Subject</th>
              <th className="p-3">Start Date</th>
              <th className="p-3">End Date</th>
              <th className="p-3">Progress</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject) => {
              const progress = calculateProgress(
                subject.noOfLecturesCompleted,
                subject.noOfLectures
              );

              return (
                <tr key={subject._id} className="border-b transition">
                  <td className="p-3 font-medium">{subject.subject}</td>
                  <td className="p-3">
                    {new Date(subject.subjectStart).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="p-3">
                    {new Date(subject.subjectEnd).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="p-3 w-1/3">
                    <div className="w-full bg-gray-200 rounded-full h-4 relative">
                      <div
                        className="bg-green-500 h-4 rounded-full text-xs text-white flex items-center justify-center"
                        style={{ width: `${progress}%` }}
                      >
                        {progress}%
                      </div>
                    </div>
                    <div className="mt-1 flex items-center space-x-2 text-xs text-gray-600">
                      {editingId === subject._id ? (
                        <>
                          <input
                            type="number"
                            value={editedValue}
                            onChange={(e) => setEditedValue(e.target.value)}
                            className="border rounded px-2 py-1 w-16"
                            min={0}
                            max={subject.noOfLectures}
                          />
                          <button
                            onClick={() => handleSave(subject._id)}
                            className="bg-green-500 text-white px-2 py-1 rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="bg-gray-500 text-white px-2 py-1 rounded"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <span>
                            {subject.noOfLecturesCompleted}/{subject.noOfLectures} lectures
                          </span>
                          <button
                            onClick={() =>
                              handleEdit(subject._id, subject.noOfLecturesCompleted)
                            }
                            className="bg-blue-500 text-white px-2 py-0.5 rounded cursor-pointer"
                          >
                            Edit
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm cursor-pointer"
                      onClick={() => handleDelete(subject._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProgressBar;
