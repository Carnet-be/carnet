import { clerkClient } from '@clerk/nextjs'
import { notFound } from 'next/navigation';
import React from 'react'
import { api } from '~/trpc/server';

const GaragePage = async ({params}:Page) => {
  
  const org = await clerkClient.organizations.getOrganization({slug: params.slug!}).catch(e=>null);
  if(!org) return notFound()
  const garage = await api.garage.getGarageByOrgId.query(org.id);
  if(!garage || garage.state!="active")  return notFound()
  return (
    <div>
        {params.slug}
    </div>
  )
}

export default GaragePage