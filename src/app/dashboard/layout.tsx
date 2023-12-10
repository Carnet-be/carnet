/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import Navbar from '../_components/Navbar'
import Sidebar from '../_components/Sidebar'
import { auth } from '@clerk/nextjs'
import { type SignedInAuthObject } from '@clerk/nextjs/dist/types/server'

const DashboardLayout = ({ children }: any) => {
   const authData = auth()
    return <div className="antialiased ">

        <Navbar auth={{
            orgId: authData.orgId!,
            userId: authData.userId!,       
        }}/>

        <Sidebar />
        <main className="px-3 md:px-10  md:ml-64 pt-[150px] md:pt-[100px] min-h-screen">
            {children}
        </main>
    </div>
}

export default DashboardLayout