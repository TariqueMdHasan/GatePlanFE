import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle2, Clock3, Download, AlertCircle } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

const TASK_API = import.meta.env.VITE_TASK;

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Overall = () => {
  const [todos, setTodos] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [selectedMonth, setSelectedMonth] = useState("Total");
  const [selectedYear, setSelectedYear] = useState("Total");
  const [selectedSubject, setSelectedSubject] = useState("Total");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [shiftDays, setShiftDays] = useState(0);

  const [showUpdated, setShowUpdated] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);

  const [loader, setLoader] = useState(null); 

  const availableYears = [
    ...new Set(todos.map((t) => new Date(t.date).getFullYear())),
  ].sort();
  const availableSubjects = [...new Set(todos.map((t) => t.subject))].sort();

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
    let data = [...todos];

    if (selectedMonth !== "Total") {
      const monthIndex = months.indexOf(selectedMonth);
      data = data.filter(
        (todo) => new Date(todo.date).getMonth() === monthIndex
      );
    }

    if (selectedYear !== "Total") {
      data = data.filter(
        (todo) => new Date(todo.date).getFullYear().toString() === selectedYear
      );
    }

    if (selectedSubject !== "Total") {
      data = data.filter((todo) => todo.subject === selectedSubject);
    }

    if (searchKeyword.trim() !== "") {
      const lower = searchKeyword.toLowerCase();
      data = data.filter(
        (todo) =>
          todo.subject.toLowerCase().includes(lower) ||
          todo.task.toLowerCase().includes(lower) ||
          todo.status.toLowerCase().includes(lower)
      );
    }

    setFilteredData(data);
  }, [selectedMonth, selectedYear, selectedSubject, searchKeyword, todos]);

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
      await axios.put(`${TASK_API}update/${draggedTask._id}`, {
        ...updatedTask,
        status: updatedTask.status.toLowerCase(),
      });

      const updatedTodos = todos.map((t) =>
        t._id === draggedTask._id ? updatedTask : t
      );
      setTodos(updatedTodos);
      localStorage.setItem("todosData", JSON.stringify(updatedTodos));
      setDraggedTask(null);
      toast.success("Task updated successfully");
      setShowUpdated(true);
      setTimeout(() => setShowUpdated(false), 2000);
    } catch (err) {
      console.error("Failed to update task", err);
      toast.error("Task update failed");
    }
  };

 
  const shiftTasks = async (direction) => {
    if (!shiftDays || isNaN(shiftDays)) {
      toast.error("Enter valid days");
      return;
    }

    setLoader(direction); // start loader for clicked button
    const delta = direction === "forward" ? shiftDays : -shiftDays;

    const updatedTasks = filteredData.map((task) => {
      const newDate = new Date(task.date);
      newDate.setDate(newDate.getDate() + delta);
      return { ...task, date: newDate.toISOString() };
    });

    try {
      await Promise.all(
        updatedTasks.map((task) =>
          axios.put(`${TASK_API}update/${task._id}`, {
            ...task,
            status: task.status.toLowerCase(),
          })
        )
      );

      const newTodos = todos.map((t) => {
        const updated = updatedTasks.find((u) => u._id === t._id);
        return updated ? updated : t;
      });

      setTodos(newTodos);
      localStorage.setItem("todosData", JSON.stringify(newTodos));
      toast.success(`Tasks moved ${shiftDays} day(s) ${direction}`);
    } catch (err) {
      console.error("Shift failed", err);
      toast.error("Failed to shift tasks");
    } finally {
      setLoader(null); // stop loader
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
    let filterLabel = `Todos`;
    if (selectedMonth !== "Total") filterLabel += ` - ${selectedMonth}`;
    if (selectedYear !== "Total") filterLabel += ` - ${selectedYear}`;
    if (selectedSubject !== "Total") filterLabel += ` - ${selectedSubject}`;
    if (searchKeyword.trim() !== "")
      filterLabel += ` - Search: ${searchKeyword}`;

    doc.text(filterLabel, 14, 15);

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

    doc.save(`Todos_Report.pdf`);
  };

  return (
    <div className="p-4 overflow-x-auto relative">
      {showUpdated && (
        <div className="absolute top-2 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm shadow">
          Updated ✓
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-4 justify-between items-center">
        <div>
          <label className="mr-2 font-semibold">Month:</label>
          <select
            className="border px-2 py-1 rounded"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="Total">All</option>
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mr-2 font-semibold">Year:</label>
          <select
            className="border px-2 py-1 rounded"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="Total">All</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mr-2 font-semibold">Subject:</label>
          <select
            className="border px-2 py-1 rounded"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="Total">All</option>
            {availableSubjects.map((subj) => (
              <option key={subj} value={subj}>
                {subj}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mr-2 font-semibold">Search:</label>
          <input
            type="text"
            placeholder="Type keyword..."
            className="border px-2 py-1 rounded"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>

        <button
          onClick={downloadPDF}
          className="flex cursor-pointer items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg shadow hover:bg-blue-700"
        >
          <Download size={16} /> Download PDF
        </button>
      </div>



      <div className="mb-4 flex flex-wrap gap-2 items-center">
        <label className="font-semibold">Shift Days:</label>
        <input
          type="number"
          value={shiftDays}
          onChange={(e) => setShiftDays(Number(e.target.value))}
          className="border px-2 py-1 rounded w-20"
        />

        {/* Backward Button */}
        <button
          onClick={() => shiftTasks("backward")}
          disabled={loader !== null}
          className={`flex items-center gap-2 px-3 py-1 rounded cursor-pointer ${
            loader !== null
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-red-500 text-white hover:bg-red-600"
          }`}
        >
          {loader === "backward" ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Shifting ⏪
            </>
          ) : (
            "⏪ Backward"
          )}
        </button>

        {/* Forward Button */}
        <button
          onClick={() => shiftTasks("forward")}
          disabled={loader !== null}
          className={`flex items-center gap-2 px-3 py-1 rounded cursor-pointer ${
            loader !== null
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-green-700 text-white hover:bg-green-600"
          }`}
        >
          {loader === "forward" ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Forward ⏩
            </>
          ) : (
            "Forward ⏩"
          )}
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
              const afternoon = tasks.filter(
                (t) => t.scheduledIn === "afternoon"
              );
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
