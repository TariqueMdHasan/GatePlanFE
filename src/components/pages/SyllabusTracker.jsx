import React, { useEffect, useState } from "react";

const syllabusData = {
  "1. Engineering Mathematics": [
    "Propositional and first order logic",
    "Sets, relations, functions, partial orders and lattices",
    "Monoids, Groups",
    "Graphs: connectivity, matching, colouring",
    "Combinatorics: counting, recurrence relations, generating functions",
    "Matrices, determinants, system of linear equations, eigenvalues and eigenvectors, LU decomposition",
    "Calculus: Limits, continuity, differentiability, maxima/minima, mean value theorem, integration",
    "Probability & Statistics: Random variables, distributions, mean, median, mode, std deviation, Bayes theorem",
  ],
  "2. Digital Logic": [
    "Boolean algebra",
    "Combinational and sequential circuits",
    "Minimization",
    "Number representations and computer arithmetic (fixed/floating point)",
  ],
  "3. Computer Organization & Architecture": [
    "Machine instructions and addressing modes",
    "ALU, data path and control unit",
    "Instruction pipelining and hazards",
    "Memory hierarchy: cache, main memory, secondary storage",
    "I/O interface: interrupt and DMA mode",
  ],
  "4. Programming & Data Structures": [
    "Programming in C",
    "Recursion",
    "Arrays, stacks, queues, linked lists",
    "Trees, BST, heaps, graphs",
  ],
  "5. Algorithms": [
    "Searching, sorting, hashing",
    "Asymptotic complexity",
    "Greedy, DP, divide & conquer",
    "Graph algorithms: traversals, MST, shortest paths",
  ],
  "6. Theory of Computation": [
    "Regular expressions and finite automata",
    "Context-free grammars, pushdown automata",
    "Pumping lemma",
    "Turing machines and undecidability",
  ],
  "7. Compiler Design": [
    "Lexical analysis, parsing, syntax-directed translation",
    "Runtime environments",
    "Intermediate code generation",
    "Local optimization, data flow analysis",
  ],
  "8. Operating System": [
    "System calls, processes, threads, IPC",
    "Concurrency & synchronization, deadlock",
    "CPU and I/O scheduling",
    "Memory management, virtual memory",
    "File systems",
  ],
  "9. Databases": [
    "ER model",
    "Relational model: algebra, calculus, SQL",
    "Integrity constraints, normal forms",
    "File organization, indexing (B, B+ trees)",
    "Transactions and concurrency control",
  ],
  "10. Computer Networks": [
    "OSI & TCP/IP layers",
    "Packet/circuit switching",
    "Data link: framing, error detection, MAC, Ethernet",
    "Routing: shortest path, flooding, distance vector, link state",
    "IP addressing, IPv4, CIDR, ARP, DHCP, ICMP, NAT",
    "Transport: flow control, congestion control, UDP, TCP, sockets",
    "Application protocols: DNS, SMTP, HTTP, FTP, Email",
  ],
};

const SyllabusTracker = () => {
  const [completed, setCompleted] = useState(() => {
    const stored = localStorage.getItem("syllabusProgress");
    return stored ? JSON.parse(stored) : {};
  });

  useEffect(() => {
    localStorage.setItem("syllabusProgress", JSON.stringify(completed));
  }, [completed]);

  const toggleTopic = (section, topic) => {
    const key = `${section}::${topic}`;
    setCompleted((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="max-w-3xl mx-auto mt-6 p-6 bg-white rounded-2xl shadow-lg mb-4">
      <h2 className="text-xl font-bold mb-4 text-center">📘 Syllabus Tracker</h2>
      {Object.entries(syllabusData).map(([section, topics]) => (
        <div key={section} className="mb-6">
          <h3 className="text-lg font-semibold mb-2">{section}</h3>
          <ul className="space-y-2">
            {topics.map((topic) => {
              const key = `${section}::${topic}`;
              return (
                <li key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={!!completed[key]} 
                    onChange={() => toggleTopic(section, topic)}
                    className="w-5 h-5 mr-2 cursor-pointer"
                  />
                  <span
                    className={`${
                      completed[key] ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {topic}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default SyllabusTracker;
