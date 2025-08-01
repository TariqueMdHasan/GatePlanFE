import React from 'react'
import GetData from './getData';
import DigitalClock from './digitalCloack';

function Month() {
  return (
    <div className='w-full h-full flex flex-col justify-center items-center '>
      <DigitalClock />
      <GetData filterType="month" />
    </div>
  )
}

export default Month