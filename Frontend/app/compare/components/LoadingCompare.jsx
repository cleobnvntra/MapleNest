import React from 'react'
import LoadingCompareStats from './LoadingCompareStats'

const LoadingCompare = () => {
  return (
    <div className='flex flex-col md:flex-row justify-between space-y-20 md:space-y-0'>
        <div className='w-full md:w-[48%]'><LoadingCompareStats /></div>
        <div className='w-full md:w-[48%]'><LoadingCompareStats /></div>
    </div>
  )
}

export default LoadingCompare