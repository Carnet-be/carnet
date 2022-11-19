
import Link from "next/link";
import { useRouter } from "next/router";
import { type ReactNode } from "react";


const SignupLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
    <div className="h-[20px]"></div>
      <SignupSwitcher />
      <div className="flex-grow flex flex-col gap-2 justify-center">
            
           
      <div className="h-[0px]"></div>
      <h1 className="text-primary font-semibold text-3xl">Sign Up</h1>
      <p className="text-opacity-70 py-3">Manage all your cars efficiently with CARNET</p>
      <div className="h-[10px]"></div>
      {children}
      </div>
    </>
  );
};

export default SignupLayout;

const SignupSwitcher = () => {
  const path = useRouter().pathname;

  const Section = ({ link, title }: { link: string; title: string }) => {
    return (
      <div className="flex flex-col gap-1">
        <Link href={link} className="text-2xl font-semibold text-primary">
          {title}
        </Link>
        <div hidden={path !== link} className="h-[3px] w-auto bg-primary"></div>
      </div>
    );
  };
  const menu = [
    {
      link: "/auth/signup/bidder",
      title: "Bidder",
    },
    {
      link: "/auth/signup/auctionnaire",
      title: "Auctionnaire",
    },
  ];
  return (
    <div className="flex flex-row gap-6">
      {menu.map((m, i) => (
        <Section key={i} link={m.link} title={m.title} />
      ))}
    </div>
  );
};
