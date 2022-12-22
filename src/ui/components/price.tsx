import React from 'react'

const Price = ({value,textStyle,currency="€"}:{value:number,textStyle?:string,currency?:string}) => {
  return (
    <span className={textStyle}>
          {new Intl.NumberFormat().format(value)} {" "} {currency}
    </span>
  )
}

export default Price