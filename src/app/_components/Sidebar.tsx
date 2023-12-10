"use client"
import { CarFront, Heart, Home, LucideDatabase, MessageSquareDashed, Settings2Icon, Users2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { IconCar } from './ui/icons'
import MenuItem, { type TMenuItem } from './MenuItem'
import { RiAuctionLine } from 'react-icons/ri'
import { Button } from '@nextui-org/react'
import { AiFillCar } from 'react-icons/ai'
import { useUser } from '@clerk/nextjs'
import useIsAdmin from '~/hooks/use-is-admin'
import { ChatIcon, GarageIcon } from './icons'
import { IoChatbubblesOutline } from 'react-icons/io5'
import { MdSubscriptions } from 'react-icons/md'
import { TbPremiumRights } from 'react-icons/tb'

const Sidebar = () => {
    const admin = useIsAdmin()
    const menuAdmin: TMenuItem[] = [
        {
            label: "Overview",
            icon: <Home size={20} />,
            route: "/dashboard/admin/overview",
        },
        {
            label: "Cars",
            icon: <CarFront size={20} />,
            route: "/dashboard/admin/cars",
        },
        {
            label: "Users",
            icon: <Users2 size={20} />,
            route: "/dashboard/admin/users",
        },
        {
            label: "Garages",
            icon: <GarageIcon size={20} />,
            route: "/dashboard/admin/garages",
        },

        {
            label: "Chat",
            icon: <IoChatbubblesOutline size={20} />,
            route: "/dashboard/admin/chat",
        }, 
        {
            label: "Subscriptions",
            icon: <TbPremiumRights size={20} />,
            route: "/dashboard/admin/subscriptions",
        },
        {
            label: "Data",
            icon: <LucideDatabase  size={20} />,
            route: "/dashboard/admin/data",
        },


    ]
    const menu: TMenuItem[] = [
        {
            label: "Home",
            icon: <Home size={20} />,
            route: "/dashboard/home",
        },
        {
            label: "My cars",
            icon: <CarFront size={20} />,
            route: "/dashboard/my-cars",
        },
        {
            label: "Active bids",
            icon: <RiAuctionLine size={20} />,
            route: "/dashboard/active-bids",
        },
        {
            label: "Favorites",
            icon: <Heart size={20} />,
            route: "/dashboard/favorites",
        }
    ]
    return (
        <aside
            className="fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform -translate-x-full bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
            aria-label="Sidenav"
            id="drawer-navigation"
        >
            <div className="overflow-y-auto py-8 px-8 h-full bg-white dark:bg-gray-800">
                <form action="#" method="GET" className="md:hidden mb-2">
                    <label htmlFor="sidebar-search" className="sr-only">Search</label>
                    <div className="relative">
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
                            name="search"
                            id="sidebar-search"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="Search"
                        />
                    </div>
                </form>
                <ul className="space-y-3">

                    {(admin ? menuAdmin : menu).map((m, i) => {
                        return <li key={i}>
                            <MenuItem >
                                {m}
                            </MenuItem>
                        </li>
                    })}
                </ul>
                {!admin && <><div className='border-t border-gray-200 my-7'></div>
                    <ul
                        className=" space-y-2  dark:border-gray-700"
                    >

                        <li>
                            <a
                                href="#"
                                className="flex no-underline items-center p-2 text-base font-medium text-gray-900 rounded-lg transition duration-75 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group"
                            >
                                <svg
                                    aria-hidden="true"
                                    className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z"
                                        clip-rule="evenodd"
                                    ></path>
                                </svg>
                                <span className="ml-3">Help</span>
                            </a>
                        </li>
                    </ul>
                    <div className='my-5'></div>
                    <SellCarBanner /></>}
            </div>
            <div
                className="hidden absolute bottom-0 left-0 justify-center p-8 space-x-4 w-full lg:flex bg-white dark:bg-gray-800 z-20"
            >

                <ul className="space-y-2 w-full">
                    <li>
                        <Link
                            href="#"
                            className="flex no-underline items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                        >
                            <Settings2Icon />
                            <span className="ml-3">Settings</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </aside>

    )
}

export default Sidebar


const SellCarBanner = () => {
    return <div className='bg-gray-50 rounded-lg p-4 center gap-4 flex-col text-center'>
        <span className='text-[12px] opacity-40 font-semibold'>
            A new way to sell modern and classic cars
        </span>
        <Link href={"/new-car"}>
            <Button size='sm' className='bg-white text-black text-sm font-semibold' startContent={<AiFillCar />}>
                Sell your car
            </Button>
        </Link>
    </div>
}

