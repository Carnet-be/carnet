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
import { signOut } from "next-auth/react";
import { ProfileCardButton } from "@ui/profileCard";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);
  const user = await prisma.user
    .findUnique({
      where: {
        email: session?.user?.email || "",
      },
    })
    .then((res) => JSON.parse(JSON.stringify(res)));

  return { props: { user } };
};

const Home: NextPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const user: User = props.user;
  //signOut()
  return (
    <>
      <Head>
        <title>CARNET</title>
        <link
          rel="shortcut icon"
          href="../public/assets/favicon.ico"
          type="image/x-icon"
        />
      </Head>
      <CreateAuction/>
      <div className="relative h-screen w-screen overflow-hidden bg-primary">
        <div className="absolute top-0 left-0 z-30 flex h-full w-full flex-col">
          <Nav user={user} />
          <div className="layout mx-auto flex flex-grow  flex-row">
            <div className="flex h-auto w-full max-w-[500px] flex-col justify-center gap-10">
              <h1 className="text-6xl font-semibold  text-white">
                Vendez votre voiture avec{" "}
                <span className="inline-block translate-y-3">
                  <Image src={Logo} height={60} alt="logo" />
                </span>{" "}
              </h1>
              <p className="text-lg text-white/70">
                Recevez une offre gratuite et sans engagement pour votre voiture
                !
              </p>
              <br />
              <DashBoardButton />
            </div>
            <div className="flex-grow" />
            <div className="grid  w-1/2 content-center">
              <Image src={Mackup} alt="Mockup Mobile" className="scale-125" />
            </div>
          </div>
        </div>

        <Overlay />
      </div>
    </>
  );
};

const DashBoardButton = () => {
  //  const {data:user} =  useAuthUser(["user"], auth);

  return (
    <label
      htmlFor="create_auction"
      className="rounded-lg bg-white py-3 text-center font-bold text-black cursor-pointer"
    >
      Annoncez votre voiture !!
    </label>
  );
};
const Nav = ({ user }: { user: User }) => {
  return (
    <div className="layout mx-auto flex h-[80px] w-full flex-row items-center gap-6">
      <Image src={Logo2} height={50} alt="logo" />

      <div className="flex-grow" />
      <button className="font-semibold  text-white">Accueil</button>
      <button className="font-semibold text-white">About</button>
    
      <ProfileButton user={user} />
    </div>
  );
};

const ProfileButton = ({ user }: { user: User }) => {
  const router = useRouter();

  if (!user) {
    return (
      <Link
        href={"/auth/login"}
        className={cx("rounded-lg bg-white px-6 py-2 text-sm font-semibold no-underline")}
      >
        Se connecter
      </Link>
    );
  }

  return    <ProfileCardButton/>
};
const Overlay = () => {
  return (
    <div className="absolute top-0 right-0 z-10 flex h-[140vh] w-[150vh] translate-x-[30vw] -translate-y-[100px] -rotate-[10deg] items-center justify-center rounded-[100px] bg-[#196EBD]/50 shadow-lg">
      <div className="flex h-[70%] w-[70%] translate-x-[50px] -translate-y-[100px] items-center justify-center rounded-[80px] bg-[#196EBD] shadow-lg">
        <div className="h-[60%] w-[60%] translate-x-[20px] -translate-y-[20px] rounded-[70px] bg-[#181BAA] shadow-lg"></div>
      </div>
    </div>
  );
};
export default Home;
