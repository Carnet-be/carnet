/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth, currentUser } from '@clerk/nextjs'
import React from 'react'
import Navbar from '../_components/Navbar'
import Sidebar from '../_components/Sidebar'


const DashboardLayout = async ({ children }: any) => {
  const authData = auth()
  const user = await currentUser()
  const isAdmin = user?.privateMetadata?.role === 'admin'
  return <div className="antialiased ">

    <Navbar
      isAdmin={isAdmin}
      auth={{
        orgId: authData.orgId!,
        userId: authData.userId!,
      }} />

    <Sidebar isAdmin={isAdmin} />
    <main className="px-3 md:px-10  md:ml-64 pt-[150px] md:pt-[100px] min-h-screen">
      {children}
    </main>
  </div>
}

export default DashboardLayout
