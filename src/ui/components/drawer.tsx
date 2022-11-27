/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { type ReactNode } from 'react'

type DrawerProps={
  open:boolean,
  setOpen:any,
  content:ReactNode,
  children:ReactNode
}
const Drawer = ({open,setOpen,children,content}:DrawerProps) => {
  return (
    <div className="drawer">
    <input id="drawer" type="checkbox" checked={open} onChange={(v)=>setOpen(v.currentTarget.checked)}  className="drawer-toggle" />
    <div className="drawer-content">
       {children}
    </div> 
    <div className="drawer-side">
      <label htmlFor="drawer" className="drawer-overlay"></label>
      {content}
    </div>
  </div>
  )
}

export default Drawer