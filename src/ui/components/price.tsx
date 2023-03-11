import React from 'react'

export const getPrice = (value:number|undefined|null,currency="€") => {
  return !value?"---": new Intl.NumberFormat().format(value)+" "+currency
  
  
}
const Price = ({value,textStyle,currency="€"}:{value:number|undefined|null,textStyle?:string,currency?:string}) => {
  return (
    <span className={textStyle}>
      {getPrice(value,currency)}
    </span>
  )
}

export default Price