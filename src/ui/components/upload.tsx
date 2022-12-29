/* eslint-disable @typescript-eslint/no-explicit-any */
import { Uploader } from "rsuite";
import CameraRetroIcon from "@rsuite/icons/legacy/CameraRetro";
import { type MutableRefObject } from "react";
import { type FileType } from "rsuite/esm/Uploader";
import { AddPhotoIcon } from "@ui/icons";
import type { AssetImage } from "@prisma/client";
import { env } from "@env/server.mjs";
import { toast } from 'react-hot-toast';

type UploadProps = {
  uploadRef?: MutableRefObject<undefined>;
  value: AssetImage[];
  setValue: (fileList: AssetImage[]) => void;
};
export function previewFile(file: any, callback: (s: unknown) => void) {
  const reader = new FileReader();
  reader.onloadend = () => {
    callback(reader.result);
  };
  reader.readAsDataURL(file);
}

export const ACTION_UPLOAD = `https://api.cloudinary.com/v1_1/${env.NEXT_PUBLIC_CLOUDY_NAME_CLIENT}/image/upload`;
export const UNSIGNE_UPLOAD = {
  upload_preset: "public",
  api_key: env.NEXT_PUBLIC_CLOUDY_API_KEY_CLIENT,
};
const Upload = ({ uploadRef, value, setValue }: UploadProps) => {
  const onRemove = (file: FileType) => {
    console.log("Rove", file);
    console.log("images", value);
    setValue(value.filter((img) => img.name != file.name));
  };

  const onSuccess = (res: any, file: FileType) => {
    console.log("Succes upload", res.url);
    // console.log('File',f)
    const img = {
      fileKey: res.public_id,
      name: file.name || "",
      url: res.url,
    };
    setValue([...value, img as AssetImage]);
  };
  const onError=()=>toast.error("Error d'upload")
  return (
    <div className="max-h-[200px] overflow-scroll">
      <Uploader
        action={ACTION_UPLOAD}
        //FIXME:remove public id
        data={UNSIGNE_UPLOAD}
        draggable
        multiple
        defaultFileList={value}
        listType="picture-text"
        ref={uploadRef}
        onRemove={onRemove}
        onSuccess={onSuccess}
        onError={onError}
      >
        <div
          style={{
            height: 80,
            display: "flex",

            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="h-[80px] cursor-pointer items-center justify-center"
        >
          <div className="flex flex-col  items-center gap-2">
            <AddPhotoIcon className="mr-3 text-2xl" />{" "}
            <span>Click or Drag images to this area to upload</span>
          </div>
        </div>
      </Uploader>
    </div>
  );
};

export default Upload;
