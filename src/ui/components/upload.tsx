import { Uploader } from "rsuite";
import CameraRetroIcon from "@rsuite/icons/legacy/CameraRetro";
import { type MutableRefObject } from "react";
import { type FileType } from "rsuite/esm/Uploader";

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
            alignItems: "center",
            justifyContent: "center",
          }}
          className="cursor-pointer"
        >
          <span>Click or Drag images to this area to upload</span>
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
