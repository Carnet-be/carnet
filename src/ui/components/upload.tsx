import { Uploader } from "rsuite";
import CameraRetroIcon from "@rsuite/icons/legacy/CameraRetro";
import { type MutableRefObject } from "react";
import { type FileType } from "rsuite/esm/Uploader";
import { AddPhotoIcon } from "@ui/icons";

type UploadProps = {
  uploadRef?: MutableRefObject<undefined>;
  value: FileType[];
  setValue: (fileList: FileType[]) => void;
};
const Upload = ({ uploadRef, value, setValue }: UploadProps) => {
  return (
    <div className="max-h-[200px] overflow-scroll">
      <Uploader
        action="//jsonplaceholder.typicode.com/posts/"
        draggable
        multiple
        listType="picture-text"
        autoUpload={false}
        fileList={value}
        ref={uploadRef}
        onChange={setValue}
      >
        <div
          style={{
            height: 80,
            display: "flex",
            
            flexDirection:"row",
            alignItems: "center",
            justifyContent: "center",
          }}

          className="cursor-pointer h-[80px] items-center justify-center"
        >
        <div className="flex flex-col  gap-2 items-center">
        <AddPhotoIcon className="text-2xl mr-3"/> <span>Click or Drag images to this area to upload</span>
        </div>
        </div>
      </Uploader>
    </div>
    // <Uploader
    //   multiple
    //   listType="picture"
    //   autoUpload={false}
    //    fileList={value}
    //   ref={uploadRef}
    //  onChange={setValue}
    //   action="//jsonplaceholder.typicode.com/posts/"
    //   className="flex flex-row items-center justify-center"
    // >
    //   <button>
    //     <CameraRetroIcon />
    //   </button>
    // </Uploader>
    // <Uploader
    //   multiple
    //   listType="picture"
    //   autoUpload={false}
    //    fileList={value}
    //   ref={uploadRef}
    //  onChange={setValue}
    //   action="//jsonplaceholder.typicode.com/posts/"
    //   className="flex flex-row items-center justify-center"
    // >
    //   <button>
    //     <CameraRetroIcon />
    //   </button>
    // </Uploader>
  );
};

export default Upload;
