import { Spinner } from '@nextui-org/react'
import React from 'react'

const LoadingPage = () => {
  return (
    <div className='h-screen w-screen center'>
      <Spinner size='lg'/>
    </div>
  )
}

export default LoadingPage