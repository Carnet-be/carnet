import React, { type FunctionComponent } from 'react'
import Image  from 'next/image';
import Link from 'next/link';
type LogoProps={
    type?:"1"|"2",
    size:number,
    
}
const Logo:FunctionComponent<LogoProps> = ({type=1,size}) => {
    const Log="/logo.png"
    const Logo2="/logo2.png"
  return <Link href={"/"} className="cursor-pointer"><Image  src={type=="1"?Log:Logo2} height={size} width={100} alt="logo"/></Link>
  
}

export default Logo