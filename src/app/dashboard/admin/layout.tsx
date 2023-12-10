import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'
import { type AdminRole } from '~/utils/constants'

async function AdminLayout({children}:Page){
 const user = await currentUser()
 const role=user?.publicMetadata?.role as (AdminRole | undefined)
    if(!role) redirect('dashboard')
  return (
    <div>
        {children}
    </div>
  )
}

export default AdminLayout