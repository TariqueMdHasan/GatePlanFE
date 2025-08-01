import './App.css'
import { useState } from 'react'
import Today from './components/pages/today'
import Month from './components/pages/month'
import Week from './components/pages/week'
import Overall from './components/pages/overall'
import Subject from './components/pages/subject'
import Todoform from './components/forms/todoform'

function App() {
  const[activeItem, setActiveItem] = useState('today')
  const[showModal, setShowModal] = useState(false)

  const renderComponent = () => {
    switch(activeItem) {
      case "today":
        return <Today />
      case "week":
        return <Week />
      case "month":
        return <Month />
      case "subject":
        return <Subject />
      case "overall":
        return <Overall />
      default:
        return null
    }
  }


  const navbarItems = [
    {id: 'today', label: 'Today'},
    {id: 'month', label: 'Month'},
    {id: 'week', label: 'Week'},
    {id: 'subject', label: 'Subject'},
    {id: 'overall', label: 'Overall'}
  ]

  return (
    <div className='m-0 h-screen flex flex-col bg-purple-100'>
      {/* Navbar */}
      <nav className='w-full bg-blue-600 h-[6vh] lg:h-[10vh] text-white flex justify-around items-center'>
        {
          navbarItems.map((item)=> (
            <div 
              key={item.id}
              onClick={()=> setActiveItem(item.id)}
              className={
                `h-full flex justify-center items-center  w-1/5 cursor-pointer
                transition-all duration-200 
                ${activeItem === item.id? "bg-purple-100 text-black rounded-t-3xl": "bg-blue-600 text-amber-50"}`
              }
              >
              {item.label}
            </div>
          ))
        }
      </nav>

      {/* section */}
      <section className='overflow-x-auto h-[94vh] lg:h-[90vh]'>
        {renderComponent()}
      </section>
      <button
        onClick={()=> setShowModal(true)}
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

      {
        showModal && <Todoform onClose={()=> setShowModal(false)} />
      }



    </div>
  )
}

export default App
