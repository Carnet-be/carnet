import React, { FunctionComponent } from 'react'
import Lottie from './components/lottie'
import animationData from "@animations/in_development.json"
type InDevelopmentProps={
    section?:string,
    fullPage?:boolean
}
const InDevelopment:FunctionComponent<InDevelopmentProps> = ({section="Section",fullPage=true}) => {

  return (
    <div className='h-screen w-screen flex flex-col justify-center items-center gap-4'>
        <div>
          <Lottie animationData={animationData}/>
        </div>
        <span className='text-caption'><span className='underline text-primary'>{section}</span> en cours de développement</span>
    </div>
  )
}

export default InDevelopment