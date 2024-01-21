import { Spinner } from "@nextui-org/react";

const LoadingSection = () => {
  return (
    <div className="flex w-full items-center justify-center pt-20">
      <Spinner size="lg" />
    </div>
  );
};

export default LoadingSection;
