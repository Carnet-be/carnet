import { Uploader } from "rsuite";
import CameraRetroIcon from "@rsuite/icons/legacy/CameraRetro";
import { type MutableRefObject } from "react";
import { type FileType } from "rsuite/esm/Uploader";

type UploadProps={
    uploadRef?:MutableRefObject<undefined>,
    value:FileType[],
    setValue:(fileList: FileType[]) => void
    
}
const Upload = ({uploadRef,value,setValue}:UploadProps) => {
   
  return (
    <Uploader
      multiple
      listType="picture"
      autoUpload={false}
       fileList={value}
      ref={uploadRef}
     onChange={setValue}
      action="//jsonplaceholder.typicode.com/posts/"
      className="flex flex-row items-center justify-center"
    >
      <button>
        <CameraRetroIcon />
      </button>
    </Uploader>
  );
};

export default Upload;
