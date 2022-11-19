import Image from "next/image";
import Logo2 from "@assets/logo2.png";
import Logo from "@assets/logo.png";
import Mackup from "@assets/mockup_mobile.png";
import cx from 'classnames'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { getServerAuthSession } from "../server/common/get-server-auth-session";
import { type InferGetServerSidePropsType, type NextPage, type GetServerSideProps } from "next/types";
import { prisma } from '../server/db/client';
import { User } from "@prisma/client";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context)
  const user = await prisma.user
  .findUnique({
    where: {
      email: session?.user?.email || "",
    },
  })
  .then((res) => JSON.parse(JSON.stringify(res)));

  return {props:{user}}
}

const Home:NextPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
const user:User=props.user
  return (
    <>
    <Head>
    <title>CARNET</title>
    <link rel="shortcut icon" href="../public/assets/favicon.ico" type="image/x-icon" />
    </Head>
    <div className="h-screen w-screen bg-primary overflow-hidden relative">
      <div className="h-full w-full absolute top-0 left-0 z-30 flex flex-col">
        <Nav user={user}/>
        <div className="flex-grow flex flex-row layout  mx-auto">
          <div className="h-auto flex flex-col justify-center gap-10 max-w-[500px] w-full">
            <h1 className="text-white text-6xl  font-semibold">
              Vendez votre voiture avec{" "}
              <span className="inline-block translate-y-3">
                <Image src={Logo} height={60} alt="logo" />
              </span>{" "}
            </h1>
            <p className="text-white/70 text-lg">
              Recevez une offre gratuite et sans engagement pour votre voiture !
            </p>
            <br />
           <DashBoardButton/>
          </div>
          <div className="flex-grow" />
          <div className="w-1/2  grid content-center">
            <Image src={Mackup} alt="Mockup Mobile" className="scale-125" />
          </div>
        </div>
      </div>

      <Overlay />
    </div>
    </>
  );
};


const DashBoardButton=()=>{
//  const {data:user} =  useAuthUser(["user"], auth);
 
  return  <Link href={"/dashboard"} className="rounded-lg py-3 bg-white text-black font-bold text-center">
  Annoncez votre voiture !!
</Link>
}
const Nav = ({user}:{user:User}) => {

  return (
    <div className="h-[80px] flex flex-row w-full items-center mx-auto gap-6 layout">
      <Image src={Logo2} height={50} alt="logo" />

      <div className="flex-grow" />
      <button className="text-white  font-semibold">Accueil</button>
      <button className="text-white font-semibold">About</button>

      <ProfileButton user={user}/>
    </div>
  );
};

const ProfileButton = ({user}:{user:User}) => {

 
  const router=useRouter()
 
  if(!user){
    return (
      <Link href={'/auth/login'} className={cx("bg-white px-6 py-2 rounded-lg font-semibold text-sm")}>
        Se connecter
      </Link>
    );
  }
  console.log(user)
  return <button onClick={()=>router.push("/dashboard")} className="btn btn-warning">{user.prenom}</button>
};
const Overlay = () => {
  return (
    <div className="h-[140vh] z-10 shadow-lg w-[150vh] absolute top-0 right-0 rounded-[100px] -rotate-[10deg] bg-[#196EBD]/50 flex justify-center items-center translate-x-[30vw] -translate-y-[100px]">
      <div className="w-[70%] shadow-lg bg-[#196EBD] h-[70%] rounded-[80px] flex justify-center items-center translate-x-[50px] -translate-y-[100px]">
        <div className="w-[60%] shadow-lg bg-[#181BAA] h-[60%] rounded-[70px] translate-x-[20px] -translate-y-[20px]"></div>
      </div>
    </div>
  );
};
export default Home;
