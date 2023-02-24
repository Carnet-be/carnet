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
import { ReactNode } from "react";
import { EditIcon } from "@ui/icons";
import { FaCarAlt } from "react-icons/fa";
import { GiTakeMyMoney } from "react-icons/gi";
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);

  if (!session) {
    return {
      props: {},
    };
  }
  let user: User | undefined;
  try {
    user = await prisma.user
      .findUnique({
        where: {
          email: session?.user?.email || "",
        },
      })
      .then((res) => JSON.parse(JSON.stringify(res)));
  } catch (error) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }
  if (!user) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }
  if (!user.emailVerified) {
    return {
      redirect: {
        destination: "/pages/email-verification",
        permanent: true,
      },
    };
  }
  let route;
  switch (user.type) {
    case "AUC":
      route = "/dashboard/auctionnaire";
      break;
    case "BID":
      route = "/dashboard/bidder";
      break;
    default:
      route = "/admin/dashboard";
      break;
  }
  return {
    redirect: {
      destination: route,
      permanent: true,
    },
  };
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
        <link rel="shortcut icon" href="/assets/logo.png" type="image/png" />
      </Head>
      <CreateAuction />
      <div className="relative bg-primary">
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
                  Recevez une offre gratuite et sans engagement pour votre
                  voiture !
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
        <CommentCaMarche />
        <About />
        {/* <Blogs /> */}
        <Contact />
        <Footer />
      </div>
    </>
  );
};

const DashBoardButton = () => {
  //  const {data:user} =  useAuthUser(["user"], auth);

  return (
    <label
      htmlFor="create_auction"
      className="cursor-pointer rounded-lg bg-white py-3 text-center font-bold text-black"
    >
      Annoncez votre voiture !!
    </label>
  );
};
const Nav = ({ user }: { user: User }) => {
  return (
    <div className="fixed top-0 left-0 z-[1000] flex h-[80px] w-screen bg-primary px-6 shadow-sm">
      <div className="layout mx-auto  flex flex-row items-center gap-6">
        <Image src={Logo2} height={50} alt="logo" />

        <div className="flex-grow" />
        <Link scroll={true} href={"#"} className="font-semibold  text-white">
          Accueil
        </Link>
        <Link scroll={true} href={"#how"} className="font-semibold text-white">
          How it works ?
        </Link>
        <Link
          scroll={true}
          href={"#about"}
          className="font-semibold text-white"
        >
          About
        </Link>
        <Link
          scroll={true}
          href={"#blogs"}
          className="font-semibold text-white"
        >
          Blogs
        </Link>
        <Link
          scroll={true}
          href={"#contact"}
          className="font-semibold text-white"
        >
          Contact
        </Link>

        <ProfileButton user={user} />
      </div>
    </div>
  );
};

const ProfileButton = ({ user }: { user: User }) => {
  const router = useRouter();

  return (
    <Link
      href={"/auth/login"}
      className={cx(
        "rounded-lg bg-white px-6 py-2 text-sm font-semibold no-underline"
      )}
    >
      Se connecter
    </Link>
  );
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

const CommentCaMarche = () => {
  const Item = ({
    icon,
    title,
    description,
  }: {
    icon: ReactNode;
    title: string;
    description: string;
  }) => {
    return (
      <div className="flex w-[240px] flex-col items-center gap-3">
        <div className="flex h-[80px] w-[80px] flex-row items-center justify-center rounded-xl rounded-bl-none bg-primary p-3">
          {icon}
        </div>
        <h6 className="text-primary">{title}</h6>
        <p className="text-center text-[12px] opacity-70">{description}</p>
      </div>
    );
  };
  const items = [
    {
      icon: <EditIcon className="text-[40px] text-white" />,
      title: "Annoncez votre voiture",
      description:
        "Saisissez tous les détails de votre voiture tels que l'année de construction, le kilométrage, etc.",
    },
    {
      icon: <FaCarAlt className="text-[40px] text-white" />,
      title: "Recevez notre offre de prix",
      description:
        "Nos experts se mettront au travail et vous contacteront dès que possible avec une offre de prix..",
    },
    {
      icon: <GiTakeMyMoney className="text-[40px] text-white" />,
      title: "Paiement et recouvrement",
      description:
        "Si vous acceptez une offre concrète que nous vous ferons sans aucune obligation.",
    },
  ];
  return (
    <section
      id="how"
      className="flex flex-col items-center gap-10 rounded-t-[100px] bg-white py-[70px]"
    >
      <h2 className="text-primary">COMMENT ÇA FONCTIONNE?</h2>
      <p>
        It is a long established fact that a reader will be distracted by the
        readable content of a page when looking at its layout.
      </p>
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
            <Item
              key={index}
              icon={item.icon}
              title={item.title}
              description={item.description}
            />
          </>
        ))}
      </div>
    </section>
  );
};

const About = () => {
  return (
    <section
      id="about"
      className="flex flex-col items-center gap-10 bg-white py-10"
    >
      <h2 className="text-primary">A propos Carnet</h2>
      <div className="flex flex-row items-center gap-[60px] py-10">
        <div className="w-[500px]">
          <p>
            {
              "CarNet est né et nous nous sommes mis au travail. Nous avons vite compris que ce serait un exploit de transformer notre rêve en réalité... Cartographier tous les garages s'est avéré être une idée ambitieuse, en filtrant chaque garage encore plus ambitieux. Néanmoins, nous avons continué à travailler avec le résultat, aujourd'hui, d'une plateforme d'enchères en ligne très performante."
            }
          </p>
          <p>
            {
              "Nous sommes fiers d'annoncer que chaque jour, de nombreuses personnes choisissent de vendre leur voiture par notre intermédiaire. Cette fois-ci, nous essayons de le faire avec passion, éthique et une volonté inlassable d'obtenir des résultats. Nous pensons que c'est la façon dont nous aidons et assistons les gens dans le processus de vente qui fait de nous les meilleurs sur le marché."
            }
          </p>
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
  const email = "info@carnet.io";
  const nums = ["+33 6 00 00 00 00", "+33 6 00 00 00 01"];
  return (
    <section
      id="contact"
      className="flex flex-row items-start justify-evenly gap-[40px] bg-white py-20"
    >
      <div className="space-y-10">
        <h2 className="text-primary">Let’s Talk</h2>
        <p>
          {"Des questions? s'il vous plaît n'hésitez pas à nous contacter"}{" "}
        </p>
        <div>
          <h6 className="text-primary">Email</h6>
          <h6>{email}</h6>
        </div>
        <div>
          <h6 className="text-primary">Numéro de téléphone</h6>
          {nums.map((num, index) => (
            <h6 key={index}>{num}</h6>
          ))}
        </div>
      </div>
      <div className="w-[400px] space-y-4">
        <div>
          <h6 className="text-primary">Nom</h6>
          <input
            type="text"
            className="mt-1 h-[40px] w-full rounded-sm bg-[#F7F7F7] px-2"
          />
        </div>
        <div>
          <h6 className="text-primary">Email</h6>
          <input
            type="text"
            className="mt-1 h-[40px] w-full rounded-sm bg-[#F7F7F7] px-2"
          />
        </div>
        <div>
          <h6 className="text-primary">Message</h6>
          <textarea
            rows={6}
            className=" mt-1 w-full rounded-sm bg-[#F7F7F7] px-2 py-2"
          />
        </div>
        <button className="btn-primary btn-wide btn w-full">envoyer</button>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="flex flex-col items-center gap-2 py-3">
      <Image src={"/assets/logo.png"} alt="logo" width={200} height={100} className={"my-6"}/>
      <div className="flex flex-row justify-center items-center gap-10 text-lg">
      <Link scroll={true} href={"#"} className="font-semibold  text-white">
          Accueil
        </Link>
        <Link scroll={true} href={"#how"} className="font-semibold text-white">
          How it works ?
        </Link>
        <Link
          scroll={true}
          href={"#about"}
          className="font-semibold text-white"
        >
          About
        </Link>
        <Link
          scroll={true}
          href={"#blogs"}
          className="font-semibold text-white"
        >
          Blogs
        </Link>
        <Link
          scroll={true}
          href={"#contact"}
          className="font-semibold text-white"
        >
          Contact
        </Link>

        <Link
          scroll={true}
          href={"#terms_conditions"}
          className="font-semibold text-white"
        >
         Termes et conditions
        </Link>
        <Link
          scroll={true}
          href={"#privacy_policy"}
          className="font-semibold text-white"
        >
          Politique de confidentialité
        </Link>
      </div>
      <div className="max-w-[1300px] border-t-[2px] border-white w-full flex flex-row items-center justify-between py-6">
        <span> </span>
        <span className="text-white opacity-70 text-sm">Copyright © 2023 Upload by Carnet</span>
      </div>
    </footer>
  );
};
