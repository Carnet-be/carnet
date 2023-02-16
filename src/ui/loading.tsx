import React from 'react'
import Lottie from './components/lottie'
import animationData from "@animations/loading.json"
const Loading = () => {
  return (
    <div className='w-screen h-screen bg-white flex flex-row items-center justify-center'>
       <div className='w-[100px]'>
       <Lottie animationData={animationData}/>
       </div>
    </div>
  )
}

export default Loading