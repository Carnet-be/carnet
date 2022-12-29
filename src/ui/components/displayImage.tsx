import { AdvancedImage } from "@cloudinary/react"
import { type CloudinaryImage } from "@cloudinary/url-gen"


const DisplayImage=({cldImg}:{cldImg:CloudinaryImage})=>{
    return <AdvancedImage cldImg={cldImg}/>
}

export default DisplayImage