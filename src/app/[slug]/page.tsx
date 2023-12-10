/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { clerkClient } from '@clerk/nextjs'
import { notFound } from 'next/navigation';
import React from 'react'
import { api } from '~/trpc/server';

export default async function GaragePagePublic ({params}:any) {
  
  const org = await clerkClient.organizations.getOrganization({slug: params.slug!}).catch(_=>null);
  if(!org) return notFound()
  const garage = await api.garage.getGarageByOrgId.query(org.id);
  if(!garage || garage.state!="active")  return notFound()
  return (
    <div>
        
    </div>
  )
}
