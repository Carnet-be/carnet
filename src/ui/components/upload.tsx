/* eslint-disable @typescript-eslint/no-explicit-any */

import CameraRetroIcon from "@rsuite/icons/legacy/CameraRetro";
import { useContext, type MutableRefObject, useState, useEffect } from "react";
import { Uploader } from "rsuite";
import { AddPhotoIcon } from "@ui/icons";
import type { AssetImage } from "@prisma/client";
import { env } from "@env/server.mjs";
import { toast } from "react-hot-toast";
import { LangCommonContext } from "../../pages/hooks";
import type { FileType } from "rsuite/esm/Uploader";

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
  const [files, setFiles] = useState<
    {
      file: FileType;
      res: any;
    }[]
  >([]);
  const common = useContext(LangCommonContext);
  const onSuccess = (res: any, file: FileType) => {
    // console.log('File',f)
    const img = {
      fileKey: res.public_id,
      name: file.name || "",
      url: res.url,
    };
    const l = [...value, img as AssetImage];
    console.log("l", l);
    setValue(l);
    return;
  };

  useEffect(() => {
    console.log("files", files);
    // setValue(files.map(({ res }) => res));
  }, [files]);
  const onError = () => toast.error("Error d'upload");
  return (
    <div className="max-h-[200px] overflow-scroll">
      <Uploader
        action={ACTION_UPLOAD}
        //FIXME:remove public id
        data={UNSIGNE_UPLOAD}
        draggable
        defaultFileList={value}
        // listType="picture-text"
        listType="picture"
        fileList={value}
        ref={uploadRef}
        onRemove={onRemove}
        onSuccess={onSuccess}
        // onChange={(fileList) => {
        //   console.log("Change", fileList);
        //   setValue(
        //     fileList.map(
        //       (file) =>
        //         ({
        //           fileKey: file.fileKey,
        //           name: file.name,
        //           url: file.url,
        //         } as AssetImage)
        //     )
        //   );
        // }}
      >
        <div
          style={{
            // height: 80,
            display: "flex",
            width: "200px",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="h-[80px] w-full cursor-pointer items-center justify-center"
        >
          <div className="flex w-full  w-[100px] flex-col items-center justify-center">
            <AddPhotoIcon className="text-2xl" />{" "}
            {/* <span>{common("text.click or drag")}</span> */}
            <span className="text-[9px]  font-bold">
              {common("text.click or drag")}
            </span>
          </div>
        </div>
      </Uploader>
    </div>
  );
};

export default Upload;
