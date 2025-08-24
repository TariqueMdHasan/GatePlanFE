import React from 'react'
import DigitalClock from './digitalCloack';
import ExamCountdown from './ExamCountdown'
import SyllabusTracker from './SyllabusTracker'

function Week() {
  return (
    <div >
      <DigitalClock />
      <ExamCountdown />
      <SyllabusTracker />
    </div>
  )
}

export default Week