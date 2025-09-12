import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

function SubjectsByMonthTable() {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("subjects");
    if (stored) {
      setSubjects(JSON.parse(stored));
    }
  }, []);

  const getSubjectsByMonth = () => {
    const map = {};

    subjects.forEach((subj) => {
      const start = dayjs(subj.subjectStart);
      const end = dayjs(subj.subjectEnd);

      let curr = start.startOf("month");
      const last = end.endOf("month");

      while (curr.isBefore(last) || curr.isSame(last, "month")) {
        const monthKey = curr.format("MMMM YYYY");
        if (!map[monthKey]) map[monthKey] = [];
        map[monthKey].push(subj.subject);
        curr = curr.add(1, "month");
      }
    });

    return map;
  };

  const subjectsByMonth = getSubjectsByMonth();

  return (
    <div className="p-4 shadow-lg rounded-2xl bg-white max-w-6xl mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4 text-center">📘 Subjects by Month</h2>
      <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="text-left p-3">Month</th>
            <th className="text-left p-3">Subjects</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(subjectsByMonth).map(([month, subs]) => (
            <tr key={month} className="border-b">
              <td className="p-3 font-semibold">{month}</td>
              <td className="p-3">
                {subs.map((s, i) => (
                  <span
                    key={i}
                    className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-lg mr-2 mb-1"
                  >
                    {s}
                  </span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SubjectsByMonthTable;
