import React from 'react'
import Navbar from '../_components/Navbar'
import Sidebar from '../_components/Sidebar'

const DashboardLayout = ({ children }: Page) => {
    return <div className="antialiased ">

        <Navbar />

        <Sidebar />


        <main className="px-3 md:px-10  md:ml-64 pt-[150px] md:pt-[100px] min-h-screen">
            {children}
        </main>
    </div>
}

export default DashboardLayout