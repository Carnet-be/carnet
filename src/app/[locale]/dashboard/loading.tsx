import { Spinner } from '@nextui-org/react'
import React from 'react'

export default function Loading() {
  return (
    <div className='h-[90vh] w-full center'>
    <Spinner size='lg'/>
  </div>
  )
}
