import React, { useEffect, useState } from "react";

function DigitalClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12; 
    return `${String(hours).padStart(2, "0")}:${minutes}:${seconds} ${ampm}`;
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  return (
    <div className="flex flex-col items-center mb-4">
      <h1 className="text-3xl font-bold tracking-widest text-emerald-600">
        {formatTime(time)}
      </h1>
      <p className="text-sm font-medium text-gray-700">
        {formatDate(time)}
      </p>
    </div>
  );
}

export default DigitalClock;
