import React from 'react'
import GetData from './getData';
import DigitalClock from './digitalCloack';

function Week() {
  return (
    <div className='w-full h-full flex flex-col justify-center items-center '>
      <DigitalClock />
      <GetData filterType="week" />
    </div>
  )
}

export default Week