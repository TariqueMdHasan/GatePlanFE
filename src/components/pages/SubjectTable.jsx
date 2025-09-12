import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const SUB_API = import.meta.env.VITE_SUBJECT;

const ProgressBar = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingLecturesId, setEditingLecturesId] = useState(null);
  const [editedLectures, setEditedLectures] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedFields, setEditedFields] = useState({
    subject: "",
    subjectStart: "",
    subjectEnd: "",
  });
  const [deleteSubject, setDeleteSubject] = useState(null); 

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

  const confirmDelete = async () => {
    try {
      await axios.delete(`${SUB_API}delete/${deleteSubject._id}`);
      toast.success(`Subject "${deleteSubject.subject}" deleted`);
      fetchSubjects();
      setDeleteSubject(null); 
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete subject");
    }
  };

  const handleEditLectures = (id, currentValue) => {
    setEditingLecturesId(id);
    setEditedLectures(currentValue);
  };

  const handleSaveLectures = async (id) => {
    try {
      const value = Number(editedLectures);
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
      setEditingLecturesId(null);
      toast.success("Lectures updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update lectures");
    }
  };

  const handleEditFields = (subject) => {
    setEditingId(subject._id);
    setEditedFields({
      subject: subject.subject,
      subjectStart: subject.subjectStart.split("T")[0],
      subjectEnd: subject.subjectEnd.split("T")[0],
    });
  };

  const handleSaveFields = async (id) => {
    try {
      await axios.put(`${SUB_API}update/${id}`, editedFields);

      const updatedSubjects = subjects.map((s) =>
        s._id === id ? { ...s, ...editedFields } : s
      );
      setSubjects(updatedSubjects);
      localStorage.setItem("subjects", JSON.stringify(updatedSubjects));
      setEditingId(null);
      toast.success("Subject details updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update subject details");
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
                  
                  <td className="p-3 font-medium">
                    {editingId === subject._id ? (
                      <input
                        type="text"
                        value={editedFields.subject}
                        onChange={(e) =>
                          setEditedFields({
                            ...editedFields,
                            subject: e.target.value,
                          })
                        }
                        className="border rounded px-2 py-1"
                      />
                    ) : (
                      subject.subject
                    )}
                  </td>

                  <td className="p-3">
                    {editingId === subject._id ? (
                      <input
                        type="date"
                        value={editedFields.subjectStart}
                        onChange={(e) =>
                          setEditedFields({
                            ...editedFields,
                            subjectStart: e.target.value,
                          })
                        }
                        className="border rounded px-2 py-1"
                      />
                    ) : (
                      new Date(subject.subjectStart).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    )}
                  </td>

                  <td className="p-3">
                    {editingId === subject._id ? (
                      <input
                        type="date"
                        value={editedFields.subjectEnd}
                        onChange={(e) =>
                          setEditedFields({
                            ...editedFields,
                            subjectEnd: e.target.value,
                          })
                        }
                        className="border rounded px-2 py-1"
                      />
                    ) : (
                      new Date(subject.subjectEnd).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    )}
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

                    <div className="mt-1 inline-flex items-center space-x-2 text-xs text-gray-600">
                      {editingLecturesId === subject._id ? (
                        <>
                          <input
                            type="number"
                            value={editedLectures}
                            onChange={(e) => setEditedLectures(e.target.value)}
                            className="border rounded px-2 py-1 w-16"
                            min={0}
                            max={subject.noOfLectures}
                          />
                          <button
                            onClick={() => handleSaveLectures(subject._id)}
                            className="bg-green-500 text-white px-2 py-1 rounded cursor-pointer"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => setEditingLecturesId(null)}
                            className="bg-gray-500 text-white px-2 py-1 rounded cursor-pointer"
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <>
                          <span>
                            {subject.noOfLecturesCompleted}/{subject.noOfLectures} lectures
                          </span>
                          <button
                            onClick={() =>
                              handleEditLectures(
                                subject._id,
                                subject.noOfLecturesCompleted
                              )
                            }
                            className="bg-blue-500 text-white px-2 py-0.5 rounded cursor-pointer"
                          >
                            ✏️
                          </button>
                        </>
                      )}
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="flex space-x-2">
                      {editingId === subject._id ? (
                        <>
                          <button
                            onClick={() => handleSaveFields(subject._id)}
                            className="bg-green-600 text-white px-4 py-1 rounded-md cursor-pointer text-sm"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="bg-gray-500 text-white px-4 py-1 rounded-md cursor-pointer text-sm"
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditFields(subject)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded-md cursor-pointer text-sm"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => setDeleteSubject(subject)} // open modal with subject
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm cursor-pointer"
                          >
                            🗑️
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {deleteSubject && (
        <div 
          className="fixed inset-0 bg-[rgba(75,75,75,0.9)] bg-opacity-30 flex items-center justify-center z-50"
          onClick={() => setDeleteSubject(null)}
        >
          <div className="bg-white p-6 rounded-xl shadow-lg text-center w-80 z-60">
            <h3 className="text-lg font-semibold mb-4">Delete Confirmation</h3>
            <p className="mb-6">
              Are you sure you want to delete{" "}
              <span className="font-bold text-red-600">
                {deleteSubject.subject}
              </span>
              ?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg cursor-pointer"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteSubject(null)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;




