import React, { useEffect, useState } from "react";

const ExamCountdown = () => {
  const END_DATE = new Date("2026-02-06");
  const EXAM_DATE = new Date("2026-02-07"); 
  const GOAL_DATE = new Date("2025-11-30"); 

  const [days, setDays] = useState([]);
  const [remainingFromToday, setRemainingFromToday] = useState(0);

  const isSameDate = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  useEffect(() => {
    const dayMs = 24 * 60 * 60 * 1000;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const localCutDays = JSON.parse(localStorage.getItem("cutDays")) || [];
    const rows = [];

    const spanToExam = Math.max(0, Math.ceil((EXAM_DATE - today) / dayMs));

    const todayNumber = Math.max(0, Math.floor((END_DATE - today) / dayMs) + 1);
    setRemainingFromToday(todayNumber);

    for (let i = 0; i <= spanToExam; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const isExam = isSameDate(date, EXAM_DATE);
      const isEnd = isSameDate(date, END_DATE);
      const isGoal = isSameDate(date, GOAL_DATE);

      const withinCountdown = date <= END_DATE;
      const dayNumber = withinCountdown
        ? Math.floor((END_DATE - date) / dayMs) + 1
        : null;

      const isCut = localCutDays.includes(i); 

      rows.push({
        id: i,
        date,
        dayNumber,   
        isCut,
        isGoal,
        isExam,
        isEnd,
      });
    }

    setDays(rows);
  }, []);

  const handleCut = (id) => {
    const updated = days.map((d) =>
      d.id === id ? { ...d, isCut: !d.isCut } : d
    );
    setDays(updated);
    const cutIds = updated.filter((d) => d.isCut).map((d) => d.id);
    localStorage.setItem("cutDays", JSON.stringify(cutIds));
  };

  const totalCountable = days.filter((d) => d.dayNumber !== null).length; 
  const totalCut = days.filter((d) => d.isCut && d.dayNumber !== null).length;
  const progressPercent = totalCountable
    ? Math.round((totalCut / totalCountable) * 100)
    : 0;

  return (
    <div className="max-w-4xl mx-auto mt-6 p-4 bg-white rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-2 text-center">🗓 Countdown to Exam</h2>
      <p className="text-center text-gray-700 mb-4">
        {remainingFromToday} days from today until <b>Exam</b>
      </p>

      <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
        <div
          className="bg-green-500 h-4 rounded-full text-xs text-white flex items-center justify-center"
          style={{ width: `${progressPercent}%` }}
        >
          {progressPercent}%
        </div>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Day Number</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Cut</th>
          </tr>
        </thead>
        <tbody>
          {days.map((d) => (
            <tr
              key={d.id}
              className={`border-b ${
                d.isGoal
                  ? "bg-yellow-200 font-bold"
                  : d.isExam
                  ? "bg-red-500 font-bold text-white"
                  : d.isEnd
                  ? "bg-green-300 font-semibold"
                  : ""
              } ${d.isCut ? "bg-gray-300 line-through" : ""}`}
            >
              <td className="p-2 border">{d.dayNumber ?? "EXAM DAY"}</td>
              <td className="p-2 border">
                {d.date.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
                {d.isExam ? " (EXAM)" : ""}
                {d.isEnd ? " (Final Countdown Day)" : ""}
                {d.isGoal ? " (Goal)" : ""}
              </td>
              <td className="p-2 border text-center">
                {d.dayNumber !== null && !d.isExam && (
                  <input
                    type="checkbox"
                    checked={d.isCut}
                    onChange={() => handleCut(d.id)}
                    className="w-5 h-5 cursor-pointer"
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-4 text-sm text-gray-600">
        Total days cut: {totalCut} / {totalCountable}
      </p>
    </div>
  );
};

export default ExamCountdown;






