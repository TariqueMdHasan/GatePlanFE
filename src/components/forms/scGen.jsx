// import React, { useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";

// const TASK_API = import.meta.env.VITE_TASK;

// const ScheduleGenerator = ({ onClose }) => {
//   const [subject, setSubject] = useState("DM");
//   const [taskPrefix, setTaskPrefix] = useState("LECTURE");
//   const [startDate, setStartDate] = useState("");
//   const [totalTasks, setTotalTasks] = useState(10);
//   const [perDay, setPerDay] = useState(2);
//   const [slots, setSlots] = useState(["morning", "afternoon"]); // array of slots
//   const [loader, setLoader] = useState(false);

//   const generateTasks = () => {
//     let tasks = [];
//     let currentDate = new Date(startDate);
//     let taskCounter = 1;

//     while (taskCounter <= totalTasks) {
//       for (let i = 0; i < perDay && taskCounter <= totalTasks; i++) {
//         const slot = slots[i % slots.length]; // cycle through slots
//         tasks.push({
//           subject,
//           task: `${taskPrefix} ${taskCounter}`,
//           scheduledIn: slot,
//           date: currentDate.toISOString().split("T")[0],
//           status: "todo",
//         });
//         taskCounter++;
//       }
//       currentDate.setDate(currentDate.getDate() + 1);
//     }
//     return tasks;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const tasks = generateTasks();
//     try {
//       setLoader(true);
//       const res = await axios.post(`${TASK_API}bulk`, { tasks });
//       if (res.status === 200 || res.status === 201) {
//         toast.success("Tasks generated & submitted successfully");
//         onClose();
//       } else {
//         toast.error("Failed to submit tasks");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       toast.error("Something went wrong");
//     } finally {
//       setLoader(false);
//     }
//   };

//   const toggleSlot = (slot) => {
//     if (slots.includes(slot)) {
//       setSlots(slots.filter((s) => s !== slot));
//     } else {
//       setSlots([...slots, slot]);
//     }
//   };

//   return (
//     <div className="w-screen h-screen fixed z-20">
//       <div onClick={onClose} className="fixed inset-0 bg-[rgba(75,75,75,0.9)] z-30"></div>

//       <div className="w-11/12 max-w-3xl p-6 rounded-2xl fixed bg-white z-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
//         <h2 className="text-lg font-bold mb-4">Schedule Generator</h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block">Subject</label>
//             <input
//               type="text"
//               value={subject}
//               onChange={(e) => setSubject(e.target.value)}
//               className="border p-2 rounded w-full"
//               required
//             />
//           </div>

//           <div>
//             <label className="block">Task Prefix</label>
//             <input
//               type="text"
//               value={taskPrefix}
//               onChange={(e) => setTaskPrefix(e.target.value)}
//               className="border p-2 rounded w-full"
//             />
//           </div>

//           <div>
//             <label className="block">Start Date</label>
//             <input
//               type="date"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//               className="border p-2 rounded w-full"
//               required
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block">Total Tasks</label>
//               <input
//                 type="number"
//                 value={totalTasks}
//                 onChange={(e) => setTotalTasks(Number(e.target.value))}
//                 className="border p-2 rounded w-full"
//                 min="1"
//               />
//             </div>
//             <div>
//               <label className="block">Per Day</label>
//               <input
//                 type="number"
//                 value={perDay}
//                 onChange={(e) => setPerDay(Number(e.target.value))}
//                 className="border p-2 rounded w-full"
//                 min="1"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block">Select Slots</label>
//             {["morning", "afternoon", "night"].map((slot) => (
//               <label key={slot} className="mr-4">
//                 <input
//                   type="checkbox"
//                   checked={slots.includes(slot)}
//                   onChange={() => toggleSlot(slot)}
//                 />{" "}
//                 {slot}
//               </label>
//             ))}
//           </div>

//           <button
//             type="submit"
//             disabled={loader}
//             className={`px-4 py-2 rounded text-white ${
//               loader ? "bg-gray-500" : "bg-green-600"
//             }`}
//           >
//             {loader ? "Generating..." : "Generate & Submit"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ScheduleGenerator;

import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const TASK_API = import.meta.env.VITE_TASK;

const subjects = [
  "TOC",
  "CD",
  "C",
  "DS",
  "ALGO",
  "DLD",
  "DBMS",
  "COA",
  "OS",
  "CN",
  "EM",
  "DM",
  "APTI",
  "DSA",
  "OTHER",
];

const ScheduleGenerator = ({ onClose }) => {
  const [subject, setSubject] = useState(subjects[0]);
  const [taskPrefix, setTaskPrefix] = useState("LECTURE");
  const [startDate, setStartDate] = useState("");
  const [totalTasks, setTotalTasks] = useState(10);
  const [perDay, setPerDay] = useState(2);
  const [slots, setSlots] = useState(["morning", "afternoon"]);
  const [breakMode, setBreakMode] = useState("none"); // none | weekend | interval
  const [breakInterval, setBreakInterval] = useState(3); // every N days
  const [breakLength, setBreakLength] = useState(1); // how many days to skip
  const [loader, setLoader] = useState(false);

  // utility: check if weekend
  const isWeekend = (dateObj) => {
    const day = dateObj.getDay(); // 0 = Sun, 6 = Sat
    return day === 0 || day === 6;
  };

  const generateTasks = () => {
    let tasks = [];
    let currentDate = new Date(startDate);
    let taskCounter = 1;
    let dayCounter = 0;

    while (taskCounter <= totalTasks) {
      // check break rules
      if (breakMode === "weekend" && !isWeekend(currentDate)) {
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }

      if (
        breakMode === "interval" &&
        dayCounter > 0 &&
        dayCounter % breakInterval === 0
      ) {
        // skip breakLength days
        currentDate.setDate(currentDate.getDate() + breakLength);
        dayCounter = 0;
        continue;
      }

      // add perDay tasks for this date
      for (let i = 0; i < perDay && taskCounter <= totalTasks; i++) {
        const slot = slots[i % slots.length];
        tasks.push({
          subject,
          task: `${taskPrefix} ${taskCounter}`,
          scheduledIn: slot,
          date: currentDate.toISOString().split("T")[0],
          status: "todo",
        });
        taskCounter++;
      }

      currentDate.setDate(currentDate.getDate() + 1);
      dayCounter++;
    }

    return tasks;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tasks = generateTasks();
    try {
      setLoader(true);
      const res = await axios.post(`${TASK_API}bulk`, { tasks });
      if (res.status === 200 || res.status === 201) {
        toast.success("Tasks generated & submitted successfully");
        onClose();
      } else {
        toast.error("Failed to submit tasks");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoader(false);
    }
  };

  const toggleSlot = (slot) => {
    if (slots.includes(slot)) {
      setSlots(slots.filter((s) => s !== slot));
    } else {
      setSlots([...slots, slot]);
    }
  };

  return (
    <div className="w-screen h-screen fixed z-20">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[rgba(75,75,75,0.9)] z-30"
      ></div>

      {/* <div className="w-11/12 max-w-3xl p-6 rounded-2xl fixed bg-white z-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"> */}
      <div
        className="w-11/12 max-w-3xl max-h-[90vh] p-6 rounded-2xl fixed bg-white z-40 
             top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
             overflow-y-auto shadow-lg"
      >
        <h2 className="text-lg font-bold mb-4">Schedule Generator</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Subject dropdown */}
          <div>
            <label className="block">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="border p-2 rounded w-full"
            >
              {subjects.map((subj, i) => (
                <option key={i} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>

          {/* Task prefix */}
          <div>
            <label className="block">Task Prefix</label>
            <input
              type="text"
              value={taskPrefix}
              onChange={(e) => setTaskPrefix(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* Start date */}
          <div>
            <label className="block">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          {/* Total & perDay */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block">Total Tasks</label>
              <input
                type="number"
                value={totalTasks}
                onChange={(e) => setTotalTasks(Number(e.target.value))}
                className="border p-2 rounded w-full"
                min="1"
              />
            </div>
            <div>
              <label className="block">Per Day</label>
              <input
                type="number"
                value={perDay}
                onChange={(e) => setPerDay(Number(e.target.value))}
                className="border p-2 rounded w-full"
                min="1"
              />
            </div>
          </div>

          {/* Slot selection */}
          <div>
            <label className="block">Select Slots</label>
            {["morning", "afternoon", "night"].map((slot) => (
              <label key={slot} className="mr-4">
                <input
                  type="checkbox"
                  checked={slots.includes(slot)}
                  onChange={() => toggleSlot(slot)}
                />{" "}
                {slot}
              </label>
            ))}
          </div>

          {/* Break mode */}
          <div>
            <label className="block">Break Option</label>
            <select
              value={breakMode}
              onChange={(e) => setBreakMode(e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option value="none">No Breaks</option>
              <option value="weekend">Only Weekends</option>
              <option value="interval">Custom Interval</option>
            </select>
          </div>

          {/* Interval break config */}
          {breakMode === "interval" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block">After Every (days)</label>
                <input
                  type="number"
                  value={breakInterval}
                  onChange={(e) => setBreakInterval(Number(e.target.value))}
                  className="border p-2 rounded w-full"
                  min="1"
                />
              </div>
              <div>
                <label className="block">Break Length (days)</label>
                <input
                  type="number"
                  value={breakLength}
                  onChange={(e) => setBreakLength(Number(e.target.value))}
                  className="border p-2 rounded w-full"
                  min="1"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loader}
            className={`px-4 py-2 rounded text-white ${
              loader ? "bg-gray-500" : "bg-green-600"
            }`}
          >
            {loader ? "Generating..." : "Generate & Submit"}
          </button>
          {/* <div className="sticky bottom-0 bg-white py-3 border-t mt-4">
            <button
              type="submit"
              disabled={loader}
              className={`px-4 py-2 rounded text-white ${
                loader ? "bg-gray-500" : "bg-green-600"
              }`}
            >
              {loader ? "Generating..." : "Generate & Submit"}
            </button>
          </div> */}
        </form>
      </div>
    </div>
  );
};

export default ScheduleGenerator;
