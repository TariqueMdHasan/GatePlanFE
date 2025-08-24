import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const SubjectTable = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSubject, setEditingSubject] = useState(null);
  const [editData, setEditData] = useState({});

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    const cachedData = localStorage.getItem("subjects");
    if (cachedData) {
      setSubjects(JSON.parse(cachedData));
      setLoading(false);
    }

    const fetchSubjects = async () => {
      try {
        const res = await axios.get("https://gateplanbe.onrender.com/api/subject/");
        if (res.status === 200) {
          const newData = res.data.subjectInfo || [];
          setSubjects(newData);
          localStorage.setItem("subjects", JSON.stringify(newData));
        } else {
          toast.error("Failed to load subjects");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error fetching subject data");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;

    try {
      const res = await axios.delete(
        `https://gateplanbe.onrender.com/api/subject/delete/${id}`
      );
      if (res.status === 200) {
        toast.success("Subject deleted!");
        const updated = subjects.filter((s) => s._id !== id);
        setSubjects(updated);
        localStorage.setItem("subjects", JSON.stringify(updated));
      } else {
        toast.error("Failed to delete subject");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting subject");
    }
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject._id);
    setEditData({
      subject: subject.subject,
      subjectStart: subject.subjectStart.split("T")[0],
      subjectEnd: subject.subjectEnd.split("T")[0],
    });
  };
  const handleSave = async () => {
    try {
      const res = await axios.put(
        `https://gateplanbe.onrender.com/api/subject/update/${editingSubject}`,
        editData
      );
      if (res.status === 200) {
        toast.success("Subject updated!");
        const updated = subjects.map((s) =>
          s._id === editingSubject ? { ...s, ...editData } : s
        );
        setSubjects(updated);
        localStorage.setItem("subjects", JSON.stringify(updated));
        setEditingSubject(null);
      } else {
        toast.error("Failed to update subject");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating subject");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-10 p-4 bg-white rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        📘 Subjects Overview
      </h2>

      {loading ? (
        <div className="text-center py-6">Loading...</div>
      ) : subjects.length === 0 ? (
        <div className="text-center py-6 text-gray-500">No subjects found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-left">
                <th className="px-4 py-3 border-b">Subject</th>
                <th className="px-4 py-3 border-b">Start Date</th>
                <th className="px-4 py-3 border-b">End Date</th>
                <th className="px-4 py-3 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subj) => (
                <tr
                  key={subj._id}
                  className=" transition-colors"
                >
                  <td className="px-4 py-3 border-b font-medium text-gray-800">
                    {editingSubject === subj._id ? (
                      <input
                        type="text"
                        value={editData.subject}
                        onChange={(e) =>
                          setEditData({ ...editData, subject: e.target.value })
                        }
                        className="border rounded px-2 py-1"
                      />
                    ) : (
                      subj.subject
                    )}
                  </td>
                  <td className="px-4 py-3 border-b text-gray-600">
                    {editingSubject === subj._id ? (
                      <input
                        type="date"
                        value={editData.subjectStart}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            subjectStart: e.target.value,
                          })
                        }
                        className="border rounded px-2 py-1"
                      />
                    ) : (
                      formatDate(subj.subjectStart)
                    )}
                  </td>
                  <td className="px-4 py-3 border-b text-gray-600">
                    {editingSubject === subj._id ? (
                      <input
                        type="date"
                        value={editData.subjectEnd}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            subjectEnd: e.target.value,
                          })
                        }
                        className="border rounded px-2 py-1"
                      />
                    ) : (
                      formatDate(subj.subjectEnd)
                    )}
                  </td>
                  <td className="px-4 py-3 border-b text-center space-x-2">
                    {editingSubject === subj._id ? (
                      <>
                        <button
                          onClick={handleSave}
                          className="px-3 py-1 bg-green-600 text-white rounded-md cursor-pointer"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingSubject(null)}
                          className="px-3 py-1 bg-gray-500 text-white rounded-md cursor-pointer"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(subj)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-md cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(subj._id)}
                          className="px-3 py-1 bg-red-600 text-white rounded-md cursor-pointer"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubjectTable;
