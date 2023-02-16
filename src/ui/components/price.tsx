import React from 'react'

const Price = ({value,textStyle,currency="€"}:{value:number|undefined|null,textStyle?:string,currency?:string}) => {
  return (
    <span className={textStyle}>
          {!value?"---": new Intl.NumberFormat().format(value)} {" "} {currency}
    </span>
  )
}

export default Price