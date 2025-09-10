import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle2, Clock3, Download, AlertCircle  } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
const TASK_API = import.meta.env.VITE_TASK

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const Overall = () => {
  const [todos, setTodos] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("Total");
  const [showUpdated, setShowUpdated] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null); 

  useEffect(() => {
    const cachedData = localStorage.getItem("todosData");
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      setTodos(parsedData);
      setFilteredData(parsedData);
    }

    fetchData();
    const interval = setInterval(fetchData, 60_000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const result = await axios.get(`${TASK_API}`);
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
      const date = todo.date.split("T")[0]; 
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(todo);
    });
    return grouped;
  };

  const groupedTodos = groupByDate(filteredData);
  const allDoneForDate = (tasks) => tasks.every((t) => t.status === "done");

  const handleDrop = async (newDate, newScheduledIn) => {
    if (!draggedTask) return;

    const updatedTask = {
      ...draggedTask,
      date: newDate,
      scheduledIn: newScheduledIn,
    };

    try {
      await axios.put(
        `${TASK_API}update/${draggedTask._id}`,
        {
          ...updatedTask,
          status: updatedTask.status.toLowerCase()
        }
      );

      const updatedTodos = todos.map((t) =>
        t._id === draggedTask._id ? updatedTask : t
      );
      setTodos(updatedTodos);
      localStorage.setItem("todosData", JSON.stringify(updatedTodos));
      setDraggedTask(null);
      toast.success('task updated successfully')
      setShowUpdated(true);
      setTimeout(() => setShowUpdated(false), 2000);
    } catch (err) {
      console.error("Failed to update task", err);
      toast.error('task update failed')
    }
  };

  const renderTasks = (tasks) => {
    return tasks.map((t, idx) => (
      <span
        key={idx}
        draggable
        onDragStart={() => setDraggedTask(t)} 
        className={`inline-flex items-center px-2 py-0.5 rounded-lg m-1 cursor-grab ${
          t.status === "done"
            ? "bg-green-100 text-green-800 opacity-70 italic"
            : t.status === "inprogress"
            ? "bg-yellow-100 text-yellow-800"
            : t.status === "backlog"
            ? "bg-red-100 text-red-800"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {t.status === "done" && (
          <CheckCircle2 size={14} className="mr-1 text-green-600" />
        )}
        {t.status === "inprogress" && (
          <Clock3 size={14} className="mr-1 text-yellow-600 animate-spin" />
        )}
        {t.status === "backlog" && (
          <AlertCircle size={14} className="mr-1 text-red-600" />
        )}
        {`${t.subject}: ${t.task}`}
        {idx < tasks.length - 1 ? "," : ""}
      </span>
    ));
  };

  const downloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    doc.setFontSize(14);
    doc.text(
      `Todo Report - ${selectedMonth === "Total" ? "All Months" : selectedMonth}`,
      14,
      15
    );

    const tableData = Object.keys(groupedTodos)
      .sort((a, b) => new Date(a) - new Date(b))
      .map((date) => {
        const tasks = groupedTodos[date];
        const morning = tasks
          .filter((t) => t.scheduledIn === "morning")
          .map((t) => `${t.subject}: ${t.task}`)
          .join(", ");
        const afternoon = tasks
          .filter((t) => t.scheduledIn === "afternoon")
          .map((t) => `${t.subject}: ${t.task}`)
          .join(", ");
        const night = tasks
          .filter((t) => t.scheduledIn === "night")
          .map((t) => `${t.subject}: ${t.task}`)
          .join(", ");

        return [
          new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          morning || "-",
          afternoon || "-",
          night || "-",
        ];
      });

    autoTable(doc, {
      head: [["Date", "Morning", "Afternoon", "Night"]],
      body: tableData,
      startY: 25,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [66, 66, 66] },
    });

    doc.save(`Todos_${selectedMonth}.pdf`);
  };

  return (
    <div className="p-4 overflow-x-auto relative">
      {showUpdated && (
        <div className="absolute top-2 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm shadow">
          Updated ✓
        </div>
      )}

      <div className="mb-4 flex justify-between items-center">
        <div>
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

        <button
          onClick={downloadPDF}
          className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg shadow hover:bg-blue-700"
        >
          <Download size={16} /> Download PDF
        </button>
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
                  <td
                    className="border px-4 py-2 min-h-[40px]"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(date, "morning")}
                  >
                    {renderTasks(morning)}
                  </td>
                  <td
                    className="border px-4 py-2 min-h-[40px]"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(date, "afternoon")}
                  >
                    {renderTasks(afternoon)}
                  </td>
                  <td
                    className="border px-4 py-2 min-h-[40px]"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(date, "night")}
                  >
                    {renderTasks(night)}
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
