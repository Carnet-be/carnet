import Image from "next/image";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white py-48">
      <div className="flex flex-col">
        <div className="flex flex-col items-center">
          <Image src="/logo.png" width={200} height={200} alt="404" />

          <div className="mt-10 text-3xl font-bold md:text-5xl lg:text-6xl xl:text-7xl">
            This page does not exist
          </div>

          <div className="mt-8 max-w-xl text-center text-sm font-medium text-gray-400 md:text-xl lg:text-2xl">
            The garage you are looking for might have been removed, had its name
            changed or is temporarily unavailable.
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
