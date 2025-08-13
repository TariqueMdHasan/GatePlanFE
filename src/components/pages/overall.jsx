import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle2 } from "lucide-react";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const Overall = () => {
  const [todos, setTodos] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("Total");
  const [showUpdated, setShowUpdated] = useState(false);

  useEffect(() => {
    // 1️⃣ Load cached data instantly
    const cachedData = localStorage.getItem("todosData");
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      setTodos(parsedData);
      setFilteredData(parsedData);
    }

    // 2️⃣ Always fetch fresh data on mount
    fetchData();

    // 3️⃣ Auto-refresh every 1 minute
    const interval = setInterval(fetchData, 60_000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const result = await axios.get("https://gateplanbe.onrender.com/api/todoData/");
      const newTodos = result.data.todos;

      const cachedData = localStorage.getItem("todosData");
      if (!cachedData || JSON.stringify(newTodos) !== cachedData) {
        setTodos(newTodos);
        setFilteredData(newTodos);
        localStorage.setItem("todosData", JSON.stringify(newTodos));

        setShowUpdated(true);
        setTimeout(() => setShowUpdated(false), 2000);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  useEffect(() => {
    if (selectedMonth === "Total") {
      setFilteredData(todos);
    } else {
      const monthIndex = months.indexOf(selectedMonth) + 1;
      const filtered = todos.filter((todo) => {
        const todoMonth = new Date(todo.date).getMonth() + 1;
        return todoMonth === monthIndex;
      });
      setFilteredData(filtered);
    }
  }, [selectedMonth, todos]);

  const groupByDate = (data) => {
    const grouped = {};
    data.forEach((todo) => {
      const date = todo.date;
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(todo);
    });
    return grouped;
  };

  const groupedTodos = groupByDate(filteredData);
  const allDoneForDate = (tasks) => tasks.every((t) => t.status === "done");

  const renderTasks = (tasks) => {
    return tasks.map((t, idx) => (
      <span
        key={idx}
        className={`inline-flex items-center px-2 py-0.5 rounded-lg mr-1 ${
          t.status === "done"
            ? "bg-green-100 text-green-800 opacity-70 italic"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {t.status === "done" && <span className="mr-1">✅</span>}
        {`${t.subject}: ${t.task}`}
        {idx < tasks.length - 1 ? "," : ""}
      </span>
    ));
  };

  return (
    <div className="p-4 overflow-x-auto relative">
      {showUpdated && (
        <div className="absolute top-2 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm shadow">
          Updated ✓
        </div>
      )}

      <div className="mb-4">
        <label className="mr-2 font-semibold">Filter by Month:</label>
        <select
          className="border px-2 py-1 rounded"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {months.map((month) => (
            <option key={month} value={month}>{month}</option>
          ))}
          <option value="Total">Total</option>
        </select>
      </div>

      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-2 py-2 w-10">✓</th>
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Morning</th>
            <th className="border px-4 py-2">Afternoon</th>
            <th className="border px-4 py-2">Night</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(groupedTodos)
            .sort((a, b) => new Date(a) - new Date(b))
            .map((date) => {
              const tasks = groupedTodos[date];
              const morning = tasks.filter((t) => t.scheduledIn === "morning");
              const afternoon = tasks.filter((t) => t.scheduledIn === "afternoon");
              const night = tasks.filter((t) => t.scheduledIn === "night");
              const allDone = allDoneForDate(tasks);

              return (
                <tr key={date} className="border-t">
                  <td className="border px-2 py-2 text-center">
                    {allDone ? (
                      <CheckCircle2 className="text-green-600" size={16} />
                    ) : (
                      <div style={{ width: 16, height: 16 }} />
                    )}
                  </td>
                  <td className="border px-4 py-2 whitespace-nowrap">
                    {new Date(date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="border px-4 py-2">{renderTasks(morning)}</td>
                  <td className="border px-4 py-2">{renderTasks(afternoon)}</td>
                  <td className="border px-4 py-2">{renderTasks(night)}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default Overall;
