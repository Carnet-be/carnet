import Image from "next/image";
import Logo2 from "@assets/logo2.png";
import Logo from "@assets/logo.png";
import Mackup from "@assets/mockup_mobile.png";
import cx from "classnames";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { getServerAuthSession } from "../server/common/get-server-auth-session";
import {
  type InferGetServerSidePropsType,
  type NextPage,
  type GetServerSideProps,
} from "next/types";
import { prisma } from "../server/db/client";
import { type User } from "@prisma/client";
import CreateAuction from "@ui/createAuction";
import { signOut, useSession } from "next-auth/react";
import type { ReactNode} from "react";
import { useContext, useEffect, useState } from "react";
import {
  ArrowRightIconFill,
  DashboardIcon,
  DashboardIcon2,
  EditIcon,
  LogoutIcon,
  PersonIcon,
} from "@ui/icons";
import { FaCarAlt } from "react-icons/fa";
import { GiTakeMyMoney } from "react-icons/gi";
import { useIntl } from "react-intl";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { i18n, useTranslation } from "next-i18next";
import { LangContext, useLang } from "./hooks";
import { trpc } from "@utils/trpc";
import { AdvancedImage } from "@cloudinary/react";
import cloudy from "@utils/cloudinary";
import { MenuItem, Divider } from "@mui/material";
import { StyledMenu } from "@ui/profileCard";
import LangSwitcher from "@ui/components/langSwitcher";
import { Skeleton } from "antd";
import CarCard, { CarCardReadOnly } from "@ui/components/carCard";
import type { TCar } from "@model/type";
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);

  // if (process.env.NODE_ENV === "development") {
  //   await i18n?.reloadResources();
  // }
  const { locale } = context;
  return {
    props: {
      ...(await serverSideTranslations(locale || "fr", [
        "common",
        "pages",
        "dashboard",
      ])),
    },
  };
};

const Home: NextPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { text } = useLang({ file: "pages", selector: "home" });
  //signOut()
  return (
    <LangContext.Provider value={text}>
      <Head>
        <title>CARNET</title>
        <link rel="shortcut icon" href="/assets/logo.png" type="image/png" />
      </Head>
      <CreateAuction />
      <div className="relative bg-primary">
        <div className="relative h-screen w-screen overflow-hidden bg-primary">
          <div className="absolute top-0 left-0 z-30 flex h-full w-full flex-col">
            <MyNav />
            <div className="layout mx-auto flex flex-grow  flex-row">
              <div className="flex h-auto w-full max-w-[500px] flex-col justify-center gap-10">
                <h1 className="text-6xl font-semibold  text-white">
                  {text("hero.title")}{" "}
                  <span className="inline-block translate-y-3">
                    <Image src={Logo} height={60} alt="logo" />
                  </span>{" "}
                </h1>
                <p className="text-lg text-white/70">{text("hero.subtitle")}</p>
                <br />
                <DashBoardButton>{text("hero.button")}</DashBoardButton>
              </div>
              <div className="flex-grow" />
              <div className="grid  w-1/2 content-center">
                <Image src={Mackup} alt="Mockup Mobile" className="scale-125" />
              </div>
            </div>
          </div>

          <Overlay />
        </div>
        <NewCars />
        <CommentCaMarche />
        <About />
        {/* <Blogs /> */}
        <Contact />
        <Footer />
      </div>
    </LangContext.Provider>
  );
};

const DashBoardButton = ({ children }: { children: string }) => {
  //  const {data:user} =  useAuthUser(["user"], auth);
  const { data: user } = trpc.user.get.useQuery();

  return (
    <label
      htmlFor="create_auction"
      className={cx(
        "cursor-pointer rounded-lg bg-white py-3 text-center font-bold text-black",
        {
          hidden: !(user?.type == "AUC" || user == null),
        }
      )}
    >
      {children}
    </label>
  );
};
export const MyNav = () => {
  const text = useContext(LangContext);
  return (
    <div className="fixed top-0 left-0 z-[1000] flex h-[80px] w-screen bg-primary px-6 shadow-sm">
      <div className="layout mx-auto  flex flex-row items-center gap-6">
        <Image src={Logo2} height={50} alt="logo" />

        <div className="flex-grow" />
        <Link scroll={true} href={"/"} className="font-semibold  text-white">
          {text("navbar.menu.home")}
        </Link>
        <Link scroll={true} href={"/#how"} className="font-semibold text-white">
          {text("navbar.menu.how it works")}
        </Link>
        <Link
          scroll={true}
          href={"/#about"}
          className="font-semibold text-white"
        >
          {text("navbar.menu.about us")}
        </Link>
        <Link
          scroll={true}
          href={"/blogs"}
          className="font-semibold text-white"
        >
          {text("navbar.menu.blog")}
        </Link>
        <Link
          scroll={true}
          href={"/#contact"}
          className="font-semibold text-white"
        >
          {text("navbar.menu.contact us")}
        </Link>

        <ProfileButton />
        <LangSwitcher border />
      </div>
    </div>
  );
};

export const ProfileButton = () => {
  const text = useContext(LangContext);
  const { data: user, refetch, isLoading } = trpc.user.get.useQuery();
  const { data: session } = useSession();
  useEffect(() => {
    refetch();
  }, [refetch, session]);
  const { text: common } = useLang(undefined);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const router = useRouter();
  const toAccount = () => {
    router.push("/pages/settings");
  };

  const toDashboard = () => {
    if (user?.type === "ADMIN" || user?.type === "STAFF") {
      router.push("/admin/dashboard");
    }
    if (user?.type === "BID") {
      router.push("/dashboard/user");
    }
    if (user?.type === "AUC") {
      router.push("/dashboard/entreprise");
    }
  };

  if (isLoading)
    return (
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="20"
          height="20"
          className="animate-spin fill-white"
          viewBox="0 0 30 30"
        >
          <path d="M 13 3 A 2 2 0 0 0 11 5 A 2 2 0 0 0 13 7 A 2 2 0 0 0 15 5 A 2 2 0 0 0 13 3 z M 20 4 A 2 2 0 0 0 18 6 A 2 2 0 0 0 20 8 A 2 2 0 0 0 22 6 A 2 2 0 0 0 20 4 z M 7 7 A 2 2 0 0 0 5 9 A 2 2 0 0 0 7 11 A 2 2 0 0 0 9 9 A 2 2 0 0 0 7 7 z M 24.5 10 A 2.5 2.5 0 0 0 22 12.5 A 2.5 2.5 0 0 0 24.5 15 A 2.5 2.5 0 0 0 27 12.5 A 2.5 2.5 0 0 0 24.5 10 z M 5 13.75 A 1.25 1.25 0 0 0 3.75 15 A 1.25 1.25 0 0 0 5 16.25 A 1.25 1.25 0 0 0 6.25 15 A 1.25 1.25 0 0 0 5 13.75 z M 23 17 A 3 3 0 0 0 20 20 A 3 3 0 0 0 23 23 A 3 3 0 0 0 26 20 A 3 3 0 0 0 23 17 z M 7 19 A 1 1 0 0 0 6 20 A 1 1 0 0 0 7 21 A 1 1 0 0 0 8 20 A 1 1 0 0 0 7 19 z M 14.5 20 A 3.5 3.5 0 0 0 11 23.5 A 3.5 3.5 0 0 0 14.5 27 A 3.5 3.5 0 0 0 18 23.5 A 3.5 3.5 0 0 0 14.5 20 z"></path>
        </svg>
      </div>
    );
  if (!user)
    return (
      <div className="flex flex-row items-center gap-2">
        <Link
          href={"/auth/signup/auctionnaire"}
          className={cx(
            "rounded-lg border-2 border-white bg-white px-6 py-1 text-sm font-semibold no-underline"
          )}
        >
          {text("navbar.register button")}
        </Link>
        <Link
          href={"/auth/login"}
          className={cx(
            "rounded-lg border-2 border-white px-6 py-1 text-sm font-semibold text-white no-underline"
          )}
        >
          {text("navbar.login button")}
        </Link>
      </div>
    );

  return (
    <div>
      <button
        onClick={handleClick}
        className="flex flex-row items-center gap-2 rounded-full bg-white py-1 px-2 text-primary"
      >
        <span>{user.username}</span>

        <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-primary  font-bold uppercase text-white">
          {!user.image ? (
            user.username[0]
          ) : (
            <AdvancedImage
              cldImg={cloudy.image(user.image?.fileKey)}
              quality={20}
            />
          )}
        </div>
      </button>

      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={toDashboard} disableRipple className="menu-item">
          <DashboardIcon2 />
          {common("button.dashboard")}
        </MenuItem>
        <MenuItem onClick={toAccount} disableRipple className="menu-item">
          <PersonIcon />
          {common("button.account")}
        </MenuItem>
        {/* <MenuItem onClick={handleClose} disableRipple className="menu-item">
         <SupportIcon />
         Supports
       </MenuItem> */}
        <Divider sx={{ my: 0.5 }} />

        <MenuItem
          onClick={() => {
            signOut();
          }}
          disableRipple
          className="menu-item"
        >
          <LogoutIcon className="text-red-500" />
          {common("button.logout")}
        </MenuItem>
      </StyledMenu>
    </div>
  );
};

const Overlay = () => {
  return (
    <div className="absolute top-0 right-0 z-10 flex h-[90vh] w-[100vh] translate-x-[5vw] translate-y-[10vh] -rotate-[10deg] items-center justify-center rounded-[100px] bg-[#196EBD]/50 shadow-lg">
      <div className="flex h-[70%] w-[70%] translate-x-[50px]  items-center justify-center rounded-[80px] bg-[#196EBD] shadow-lg">
        <div className="h-[60%] w-[60%] translate-x-[20px] -translate-y-[20px] rounded-[70px] bg-[#181BAA] shadow-lg"></div>
      </div>
    </div>
  );
};
export default Home;

const CommentCaMarche = () => {
  const text = useContext(LangContext);
  const Item = ({ icon, index }: { icon: ReactNode; index: number }) => {
    return (
      <div className="flex w-[240px] flex-col items-center gap-3">
        <div className="flex h-[80px] w-[80px] flex-row items-center justify-center rounded-xl rounded-bl-none bg-primary p-3">
          {icon}
        </div>
        <h6 className="text-primary">
          {text(`how it works.step${index}.title`)}
        </h6>
        <p className="text-center text-[12px] opacity-70">
          {text(`how it works.step${index}.subtitle`)}
        </p>
      </div>
    );
  };
  const items = [
    {
      icon: <EditIcon className="text-[40px] text-white" />,
    },
    {
      icon: <FaCarAlt className="text-[40px] text-white" />,
    },
    {
      icon: <GiTakeMyMoney className="text-[40px] text-white" />,
    },
  ];

  return (
    <section id="how" className="flex flex-col items-center gap-10 bg-white">
      <h2 className="uppercase text-primary">{text("how it works.title")}</h2>
      <p>{text("how it works.subtitle")}</p>
      <div className="flex flex-row items-start justify-center gap-6 py-10">
        {items.map((item, index) => (
          <>
            <div
              className={cx("flex h-[100px] flex-col", {
                hidden: index === 0,
                "justify-end": index === 2,
                "justify-start": index === 1,
              })}
            >
              <Image
                src={`/assets/path_${index}.svg`}
                width={140}
                height={50}
                alt="path"
              />
            </div>
            <Item key={index} index={index + 1} icon={item.icon} />
          </>
        ))}
      </div>
    </section>
  );
};

const About = () => {
  const text = useContext(LangContext);
  return (
    <section
      id="about"
      className="flex flex-col items-center gap-10 bg-white py-10"
    >
      <h2 className="uppercase text-primary">{text("about us.title")} </h2>
      <div className="flex flex-row items-center gap-[60px] py-10">
        <div className="w-[500px]">
          <p>{text("about us.subtitle")}</p>
        </div>

        <Image src="/assets/about.png" alt="about" width={400} height={400} />
      </div>
    </section>
  );
};

const Blogs = () => {
  return <section id="blogs"></section>;
};

const Contact = () => {
  const s = "contact us";
  const text = useContext(LangContext);
  const email = "info@carnet.io";
  const nums = ["+33 6 00 00 00 00", "+33 6 00 00 00 01"];
  return (
    <section
      id="contact"
      className="flex flex-row items-start justify-evenly gap-[40px] bg-white py-20"
    >
      <div className="space-y-10">
        <h2 className="text-primary">{text(s + ".title")} </h2>
        <p>{text(s + ".subtitle")}</p>
        <div>
          <h6 className="text-primary">{text(s + ".email")} </h6>
          <h6>{email}</h6>
        </div>
        <div>
          <h6 className="text-primary">{text(s + ".phone")} </h6>
          {nums.map((num, index) => (
            <h6 key={index}>{num}</h6>
          ))}
        </div>
      </div>
      <div className="w-[400px] space-y-4">
        <div>
          <h6 className="text-primary">{text(s + ".form.name")} </h6>
          <input
            type="text"
            className="mt-1 h-[40px] w-full rounded-sm bg-[#F7F7F7] px-2"
          />
        </div>
        <div>
          <h6 className="text-primary">{text(s + ".form.email")}</h6>
          <input
            type="text"
            className="mt-1 h-[40px] w-full rounded-sm bg-[#F7F7F7] px-2"
          />
        </div>
        <div>
          <h6 className="text-primary">{text(s + ".form.message")}</h6>
          <textarea
            rows={6}
            className=" mt-1 w-full rounded-sm bg-[#F7F7F7] px-2 py-2"
          />
        </div>
        <button className="btn-primary btn-wide btn w-full">
          {text(s + ".form.button")}
        </button>
      </div>
    </section>
  );
};

export const Footer = () => {
  const s = "footer.menu";
  const text = useContext(LangContext);
  return (
    <footer className="flex flex-col items-center gap-2 py-3">
      <Image
        src={"/assets/logo.png"}
        alt="logo"
        width={200}
        height={100}
        className={"my-6"}
      />
      <div className="flex flex-row items-center justify-center gap-10 ">
        <Link scroll={true} href={"/#"} className="font-semibold  text-white">
          {text(s + ".home")}
        </Link>
        <Link scroll={true} href={"/#how"} className="font-semibold text-white">
          {text(s + ".how it works")}
        </Link>
        <Link
          scroll={true}
          href={"/#about"}
          className="font-semibold text-white"
        >
          {text(s + ".about us")}
        </Link>
        <Link
          scroll={true}
          href={"/blogs"}
          className="font-semibold text-white"
        >
          {text(s + ".blog")}
        </Link>
        <Link
          scroll={true}
          href={"/#contact"}
          className="font-semibold text-white"
        >
          {text(s + ".contact us")}
        </Link>

        <Link
          scroll={true}
          href={"/#terms_conditions"}
          className="font-semibold text-white"
        >
          {text(s + ".terms and conditions")}
        </Link>
        <Link
          scroll={true}
          href={"/#privacy_policy"}
          className="font-semibold text-white"
        >
          {text(s + ".privacy policy")}
        </Link>
      </div>
      <div className="flex w-full max-w-[1300px] flex-row items-center justify-between border-t-[2px] border-white py-6">
        <span> </span>
        <span className="text-sm text-white opacity-70">
          Copyright © 2023 Carnet
        </span>
      </div>
    </footer>
  );
};

const NewCars = () => {
  const text = useContext(LangContext);
  const { data, isLoading } = trpc.auctionnaire.getCars.useQuery({
    filter: "all",
    limit: 4,
  });

  return (
    <div
      className={cx(
        "flex flex-col items-center gap-10 rounded-t-[100px] bg-white py-[100px]",
        {
          hidden: !isLoading && data?.length === 0,
        }
      )}
    >
      <h2 className="uppercase text-primary ">{text("new car.title")} </h2>
      <div className="grid w-full max-w-[1000px] grid-cols-3 items-center justify-center gap-6">
        {isLoading
          ? [1, 2, 3].map((a, i) => (
              <div key={i} className="w-full space-y-4">
                <Skeleton.Image active={true} className="h-[200px] w-full" />
                <Skeleton active={true} className="w-full" />
              </div>
            ))
          : data?.map((a, i) => (
              <CarCardReadOnly key={i} auction={a as unknown as TCar} />
            ))}
      </div>
      <Link
        href={"/dashboard/user"}
        className="btn-outline btn-primary btn-sm btn"
      >
        {text("new car.button")}
      </Link>
    </div>
  );
};
