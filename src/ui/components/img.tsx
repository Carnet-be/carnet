import {
  accessibility,
  AdvancedImage,
  lazyload,
  placeholder,
  responsive,
} from "@cloudinary/react";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import cloudy from "@utils/cloudinary";
import Image from "next/image";
import React from "react";
import type { TImage } from "./uploadButton";

const placeholderImg="https://via.placeholder.com/200x200/cccccc/664e4e?text="

type TImg = {
  src: TImage | undefined;
  width?: number;
  height?: number;
};
const Img = ({ src, width = 150, height = 150 }: TImg) => {
    return <div style={{width,height}} className="rounded-md overflow-hidden">
        <Image src={src?.url||placeholderImg} alt="photo" className="object-cover" width={width} height={height}/>
    </div>
//   return (
//     <AdvancedImage
//       cldImg={cloudy
//         .image(src ? src.fileKey : "placeholder_male")
//         .resize(thumbnail().width(width).height(height))
//         .roundCorners(byRadius(20))}
//       plugins={[lazyload(), responsive(), accessibility(), placeholder()]}
//     />
//   );
};

export default Img;
