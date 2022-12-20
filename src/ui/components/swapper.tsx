import { type ReactNode } from "react"

interface Props{
    on:ReactNode,
    off:ReactNode
}
const Swapper=({on,off}:Props)=>{
    return <label className="btn swap swap-rotate py-0 btn-ghost">
  
    <input type="checkbox" />
    

   <div className="swap-off">
{off}
   </div>
   <div className="swap-on">
{on}
</div>
    
  </label>
}

export default Swapper