
import React from 'react'
import NewCarPage from '../_components/pages/NewCarPage'
import { api } from '~/trpc/server'
import { auth } from '@clerk/nextjs'

const data= await api.public.newCarData.query()
export default function NewCar() {
  const {userId,orgId} = auth()
  return (
    <div>
     <NewCarPage data={data} belongsToId={orgId??userId}/>
    </div>
  )
}

