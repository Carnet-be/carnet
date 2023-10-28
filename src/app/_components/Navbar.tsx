/* eslint-disable @next/next/no-img-element */
import React from 'react'
import Logo from './ui/logo'
import { OrganizationProfile, OrganizationSwitcher, UserButton, auth } from '@clerk/nextjs'
import LangueSwitcher from './LangueSwitcher'
import ThemeSwitcher from './ThemeSwitcher'
import { Bell } from 'lucide-react'
 const Navbar = () => { 
   return  <nav className="bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0 z-50">
   <div className="flex flex-wrap justify-between items-center">
     <div className="flex justify-start items-center">
       <button
         data-drawer-target="drawer-navigation"
         data-drawer-toggle="drawer-navigation"
         aria-controls="drawer-navigation"
         className="p-2 mr-2 text-gray-600 rounded-lg cursor-pointer md:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
       >
         <svg
           aria-hidden="true"
           className="w-6 h-6"
           fill="currentColor"
           viewBox="0 0 20 20"
           xmlns="http://www.w3.org/2000/svg"
         >
           <path
             fill-rule="evenodd"
             d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
             clip-rule="evenodd"
           ></path>
         </svg>
         <svg
           aria-hidden="true"
           className="hidden w-6 h-6"
           fill="currentColor"
           viewBox="0 0 20 20"
           xmlns="http://www.w3.org/2000/svg"
         >
           <path
             fill-rule="evenodd"
             d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
             clip-rule="evenodd"
           ></path>
         </svg>
         <span className="sr-only">Toggle sidebar</span>
       </button>
       
       <div className='w-56 center'>
       <Logo type={"1"} size={60}/>
       </div>
       <div  className="hidden md:block md:pl-4">
         <label htmlFor="topbar-search" className="sr-only">Search</label>
         <div className="relative  md:w-96">
           <div
             className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none"
           >
             <svg
               className="w-5 h-5 text-gray-500 dark:text-gray-400"
               fill="currentColor"
               viewBox="0 0 20 20"
               xmlns="http://www.w3.org/2000/svg"
             >
               <path
                 fill-rule="evenodd"
                 clip-rule="evenodd"
                 d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
               ></path>
             </svg>
           </div>
           <input
             type="text"
             name="email"
             id="topbar-search"
             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
             placeholder="Search"
           />
         </div>
       </div>
     </div>
     <div className="flex items-center gap-4 lg:order-2  justify-center">
      <button className='iconButton'>
      <Bell />
      </button>
      <div className='pt-2'>
      <OrganizationSwitcher />
      </div>
       <UserButton />
     
     </div>
   </div>
 </nav>
}

export default Navbar


