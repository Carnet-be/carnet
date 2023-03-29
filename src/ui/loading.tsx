import React from "react";
import Lottie from "./components/lottie";
import animationData from "@animations/loading.json";
import { Spin } from "antd";
const Loading = () => {
  return (
    <div className="flex h-screen w-screen flex-row items-center justify-center bg-white">
      <div className="w-[100px]">
        <Lottie animationData={animationData} />
      </div>
    </div>
  );
};

export default Loading;

export const LoadingSpin = () => {
  return <Spin size="large"></Spin>;
};

export const LoadingSpinPage = () => {
  return (
    <div className="flex flex-row items-center justify-center">
      <Spin size="large"></Spin>
    </div>
  );
};
