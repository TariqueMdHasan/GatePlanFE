// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import axios from "axios";

// const headerStatus = ["TODO", "INPROGRESS", "DONE", "BACKLOG"];

// function GetData({ filterType }) {
//   const [TodoList, setTodoList] = useState([]);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedTodo, setSelectedTodo] = useState(null);
//   const [loader, setLoader] = useState(false);
//   const [showUpdated, setShowUpdated] = useState(false);

//   const isDateInFilter = (dateStr) => {
//     const today = new Date();
//     const taskDate = new Date(dateStr);

//     if (filterType === "today") {
//       return taskDate.toDateString() === today.toDateString();
//     }

//     if (filterType === "week") {
//       const startOfWeek = new Date(today);
//       startOfWeek.setDate(today.getDate() - today.getDay() + 1);
//       startOfWeek.setHours(0, 0, 0, 0);

//       const endOfWeek = new Date(startOfWeek);
//       endOfWeek.setDate(startOfWeek.getDate() + 6);
//       endOfWeek.setHours(23, 59, 59, 999);

//       return taskDate >= startOfWeek && taskDate <= endOfWeek;
//     }

//     if (filterType === "month") {
//       return (
//         taskDate.getMonth() === today.getMonth() &&
//         taskDate.getFullYear() === today.getFullYear()
//       );
//     }

//     return true;
//   };

//   const applyFilter = (data) => data.filter((todo) => isDateInFilter(todo.date));

//   const fetchData = async () => {
//     try {
//       const result = await axios.get("https://gateplanbe.onrender.com/api/todoData/");
//       if (Array.isArray(result.data.todos)) {
//         const newTodos = result.data.todos;

//         const cachedData = localStorage.getItem("todosData");
//         if (!cachedData || JSON.stringify(newTodos) !== cachedData) {
//           localStorage.setItem("todosData", JSON.stringify(newTodos));
//           setShowUpdated(true);
//           setTimeout(() => setShowUpdated(false), 2000);
//         }

//         setTodoList(applyFilter(newTodos));
//       } else {
//         toast.error("Data Not Found");
//       }
//     } catch (error) {
//       toast.error("Error, Please try again later");
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     const cachedData = localStorage.getItem("todosData");
//     if (cachedData) {
//       setTodoList(applyFilter(JSON.parse(cachedData)));
//     }

//     fetchData();

//     const interval = setInterval(fetchData, 60_000);
//     return () => clearInterval(interval);
//   }, [filterType]);


//   const handleStatusChange = async (id, newStatus) => {
//   try {
//     await axios.put(
//       `https://gateplanbe.onrender.com/api/todoData/update/${id}`,
//       { status: newStatus }
//     );

//     const updatedTodos = TodoList.map((t) =>
//       t._id === id ? { ...t, status: newStatus } : t
//     );
//     setTodoList(updatedTodos);

//     localStorage.setItem("todosData", JSON.stringify(updatedTodos));

//     toast.success("Status updated!");
//   } catch (err) {
//     toast.error("Failed to update status");
//   }
// };


//   const handleDelete = async () => {
//     try {
//       await axios.delete(
//         `https://gateplanbe.onrender.com/api/todoData/delete/${selectedTodo._id}`
//       );
//       toast.success("Todo deleted");
//       setShowDeleteModal(false);
//       setSelectedTodo(null);
//       fetchData();
//     } catch (err) {
//       toast.error("Failed to delete");
//     }
//   };

//   const formatCardDate = (dateStr) => {
//     const date = new Date(dateStr);
//     const day = String(date.getDate()).padStart(2, "0");
//     const monthNames = [
//       "JAN","FEB","MAR","APR","MAY","JUN",
//       "JUL","AUG","SEP","OCT","NOV","DEC"
//     ];
//     const month = monthNames[date.getMonth()];
//     const year = date.getFullYear();
//     return `${day} ${month} ${year}`;
//   };

//   return (
//     <>
//       {showUpdated && (
//         <div className="absolute top-2 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm shadow">
//           Updated ✓
//         </div>
//       )}

//       {showDeleteModal && (
//         <div
//           className="fixed inset-0 bg-[rgba(75,75,75,0.9)] bg-opacity-30 flex items-center justify-center z-50"
//           onClick={() => {
//             setShowDeleteModal(false);
//           }}
//         >
//           <div className="bg-white p-6 rounded-lg shadow-md w-80">
//             <h2 className="text-lg font-semibold mb-4">Are you sure you want to delete?</h2>
//             <div className="flex justify-end gap-4">
//               <button
//                 className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
//                 onClick={() => {
//                   setShowDeleteModal(false);
//                   setSelectedTodo(null);
//                 }}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
//                 onClick={handleDelete}
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="px-2 lg:px-0 w-full h-10/12 overflow-x-auto flex flex-row lg:justify-between lg:w-11/12">
//         {headerStatus.map((status, headerId) => (
//           <div
//             key={headerId}
//             className="min-w-[280px] lg:w-[250px] h-full border-2 border-purple-500 rounded-2xl mx-2 lg:m-0 flex flex-col"
//           >
//             <h1 className="bg-purple-200 border-b-2 border-b-purple-500 text-center font-semibold py-2 rounded-t-2xl">
//               {status}
//             </h1>

//             <div className="w-full flex-1 overflow-y-auto flex flex-col gap-4 p-4 relative">
//               {TodoList.filter((todo) => todo.status.toUpperCase() === status).map((todo) => (
//                 <div
//                   key={todo._id}
//                   className={`min-h-30 w-full border-2 rounded-2xl mt-2 flex justify-center pl-4 p-2 flex-col
//                     ${status === "TODO" ? "bg-pink-200 border-pink-400" :
//                       status === "INPROGRESS" ? "bg-yellow-200 border-yellow-400" :
//                       status === "DONE" ? "bg-green-200 border-green-400" :
//                       "bg-red-200 border-red-400"}`}
//                 >
//                   <div className="flex h-auto justify-between">
//                     <h1 className="text-lg font-bold">{todo.subject}</h1>
//                     <label className="text-[10px] cursor-pointer">
//                       STATUS:
//                       <select
//                         className="cursor-pointer text-[10px] bg-white border ml-1 rounded"
//                         value={todo.status.toUpperCase()}
//                         onChange={(e) =>
//                           handleStatusChange(todo._id, e.target.value.toLowerCase())
//                         }
//                       >
//                         {headerStatus.map((opt) => (
//                           <option key={opt} value={opt.toLowerCase()}>
//                             {opt}
//                           </option>
//                         ))}
//                       </select>
//                     </label>
//                   </div>

//                   <div className="flex justify-center">
//                     <p
//                       className={`text-[10px] px-4 py-[1px] rounded-2xl border-2 text-white uppercase 
//                       ${todo.scheduledIn === "morning" ? "bg-orange-400 border-orange-600" :
//                         todo.scheduledIn === "afternoon" ? "bg-blue-400 border-blue-600" :
//                         "bg-emerald-400 border-emerald-600"}`}
//                     >
//                       {todo.scheduledIn}
//                     </p>
//                   </div>

//                   <h2 className="text-[15px] font-medium">{todo.task}</h2>

//                   <div className="flex justify-between mt-2 items-center">
//                     <h3 className="text-[12px] text-gray-500">{formatCardDate(todo.date)}</h3>
//                     <button
//                       className="mt-2 text-xs text-white bg-red-500 px-2 rounded hover:bg-red-600 w-fit cursor-pointer"
//                       onClick={() => {
//                         setSelectedTodo(todo);
//                         setShowDeleteModal(true);
//                       }}
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// }

// export default GetData;
























import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const headerStatus = ["TODO", "INPROGRESS", "DONE", "BACKLOG"];

function GetData({ filterType }) {
  const [TodoList, setTodoList] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [draggedTodo, setDraggedTodo] = useState(null);
  const [showUpdated, setShowUpdated] = useState(false);

  const isDateInFilter = (dateStr) => {
    const today = new Date();
    const taskDate = new Date(dateStr);

    if (filterType === "today") {
      return taskDate.toDateString() === today.toDateString();
    }

    if (filterType === "week") {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay() + 1);
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      return taskDate >= startOfWeek && taskDate <= endOfWeek;
    }

    if (filterType === "month") {
      return (
        taskDate.getMonth() === today.getMonth() &&
        taskDate.getFullYear() === today.getFullYear()
      );
    }

    return true;
  };

  const applyFilter = (data) => data.filter((todo) => isDateInFilter(todo.date));

  const fetchData = async () => {
    try {
      const result = await axios.get("https://gateplanbe.onrender.com/api/todoData/");
      if (Array.isArray(result.data.todos)) {
        const newTodos = result.data.todos;

        const cachedData = localStorage.getItem("todosData");
        if (!cachedData || JSON.stringify(newTodos) !== cachedData) {
          localStorage.setItem("todosData", JSON.stringify(newTodos));
          setShowUpdated(true);
          setTimeout(() => setShowUpdated(false), 2000);
        }

        setTodoList(applyFilter(newTodos));
      } else {
        toast.error("Data Not Found");
      }
    } catch (error) {
      toast.error("Error, Please try again later");
      console.error(error);
    }
  };

  useEffect(() => {
    const cachedData = localStorage.getItem("todosData");
    if (cachedData) {
      setTodoList(applyFilter(JSON.parse(cachedData)));
    }

    fetchData();

    const interval = setInterval(fetchData, 60_000);
    return () => clearInterval(interval);
  }, [filterType]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(
        `https://gateplanbe.onrender.com/api/todoData/update/${id}`,
        { status: newStatus.toLowerCase() }
      );

      const updatedTodos = TodoList.map((t) =>
        t._id === id ? { ...t, status: newStatus } : t
      );
      setTodoList(updatedTodos);

      localStorage.setItem("todosData", JSON.stringify(updatedTodos));

      toast.success("Status updated!");
    } catch (err) {
      toast.error("Failed to update status");
      console.error(err)
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://gateplanbe.onrender.com/api/todoData/delete/${selectedTodo._id}`
      );
      toast.success("Todo deleted");
      setShowDeleteModal(false);
      setSelectedTodo(null);
      fetchData();
    } catch (err) {
      toast.error("Failed to delete");
      console.error(err)
    }
  };

  const formatCardDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const monthNames = [
      "JAN","FEB","MAR","APR","MAY","JUN",
      "JUL","AUG","SEP","OCT","NOV","DEC"
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  return (
    <>
      {showUpdated && (
        <div className="absolute top-2 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm shadow">
          Updated ✓
        </div>
      )}

      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-[rgba(75,75,75,0.9)] bg-opacity-30 flex items-center justify-center z-50"
          onClick={() => {
            setShowDeleteModal(false);
          }}
        >
          <div className="bg-white p-6 rounded-lg shadow-md w-80">
            <h2 className="text-lg font-semibold mb-4">Are you sure you want to delete?</h2>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedTodo(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="px-2 lg:px-0 w-full h-10/12 overflow-x-auto flex flex-row lg:justify-between lg:w-11/12">
        {headerStatus.map((status, headerId) => (
          <div
            key={headerId}
            className="min-w-[280px] lg:w-[250px] h-full border-2 border-purple-500 rounded-2xl mx-2 lg:m-0 flex flex-col"
            onDragOver={(e) => e.preventDefault()} // allow drop
            onDrop={() => {
              if (draggedTodo && draggedTodo.status.toUpperCase() !== status) {
                handleStatusChange(draggedTodo._id, status);
                setDraggedTodo(null);
              }
            }}
          >
            <h1 className="bg-purple-200 border-b-2 border-b-purple-500 text-center font-semibold py-2 rounded-t-2xl">
              {status}
            </h1>

            <div className="w-full flex-1 overflow-y-auto flex flex-col gap-4 p-4 relative">
              {TodoList.filter((todo) => todo.status.toUpperCase() === status).map((todo) => (
                <div
                  key={todo._id}
                  draggable
                  onDragStart={() => setDraggedTodo(todo)}
                  className={`min-h-30 w-full border-2 rounded-2xl mt-2 flex justify-center pl-4 p-2 flex-col cursor-grab
                    ${status === "TODO" ? "bg-pink-200 border-pink-400" :
                      status === "INPROGRESS" ? "bg-yellow-200 border-yellow-400" :
                      status === "DONE" ? "bg-green-200 border-green-400" :
                      "bg-red-200 border-red-400"}`}
                >
                  <div className="flex h-auto justify-between">
                    <h1 className="text-lg font-bold">{todo.subject}</h1>
                  </div>

                  <div className="flex justify-center">
                    <p
                      className={`text-[10px] px-4 py-[1px] rounded-2xl border-2 text-white uppercase 
                      ${todo.scheduledIn === "morning" ? "bg-orange-400 border-orange-600" :
                        todo.scheduledIn === "afternoon" ? "bg-blue-400 border-blue-600" :
                        "bg-emerald-400 border-emerald-600"}`}
                    >
                      {todo.scheduledIn}
                    </p>
                  </div>

                  <h2 className="text-[15px] font-medium">{todo.task}</h2>

                  <div className="flex justify-between mt-2 items-center">
                    <h3 className="text-[12px] text-gray-500">{formatCardDate(todo.date)}</h3>
                    <button
                      className="mt-2 text-xs text-white bg-red-500 px-2 rounded hover:bg-red-600 w-fit cursor-pointer"
                      onClick={() => {
                        setSelectedTodo(todo);
                        setShowDeleteModal(true);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default GetData;
