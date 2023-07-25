import { Garage } from "@prisma/client";
import { prisma } from "../../server/db/client";
import { TCar, TUser } from "@model/type";
import { userAgent } from "next/server";
import Image from "next/image";
import { Divider } from "antd";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { LangContext, useLang } from "../hooks";
import LangSwitcher from "@ui/components/langSwitcher";
import Link from "next/link";
import { useContext } from "react";
import { ProfileButton } from "../index";
import Logo2 from "@assets/logo2.png";
import Logo from "@assets/logo.png";
import { CarList } from "../dashboard/user/home";
import AuctionCard from "@ui/components/auctionCard";
import { CarCardReadOnly } from "@ui/components/carCard";
import { useRouter } from "next/router";
import Head from "next/head";
import { getBaseUrl } from "../_app";
import NoCardAnimation from "../../../public/animations/empty_garage.json";
import Lottie from "@ui/components/lottie";
function Garage({
  garage,
  cars,
  user,
  url,
  noCars,
}: {
  garage: Garage;
  cars: TCar[];
  user: TUser;
  url: string;
  noCars: boolean;
}) {
  const { text } = useLang({ file: "pages", selector: "home" });
  const getShortVersion = (text: string | undefined | null) => {
    if (!text) return undefined;
    if (text.length > 100) return text.slice(0, 100) + "...";
    return text;
  };
  return (
    <LangContext.Provider value={text}>
      <div>
        <Head>
          <title>{garage.name}</title>
          <meta
            name="description"
            content={garage.description || "Join Carnet"}
          />
          <meta property="og:title" content={garage.name} />
          <meta
            property="og:description"
            content={garage.description || "Join Carnet"}
          />
          <meta property="og:image" content={garage.logo} />
          <meta property="og:url" content={url} />
          <meta property="og:type" content="website" />

          <meta name="twitter:title" content={garage.name} />
          <meta
            name="twitter:description"
            content={getShortVersion(garage.description) || "Join us in Carnet"}
          />
          <meta name="twitter:image" content={garage.logo} />
          <meta name="twitter:card" content="summary_large_image" />

          <link rel="icon" href={garage.logo} className="rounded-full" />

          <meta name="theme-color" content="#ffffff" />

          <link rel="apple-touch-icon" href={garage.logo} />

          <meta name="apple-mobile-web-app-title" content={garage.name} />

          {/* for seo */}
          <meta name="robots" content="index, follow" />
          <meta name="author" content={garage.name} />
          <meta name="keywords" content={garage.name} />
          <meta name="distribution" content="web" />
          <meta name="revisit-after" content="7 days" />
          <meta name="language" content="EN" />
          <meta name="generator" content="Carnet" />
          <meta name="rating" content="general" />
          <meta name="url" content={url} />
          <meta name="identifier-URL" content={url} />
          <meta name="coverage" content="Worldwide" />
          <meta name="distribution" content="Global" />
          <meta name="rating" content="General" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-title" content={garage.name} />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="mobile-web-app-capable" content="yes" />
        </Head>

        <MyNav />
        <div className="relative h-[350px] w-full">
          <Image
            fill
            src={garage.cover}
            alt={`Cover - ${garage.name}`}
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>

        <div className="mx-auto flex max-w-[1100px] flex-col gap-10">
          <div className="w-full -translate-y-[60px] space-y-6">
            <div className="bg-green-300 relative h-[120px] w-[120px] overflow-hidden rounded-full ring-4 ring-white ring-offset-0">
              <Image
                fill
                src={garage.logo}
                alt={`Logo - ${garage.name}`}
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </div>

            <h1 className="text-2xl text-black">{garage.name}</h1>

            <p className="whitespace-pre-line">{garage.description}</p>
          </div>
          <div className="w-full">
            <div className="mockup-window mb-20 flex-grow border bg-base-200">
              {/* <div className="flex flex-row items-center justify-end gap-3">
              <button className="btn-sm btn">contacter</button>
            </div>
            <Divider /> */}
              {noCars ? (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-background">
                  <div className="w-1/3">
                    <Lottie animationData={NoCardAnimation} />
                  </div>
                  <span className="-translate-y-[40px]">
                    {text("text.empty cars")}
                  </span>
                </div>
              ) : (
                <div className="grid h-full w-full grid-cols-3 gap-8 bg-background  px-8 py-5">
                  {[...cars].map((a, i) => (
                    <CarCardReadOnly key={i} auction={a} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </LangContext.Provider>
  );
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export async function getStaticProps({
  params,
  locale,
}: {
  params: { id: string };
  locale: string;
}) {
  const user = await prisma.user
    .findUnique({
      where: {
        id: params.id,
      },
      include: {
        garage: true,
        image: true,
        Car: {
          where: {
            isClosed: false,

            state: "published",
          },
          include: {
            images: true,
          },
        },
      },
    })
    .then((res) => JSON.parse(JSON.stringify(res)));

  const garage = user.garage;
  const cars = user.Car;
  const url = getBaseUrl() + `/garages/${user.id}`;
  const noCars = cars.length === 0;

  return {
    props: {
      garage,
      cars,
      user,
      url,
      noCars,
      ...(await serverSideTranslations(locale || "fr", ["common", "pages"])),
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 10, // In seconds
  };
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// the path has not been generated.
export async function getStaticPaths() {
  const res: Garage[] = await prisma.garage
    .findMany({
      select: {
        user_id: true,
      },
    })
    .then((res) => JSON.parse(JSON.stringify(res)));
  // Get the paths we want to pre-render based on posts
  const paths = res.map((post) => ({
    params: { id: post.user_id },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: 'blocking' } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: "blocking" };
}

export default Garage;

const MyNav = () => {
  const text = useContext(LangContext);

  return (
    <div className="w-full bg-primary">
      <div className="container mx-auto flex h-[80px] w-full shadow-sm">
        <div className="layout mx-auto  flex flex-row items-center gap-6">
          <Link href={"/"} className="cursor-pointer">
            <Image src={Logo2} height={50} alt="logo" />
          </Link>
          <div className="flex-grow" />
          <Link scroll={true} href={"/"} className="font-semibold  text-white">
            {text("navbar.menu.home")}
          </Link>
          <Link
            scroll={true}
            href={"/#how"}
            className="font-semibold text-white"
          >
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
          {/* <LangSwitcher border /> */}
        </div>
      </div>
    </div>
  );
};
