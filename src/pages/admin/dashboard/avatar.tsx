import React from 'react'

type MyAvatarProps={
    img?:string
}
const MyAvatar = ({img}:MyAvatarProps) => {

    if(!img){
        <div className="avatar placeholder">
        <div className="bg-neutral-focus text-neutral-content rounded-full w-24">
        <span className="text-3xl">K</span>
        </div>
</div> 
    }
  return (
    <div>MyAvatar</div>
  )
}

export default MyAvatar