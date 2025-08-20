import React, { useState } from 'react'
import SubjectForm from '../forms/formSub'
import SubjectTable from './SubjectTable'
import SubjectOptionsTable from './SubjectOptionsTable'
import ProgressBar from './progressBar'
// import ExamCountdown from './ExamCountdown'

function Subject() {
  const[showModal, setShowModal] = useState(false)
  return (
    <div>
      <button className='relative top-4 left-1/2 -translate-x-1/2 bg-blue-500 px-4 py-2 rounded-[5px] text-white'
        onClick={()=> setShowModal(true)}
      >Add Subject</button>
      {
        showModal && <SubjectForm onClose={()=> setShowModal(false)} />
      }
      <SubjectTable />
      <SubjectOptionsTable />
      <ProgressBar />
      {/* <ExamCountdown /> */}
      {/* <p
        className="mt-6 text-center text-2xl font-extrabold 
                  bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 
                  bg-clip-text text-transparent 
                  animate-pulse tracking-wide mb-4"
      >
        ✨ All The Best ✨
      </p> */}
      <p
        className="mt-6 text-center text-2xl font-extrabold 
                  text-yellow-400 drop-shadow-lg 
                  animate-bounce tracking-wide mb-6"
      >
        ✨ All The Best ✨
      </p>

    </div>
  )
}

export default Subject