/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'
import cx from "classnames"

export type TMenuItem = {
    label: string,
    route: string,
    icon: React.ReactNode,
    children?: TMenuItem[]
}
const MenuItem = ({ children }: { children: TMenuItem }) => {
    const pathname = usePathname()
    const [isActive, setIsActive] = React.useState(false)
    useEffect(() => {
        setIsActive(pathname === children.route)
    }
        , [pathname])
    return (
        <Link
            href={children.route}

            className={cx("flex no-underline items-center p-2 text-base font-medium rounded-lg  group",isActive?"text-primary-foreground  bg-primary ":"text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700")}
        >
            {children.icon}
            <span className="ml-3">
                {children.label}
            </span>


        </Link>
    )
}

export default MenuItem