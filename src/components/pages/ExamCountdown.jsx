import React, { useEffect, useState } from "react";

const ExamCountdown = () => {
  const EXAM_DATE = new Date("2026-02-07"); 
  const TOTAL_DAYS = 180; 

  const [daysLeft, setDaysLeft] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    const dayMs = 24 * 60 * 60 * 1000;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffDays = Math.max(0, Math.ceil((EXAM_DATE - today) / dayMs));
    setDaysLeft(diffDays);

    const daysPassed = Math.min(TOTAL_DAYS, TOTAL_DAYS - diffDays);
    const percent = Math.round((daysPassed / TOTAL_DAYS) * 100);

    setProgressPercent(percent);
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-6 p-6 bg-white rounded-2xl shadow-lg text-center">
      <h2 className="text-xl font-bold mb-2">🗓 Countdown to Exam</h2>
      <p className="text-gray-700">Exam Date: <b>7 FEB 2026</b></p>
      <p className="text-gray-700 mb-4">
        {daysLeft} days from today until <b>Exam</b>
      </p>
      

      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className="bg-green-500 h-4 rounded-full text-xs text-white flex items-center justify-center transition-all"
          style={{ width: `${progressPercent}%` }}
        >
          {progressPercent}%
        </div>
      </div>
      <div className="w-full h-4 mt-0 flex justify-between">
        <p className="p-0 m-0">180 Days</p>
        <p className="p-0 m-0">0 Days(Exam)</p>
      </div>
    </div>
  );
};

export default ExamCountdown;
