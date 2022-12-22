
import cx from "classnames"
import PropagateLoader from "react-spinners/PropagateLoader"
const Loading=({classContainer="h-full",size}:{classContainer?:string,size?:number})=>{


    return <div className={cx("w-full h-[80vh] flex items-center justify-center",classContainer)}><PropagateLoader size={size||undefined} color="#36d7b7"/></div>
}

export default Loading