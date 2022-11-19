import Logo from "@ui/components/logo";
import Image from "next/image";
import Car from "@assets/car.png";


export default function Auth({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <div className="absolute top-0 left-0 z-20 flex flex-row py-6 h-full w-full">
        <div className="layout mx-auto flex flex-row items-center justify-between">
          <div className="w-1/2 flex flex-col h-full overflow-y-scroll">
            <Logo size={50} />
            {children}
            
          </div>
          <div className="w-1/2">
            <Image
              src={Car}
              alt="left side"
              className="scale-125 -translate-x-[0px]"
            />
          </div>
        </div>
      </div>
      <Overlay />
    </div>
  );
}


const Overlay = () => {
  return (
    <>
      {" "}
      <div className="absolute z-[1] -bottom-[40vh] rotate-12 -right-[30vh] rounded-[60px] bg-[#196EBD]/30 w-[100vh] h-[100vh]"></div>
      <div className="absolute z-[2] -top-[50vh] -rotate-[17deg] -right-[30vh] rounded-[60px] bg-[#60A1DC] w-[100vh] h-[100vh]"></div>
      <div className="absolute z-[2] -top-[50vh] -rotate-[17deg] -right-[60vh] rounded-[60px] bg-[#181BAA] w-[100vh] h-[100vh]"></div>
    </>
  );
};
