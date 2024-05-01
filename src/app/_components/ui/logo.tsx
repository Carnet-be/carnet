import Image from 'next/image';
import Link from 'next/link';
import React, { type FunctionComponent } from 'react';
type LogoProps={
    type?:"1"|"2",
    size:number,
    link?:string

}
const Logo:FunctionComponent<LogoProps> = ({type=1,size, link='/'}) => {
    const Log="/logo.png"
    const Logo2="/logo2.png"
  return <Link href={link} className="cursor-pointer"><Image  src={type=="1"?Log:Logo2} height={size} width={100} alt="logo"/></Link>

}

export default Logo
