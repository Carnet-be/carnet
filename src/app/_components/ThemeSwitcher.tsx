/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client"
import {  MoonIcon, Sun } from 'lucide-react'
import React from 'react'
import {useTheme} from "next-themes";
import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()
  
    useEffect(() => {
      setMounted(true)
    }, [])
  
    if(!mounted) return null
  
  return (
     <button
     onClick={()=>setTheme(theme === 'light' ? 'dark' : 'light')}
     className="iconButton"
   >
       {theme === 'light' ? <Sun /> : <MoonIcon />}
   </button>
  )
}

export default ThemeSwitcher