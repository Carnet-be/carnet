import Image from 'next/image'
import React from 'react'

const NotFound = () => {
  return (
<div className="flex items-center justify-center min-h-screen bg-white py-48">
    <div className="flex flex-col">

        <div className="flex flex-col items-center">
        <Image src='/logo.png' width={200} height={200} alt='404'/>
        

            <div className="font-bold text-3xl xl:text-7xl lg:text-6xl md:text-5xl mt-10">
                This page does not exist
            </div>

            <div className="text-gray-400 font-medium text-sm md:text-xl lg:text-2xl mt-8 max-w-xl text-center">
                The garage you are looking for might have been removed, had its name changed or is temporarily unavailable.
            </div>
        </div>

      
    </div>
</div>
  )
}

export default NotFound