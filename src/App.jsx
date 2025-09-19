import './App.css'
import { useEffect, useState } from 'react'
import Today from './components/pages/today'
import Month from './components/pages/month'
import Week from './components/pages/week'
import Overall from './components/pages/overall'
import Subject from './components/pages/subject'
import TodoFormOne from './components/forms/todoform'
import TodoFormBulk from './components/forms/bulkForm'
import ScheduleGenerator from './components/forms/scGen'

function App() {
  const [activeItem, setActiveItem] = useState('today')
  const [showSplash, setShowSplash] = useState(true)

  // modal states
  const [showSelector, setShowSelector] = useState(false)
  const [selectedForm, setSelectedForm] = useState(null)

  useEffect(() => {
    const alreadyShown = localStorage.getItem('splashShown')
    if (alreadyShown) {
      setShowSplash(false)
    } else {
      const timer = setTimeout(() => {
        setShowSplash(false)
        localStorage.setItem('splashShown', 'true')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [])

  const renderComponent = () => {
    switch (activeItem) {
      case "today": return <Today />
      case "week": return <Week />
      case "month": return <Month />
      case "subject": return <Subject />
      case "overall": return <Overall />
      default: return null
    }
  }

  const navbarItems = [
    { id: 'today', label: 'Today' },
    { id: 'month', label: 'Month' },
    { id: 'overall', label: 'Plan Table' },
    { id: 'subject', label: 'Subject' },
    { id: 'week', label: 'CountDown' },
  ]

  if (showSplash) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <h1 className="text-4xl md:text-6xl font-extrabold animate-bounce animate-pulse transition-transform duration-1000">
          🎉 All the Best for Your Exam! 🎉
        </h1>
      </div>
    )
  }

  return (
    <div className='m-0 h-screen flex flex-col bg-purple-100'>
      {/* Navbar */}
      <nav className='w-full bg-blue-600 h-[6vh] lg:h-[10vh] text-white flex justify-around items-center'>
        {navbarItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveItem(item.id)}
            className={`
              h-full flex justify-center items-center w-1/5 cursor-pointer
              transition-all duration-200 
              ${activeItem === item.id
                ? "bg-purple-100 text-black rounded-t-3xl"
                : "bg-blue-600 text-amber-50"}
            `}
          >
            {item.label}
          </div>
        ))}
      </nav>

      {/* Content */}
      <section className='overflow-x-auto h-[94vh] lg:h-[90vh]'>
        {renderComponent()}
      </section>

      {/* Floating Add Button */}
      <button
        onClick={() => setShowSelector(true)}
        className="fixed bottom-4 right-4 z-10 
                  w-16 h-16 rounded-full 
                  bg-blue-600 text-amber-50 
                  flex items-center justify-center cursor-pointer
                  shadow-lg hover:bg-blue-700 hover:shadow-2xl
                  transition-all duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 md:w-10 md:h-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Selector Modal */}
      {showSelector && !selectedForm && (
        <div className="fixed inset-0 z-20 flex items-center justify-center">
          <div
            onClick={() => setShowSelector(false)}
            className="absolute inset-0 bg-[rgba(75,75,75,0.9)] "
          ></div>
          <div className="bg-white rounded-2xl p-6 z-30 w-80 shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-center">Choose Form</h2>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setSelectedForm("one")}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              >
                ➕ Add One Task
              </button>
              <button
                onClick={() => setSelectedForm("bulk")}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 cursor-pointer"
              >
                📑 Add Multiple Tasks
              </button>
              <button
                onClick={() => setSelectedForm("subject")}
                className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 cursor-pointer"
              >
                📚 Add Whole Subject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Render selected form inside modal */}
      {selectedForm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          {/* <div
            onClick={() => { setSelectedForm(null); setShowSelector(false); }}
            className="fixed inset-0 bg-[rgba(75,75,75,0.9)]"
          ></div> */}
          <div className="z-50">
            {selectedForm === "one" && <TodoFormOne onClose={() => { setSelectedForm(null); setShowSelector(false); }} />}
            {selectedForm === "bulk" && <TodoFormBulk onClose={() => { setSelectedForm(null); setShowSelector(false); }} />}
            {selectedForm === "subject" && <ScheduleGenerator onClose={() => { setSelectedForm(null); setShowSelector(false); }} />}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
