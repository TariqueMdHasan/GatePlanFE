import React from 'react'
import GetData from './getData';
import DigitalClock from './digitalCloack';


function Today() {
  return (
    <div className='w-full h-full flex flex-col justify-center items-center '>
      <DigitalClock />
      <GetData filterType="today" />
    </div>
  )
}

export default Today;


