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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await axios.get("https://gateplanbe.onrender.com/api/todoData/");
      setTodos(result.data.todos);
      setFilteredData(result.data.todos);
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

  return (
    <div className="p-4 overflow-x-auto">
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
                  <td className="border px-4 py-2">
                    {morning.map((t) => `${t.subject}: ${t.task}`).join(", ")}
                  </td>
                  <td className="border px-4 py-2">
                    {afternoon.map((t) => `${t.subject}: ${t.task}`).join(", ")}
                  </td>
                  <td className="border px-4 py-2">
                    {night.map((t) => `${t.subject}: ${t.task}`).join(", ")}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default Overall;

