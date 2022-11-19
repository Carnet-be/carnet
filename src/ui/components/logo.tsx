import React, { FunctionComponent } from 'react'
import Image  from 'next/image';
import Logo2 from "@assets/logo2.png";
import Log from "@assets/logo.png";
import Link from 'next/link';
type LogoProps={
    type?:"1"|"2",
    size:number,
    
}
const Logo:FunctionComponent<LogoProps> = ({type=1,size}) => {
  return <Link href={"/"} className="cursor-pointer"><Image  src={type=="1"?Log:Logo2} height={size} alt="logo"/></Link>
  
}

export default Logo