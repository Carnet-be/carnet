
import React from 'react'
import NewCarPage from '../_components/pages/NewCarPage'
import { api } from '~/trpc/server'
import { auth } from '@clerk/nextjs'

const data= await api.public.carData.query()
const {userId,orgId} = auth()
export default function NewCar() {

  return (
    <div className='bg-white'>
     <NewCarPage data={data} belongsToId={orgId??userId}/>
    </div>
  )
}

