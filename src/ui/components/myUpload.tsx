/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { useRef, useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import type { UploadChangeParam } from "antd/es/upload";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import ImgCrop from "antd-img-crop";
import { env } from "@env/client.mjs";
import { toast } from "react-hot-toast";

export const ACTION_UPLOAD = `https://api.cloudinary.com/v1_1/${env.NEXT_PUBLIC_CLOUDY_NAME_CLIENT}/image/upload`;
export const UNSIGNE_UPLOAD = {
  upload_preset: "public",
  api_key: env.NEXT_PUBLIC_CLOUDY_API_KEY_CLIENT,
};
const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    toast.error("Doit être JPG / PNG");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    toast.error("La taille ne doit pas depasser 2MB");
  }
  return isJpgOrPng && isLt2M;
};
const MyUpload = ({
  onSuccess,
  isUploading,
  setUploading,
  valueUrl,refUpload
}: {
  onSuccess: (key: string) => void;
  setUploading: (b: boolean) => void;
  isUploading: boolean;
  valueUrl: string | undefined;
  refUpload?:React.MutableRefObject<null>
}) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(valueUrl);

  const handleChange: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === "uploading") {
      setUploading(true);
      return;
    }
    
    console.log(info.file.percent)
    if (info.file.status === "done") {
      // Get this url from response in real world.
      onSuccess(info.file.response.public_id);
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setUploading(false);
        setImageUrl(url);
      });
    }
  };

  const uploadButton = (
    <div>
      {isUploading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>photo</div>
    </div>
  );

  return (
   <ImgCrop rotate grid>
      <Upload
         ref={refUpload}
        action={ACTION_UPLOAD}
        data={UNSIGNE_UPLOAD}
        listType="picture-card"
        // fileList={fileList}
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {imageUrl ? (
          <img  src={imageUrl} alt="avatar" style={{ width: "100px" }} />
        ) : (
          uploadButton
        )}
      </Upload>
    </ImgCrop>
  );
};

export default MyUpload;
