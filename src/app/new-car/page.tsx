
import React from 'react'
import NewCarPage from '../_components/pages/NewCarPage'
import { api } from '~/trpc/server'
import { auth } from '@clerk/nextjs'


export default async function NewCar() {
  const {userId,orgId} = auth()
  const data= await api.public.carData.query()

  return (
    <div className='bg-white'>
     <NewCarPage data={data} belongsToId={orgId??userId}/>
    </div>
  )
}

