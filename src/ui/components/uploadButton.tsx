/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { useRef, useState } from "react";
import {
  LoadingOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, message, Upload } from "antd";
import type { UploadChangeParam } from "antd/es/upload";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import ImgCrop from "antd-img-crop";
import { env } from "@env/client.mjs";
import { toast } from "react-hot-toast";
import { AssetImage } from ".prisma/client";
import { useLang } from "../../pages/hooks";

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

export type TImage = {
  fileKey: string;
  name: string;
  url: string;
};
const MyUpload = ({
  onSuccess,
  setPreviewImage,
  aspect,
}: {
  onSuccess: (img: TImage) => void;
  setPreviewImage: (img: TImage) => void;
  aspect?: number;
}) => {
  const [isUploading, setUploading] = useState(false);
  const handleChange: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === "uploading") {
      setUploading(true);
      return;
    }

    console.log(info.file.percent);
    if (info.file.status === "done") {
      // Get this url from response in real world.
      setUploading(false);
      const img = {
        fileKey: info.file.response.public_id,
        url: info.file.response.secure_url,
        name: info.file.name,
      };
      setPreviewImage(img);
      onSuccess(img);
      //   getBase64(info.file.originFileObj as RcFile, (url) => {
      //     setUploading(false);
      //     setImageUrl(url);
      //   });
    }
  };

  // const uploadButton = (
  //   <div>
  //     {isUploading ? <LoadingOutlined /> : <PlusOutlined />}
  //     <div style={{ marginTop: 8 }}>photo</div>
  //   </div>
  // );
  const { text: common } = useLang(undefined);
  return (
    <ImgCrop rotate grid aspect={aspect}>
      <Upload
        action={ACTION_UPLOAD}
        data={UNSIGNE_UPLOAD}
        // listType="picture-card"
        // fileList={fileList}
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {/* {imageUrl ? (
          <img  src={imageUrl} alt="avatar" style={{ width: "100px" }} />
        ) : (
          uploadButton
        )} */}
        <Button
          loading={isUploading}
          icon={<UploadOutlined />}
          className="flex flex-row items-center gap-2"
        >
          {common("text.change image")}
        </Button>
      </Upload>
    </ImgCrop>
  );
};

export default MyUpload;
