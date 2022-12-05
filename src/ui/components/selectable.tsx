/* eslint-disable @typescript-eslint/no-explicit-any */
import { Select, MenuItem } from '@mui/material'
import React from 'react'

type SelectableProps={
  value?:string,
  options:Array<string>,
  label:string,
  setValue:(s:any)=>void,
  props:any
}
const Selectable = ({value,options,label,setValue,props}:SelectableProps) => {

  return (
    <Select
    {...props}
    value={value}
    label={label}
    onChange={(e)=>{
       setValue(e.target.value)
    }}
  >
    {options.map((o,i)=> <MenuItem key={i} value={o}>{o}</MenuItem>)}
  </Select>
  )
}

export default Selectable