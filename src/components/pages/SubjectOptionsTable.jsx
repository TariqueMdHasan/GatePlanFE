import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const SubjectOptionsTable = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const localData = localStorage.getItem("subjectData");
        if (localData) {
          setSubjects(JSON.parse(localData));
          setLoading(false);
        }

        const res = await axios.get("https://gateplanbe.onrender.com/api/subject/");
        if (res.status === 200) {
          setSubjects(res.data.subjectInfo || []);
          localStorage.setItem("subjectData", JSON.stringify(res.data.subjectInfo));
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

  const handleToggle = async (id, field, currentValue) => {
    try {
      const updatedSubjects = subjects.map((subj) =>
        subj._id === id ? { ...subj, [field]: !currentValue } : subj
      );

      setSubjects(updatedSubjects);
      localStorage.setItem("subjectData", JSON.stringify(updatedSubjects));

      await axios.put(`https://gateplanbe.onrender.com/api/subject/update/${id}`, {
        [field]: !currentValue,
      });

      toast.success(`${field} updated`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-10 p-4 bg-white rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">⚙️ Subject Options</h2>

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
                <th className="px-4 py-3 border-b text-center">Theory</th>
                <th className="px-4 py-3 border-b text-center">Revision</th>
                <th className="px-4 py-3 border-b text-center">PYQ</th>
                <th className="px-4 py-3 border-b text-center">Test Series</th>
                <th className="px-4 py-3 border-b text-center">Completed</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subj) => (
                <tr
                  key={subj._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 border-b font-medium text-gray-800">
                    {subj.subject}
                  </td>
                  {["theory", "revision", "pyq", "testSeries", "isCompleted"].map(
                    (field) => (
                      <td
                        key={field}
                        className="px-4 py-3 border-b text-center"
                      >
                        <input
                          type="checkbox"
                          checked={subj[field]}
                          onChange={() =>
                            handleToggle(subj._id, field, subj[field])
                          }
                          className="w-5 h-5 cursor-pointer"
                        />
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubjectOptionsTable;
