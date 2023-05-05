import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, type ReactNode } from "react";
import { LangContext } from "../pages/hooks";

const SignupLayout = ({
  children,
  type,
}: {
  type: "auctioneer" | "bidder";
  children: ReactNode;
}) => {
  const text = useContext(LangContext);

  return (
    <>
      <div className="h-[20px]"></div>
      <div className="flex flex-grow flex-col justify-center gap-2">
        <div className="h-[0px]"></div>
        <h1 className="text-3xl font-semibold text-primary">
          {text("register." + type + ".title")}
        </h1>
        <p className="py-3  text-opacity-70">
          {text("register." + type + ".subtitle")}
          {"? "}

          <Link
            href={
              type === "bidder"
                ? "/auth/signup/auctionnaire"
                : "/auth/signup/bidder"
            }
          >
            {text("register." + type + ".link")}
          </Link>
        </p>
        <div className="h-[10px]"></div>
        {children}
      </div>
    </>
  );
};

export default SignupLayout;

const SignupSwitcher = () => {
  const path = useRouter().pathname;
  const text = useContext(LangContext);
  const Section = ({ link, title }: { link: string; title: string }) => {
    return (
      <div className="flex flex-col gap-1">
        <Link
          href={link}
          className="text-2xl font-semibold text-primary no-underline"
        >
          {text(`register.menu.${title}`)}
        </Link>
        <div hidden={path !== link} className="h-[3px] w-auto bg-primary"></div>
      </div>
    );
  };
  const menu = [
    {
      link: "/auth/signup/bidder",
      title: "bidder",
    },
    {
      link: "/auth/signup/auctionnaire",
      title: "auctioneer",
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
