/* eslint-disable @next/next/no-img-element */
import Dashboard from "@ui/dashboard";
import { InDevelopmentMini } from "@ui/inDevelopment";
import {
  type InferGetServerSidePropsType,
  type GetServerSideProps,
  type NextPage,
} from "next";

import Slider from "react-slick";
import { getServerAuthSession } from "@server/common/get-server-auth-session";
import BigTitle from "@ui/components/bigTitle";
import { useRouter } from "next/router";
import { trpc } from "../../../../utils/trpc";
import { toast } from "react-hot-toast";
import { PropagateLoader } from "react-spinners";
import Loading from "@ui/components/loading";
import type { TAuction } from "@model/type";
import { ProcessAuction } from "@utils/processAuction";
import { BRAND, CARROSSERIE, TRANSMISSION } from "@data/internal";
import Image from "next/image";
import cx from "classnames";
import CountDown from "@ui/components/countDown";
import { ProcessDate } from "@utils/processDate";
import BidSection from "@ui/bidSection";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { SampleNextArrow, SamplePrevArrow } from "@ui/createAuction/step3";
import { Chip } from "@mui/material";
import type { AuctionOptions } from '@prisma/client';
import { HANDLING } from '@data/internal';
import { EXTERIOR } from '@data/internal';
import { INTERIOR } from '@data/internal';
import { TIRES } from '@data/internal';
import { StarIcon } from "@ui/icons";
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }
  const id = ctx.query.id as string | undefined;

  if (!id) {
    return {
      redirect: {
        destination: "/dashboard/bidder/home",
        permanent: true,
      },
    };
  }

  return {
    props: { id },
  };
};
const Home = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const {
    data: auction,
    isLoading,
    refetch,
  } = trpc.auctionnaire.get.useQuery(props.id, {
    onError: (err) => {
      console.log(err);
      toast.error("Error lors de la recupération des données");
    },
  });
  const router = useRouter();
  return (
    <Dashboard type="BID" background="bg-[#FCFCFF]">
      {!auction ? (
        <Loading classContainer="h-[80vh]" />
      ) : (
        <>
          <BigTitle title={auction.name} />
          <div className="flex flex-wrap justify-center gap-6">
            <LeftSide auction={auction as TAuction} />
            <RightSide auction={auction as TAuction} />
          </div>
        </>
      )}
    </Dashboard>
  );
};

const LeftSide = ({ auction }: { auction: TAuction }) => {
  const img = [1, 2, 3, 4, 5].map((i) => `/assets/v${i}.png`);
  const [imgP, setImgP] = useState(0);
  const [imgSize, setimgSize] = useState(0);
  const imgRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (imgRef.current) {
      setimgSize(imgRef.current.clientWidth);
    }
  }, [imgRef]);
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 2,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };
  const rating=[{
    title:"Handling",
    list:HANDLING,
    rate:auction.rating.handling
  },{
    title:"Exterior",
    list:EXTERIOR,
    rate:auction.rating.exterior
  },
  {
    title:"Interior",
    list:INTERIOR,
    rate:auction.rating.interior
  },
  {
    title:"Tires",
    list:TIRES,
    rate:auction.rating.tires
  },]
  return (
    <div className="flex  w-full flex-grow flex-col gap-3 lg:w-[57%]">
      <div
        ref={imgRef}
        className="flex h-[500px] w-full flex-col items-center justify-center bg-white"
      >
        <Image src={img[imgP] || ""} alt="photo" width={imgSize} height={400} />
      </div>
      <div className="bg-white px-10 py-6">
        <Slider {...settings} className="mb-4">
          {img.map((m, i) => {
            const isActive = imgP == i;
            return (
              <div
                key={i}
                onClick={() => setImgP(i)}
                className={cx("flex flex-col items-center", {
                  //   "border border-primary": isActive,
                })}
              >
                <Image src={m} alt="photo" width={140} height={120} />
              </div>
            );
          })}
        </Slider>
      </div>
      <div className="my-3 flex flex-col gap-3">
        <h4 className="text-primary">Description</h4>
        <p>{auction.description}</p>
      </div>
      <div className="my-3 flex flex-col gap-3">
      
        <h4 className="text-primary">Options</h4>
        <div className="flex flex-wrap gap-3">
          {Object.keys(auction.options).filter((o)=>auction.options[o as keyof AuctionOptions]===true).map((k,i)=>{
            return <Chip key={i} label={k.replaceAll("_"," ")} />
          })}
        </div>
      </div>
      <div className="my-3 flex flex-col gap-3">
        <h4 className="text-primary">Rating</h4>
        {rating.filter((r)=>r.rate!==null).map((r,i)=>{
          return <div key={i} className="flex flex-row gap-2 items-center">
         <h6 className="min-w-[100px]">{r.title} :</h6>
         <div>
         <div className="flex flex-row">
         {[1,2,3,4,5].map((s,i)=>{
            return <StarIcon key={i} className={cx("text-xl m-1",i<=(r.rate||0)?"text-yellow-500":"opacity-50")}/>
          })}
         </div>
         <span className="text-black/70 italic text-sm">
          {r.list[r.rate||0]}
         </span>
         </div>
          </div>
        })}
      </div>
    </div>
  );
};

const RightSide = ({ auction }: { auction: TAuction }) => {
  const [isTimeOut, setisTimeOut] = useState(false)
  const brand = BRAND[auction.brand]?.title || "";
  const model = BRAND[auction.brand]?.model[auction.model];
  const carrosserie = CARROSSERIE[auction.specs.carrosserie || 0];
  const onTimeOut = () => {
    setisTimeOut(true)
    console.log("Time out, executing...");
  };
  
  return (
    <div className=" w-full lg:w-[40%] ">
      <div className="w-full space-y-4 rounded-xl bg-grey p-3">
        <div className="flex flex-row items-center justify-between gap-2">
          <MiniCard
            imgClass="scale-110"
            value={brand}
            img="/assets/Cars/Audi.svg"
          />
          <div className="flex flex-col items-center font-semibold text-primary">
            <h6 className="text-lg">{model}</h6>
            <span>{auction.build_year}</span>
          </div>
          <span className="font-semibold text-gray-500">#{auction.id}</span>
        </div>
        <div className="flex flex-wrap gap-4">
          <MiniCard
            containerClass="w-[48%] lg:w-[30%]"
            size={94}
            title="Carrosserie"
            img={"/assets/step2/" + carrosserie?.img + ".svg"}
            value={carrosserie?.title || ""}
          />
          <MiniCard
            containerClass="w-[48%] lg:w-[30%]"
            size={94}
            title="Fuel"
            img={"/assets/fuel.png"}
            value={auction.fuel}
          />
          <MiniCard
            containerClass="w-[48%] lg:w-[30%]"
            size={94}
            title="Color"
            img={"/assets/color.png"}
            value={auction.color || "#fffff"}
            isColor
          />
          <MiniCard
            containerClass="w-[48%] lg:w-[30%]"
            size={94}
            title="Transmission"
            img={"/assets/transmission.png"}
            value={TRANSMISSION[auction.specs.transmission || 0] || ""}
          />
          <MiniCard
            containerClass="w-[48%] lg:w-[30%]"
            size={94}
            title="Horse Power"
            img={"/assets/horse.png"}
            value={auction.specs.cc + " cc"}
          />
          <MiniCard
            containerClass="w-[48%] lg:w-[30%]"
            size={94}
            title="Mileage"
            img={"/assets/mileage.png"}
            value={auction.specs.kilometrage + " km/h"}
          />
        </div>
      </div>
      <CountDown
        variant="primary"
        onTimeOut={onTimeOut}
        
        endDate={auction.end_date}
      />
      <BidSection auction={auction} isTimeOut={isTimeOut}/>
    </div>
  );
};

const MiniCard = (props: {
  value: string;
  img: string;
  title?: string;
  imgClass?: string;
  size?: number;
  containerClass?: string;
  isColor?: boolean;
}) => {
  const { value, img, title, imgClass, size, containerClass, isColor } = props;

  return (
    <div
      className={cx(
        "flex flex-col items-center justify-between rounded-xl bg-base-100 py-2 px-4  text-primary",
        containerClass,
        { [`h-[${size}px]`]: size }
      )}
    >
      <span className="font-semibold ">{title ? title : ""}</span>
      <div className={cx("relative h-[20px] w-full", imgClass)}>
        <Image alt="logo" src={img} fill className="object-contain" />
      </div>
      {isColor ? (
        <div
          style={{ backgroundColor: value }}
          className={cx("h-4 w-8 rounded-full")}
        ></div>
      ) : (
        <span className="text-[12px]">{value}</span>
      )}
    </div>
  );
};
export default Home;
