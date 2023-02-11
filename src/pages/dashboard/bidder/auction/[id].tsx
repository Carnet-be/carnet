/* eslint-disable @next/next/no-img-element */
import Dashboard from "@ui/dashboard";
import {
  type InferGetServerSidePropsType,
  type GetServerSideProps,
} from "next";

import Map from "@ui/components/map";
import Slider from "react-slick";
import { getServerAuthSession } from "@server/common/get-server-auth-session";
import BigTitle from "@ui/components/bigTitle";
import { useRouter } from "next/router";
import { trpc } from "../../../../utils/trpc";
import { toast } from "react-hot-toast";
import Loading from "@ui/components/loading";
import type { TAuction } from "@model/type";
import { BRAND, CARROSSERIE, COLORS, TRANSMISSION } from "@data/internal";
import Image from "next/image";
import cx from "classnames";
import CountDown from "@ui/components/countDown";
import BidSection from "@ui/bidSection";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { SampleNextArrow, SamplePrevArrow } from "@ui/createAuction/step3";
import { Chip } from "@mui/material";
import type { Auction, AuctionOptions } from "@prisma/client";
import { HANDLING } from "@data/internal";
import { EXTERIOR } from "@data/internal";
import { INTERIOR } from "@data/internal";
import { TIRES } from "@data/internal";
import { StarIcon } from "@ui/icons";
import cloudy from "@utils/cloudinary";
import { NO_IMAGE_URL } from "@ui/components/auctionCard";
import { fill } from "@cloudinary/url-gen/actions/resize";
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
  const { data: auction } = trpc.auctionnaire.get.useQuery(props.id, {
    onError: (err) => {
      console.log(err);
      toast.error("Error lors de la recupération des données");
    },
  });
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
  const noImg = auction.images.length <= 0;
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
  const rating = [
    {
      title: "Handling",
      list: HANDLING,
      rate: auction.rating.handling,
    },
    {
      title: "Exterior",
      list: EXTERIOR,
      rate: auction.rating.exterior,
    },
    {
      title: "Interior",
      list: INTERIOR,
      rate: auction.rating.interior,
    },
    {
      title: "Tires",
      list: TIRES,
      rate: auction.rating.tires,
    },
  ];
  return (
    <div className="flex  w-full flex-grow flex-col gap-3 lg:w-[57%]">
      <div
        ref={imgRef}
        className="flex h-[500px] w-full flex-col items-center justify-center overflow-hidden bg-white"
      >
        <Image
          src={cloudy
            .image(noImg ? NO_IMAGE_URL : auction.images[imgP]?.fileKey)
            .resize(fill(undefined, 400))
            .toURL()}
          alt="photo"
          width={imgSize}
          height={400}
        />
      </div>
      <div className={cx("bg-white px-10 py-6", { hidden: noImg })}>
        <Slider {...settings} className="mb-4">
          {auction.images
            .map((im) => im.fileKey)
            .map((m, i) => {
              const isActive = imgP == i;
              return (
                <div
                  key={i}
                  onClick={() => setImgP(i)}
                  className={cx("flex flex-col items-center rounded-lg p-3", {
                    border: isActive,
                  })}
                >
                  <Image
                    src={cloudy.image(m).resize(fill(undefined, 120)).toURL()}
                    alt="photo"
                    width={140}
                    height={120}
                  />
                </div>
              );
            })}
        </Slider>
      </div>
      <div className="my-3 flex flex-col gap-3 bg-white p-2">
        <h4 className="text-primary">Description</h4>
        <p>{auction.description}</p>
      </div>
      <div className="my-3 flex flex-col gap-3 bg-white p-2">
        <h4 className="text-primary">Options</h4>
        <div className="flex flex-wrap gap-3">
          {Object.keys(auction.options)
            .filter((o) => auction.options[o as keyof AuctionOptions] === true)
            .map((k, i) => {
              return <Chip key={i} label={k.replaceAll("_", " ")} />;
            })}
        </div>
      </div>
      <div className="my-3 flex flex-col gap-3 bg-white p-2">
        <h4 className="text-primary">Rating</h4>
        {rating
          .filter((r) => r.rate !== null)
          .map((r, i) => {
            return (
              <div key={i} className="flex flex-row items-center gap-2">
                <h6 className="min-w-[100px]">{r.title} :</h6>
                <div>
                  <div className="flex flex-row">
                    {[1, 2, 3, 4, 5].map((s, i) => {
                      return (
                        <StarIcon
                          key={i}
                          className={cx(
                            "m-1 text-xl",
                            i <= (r.rate || 0)
                              ? "text-yellow-500"
                              : "opacity-50"
                          )}
                        />
                      );
                    })}
                  </div>
                  <span className="text-sm italic text-black/70">
                    {r.list[r.rate || 0]}
                  </span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

const RightSide = ({ auction }: { auction: TAuction }) => {
  const [isTimeOut, setisTimeOut] = useState(false);
  const model = BRAND[auction.brand]?.model[auction.model];
  const carrosserie = CARROSSERIE[auction.specs.carrosserie || 0];
  const onTimeOut = () => {
    setisTimeOut(true);
    console.log("Time out, executing...");
  };

  return (
    <div className=" w-full lg:w-[40%] ">
      <div className="w-full space-y-4 rounded-xl bg-grey p-3">
        <div className="flex flex-row items-center justify-between gap-2">
          <MiniCard
            containerClass="w-[70px]"
            value={""}
            size={94}
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
            size={110}
            title="Fuel"
            img={"/assets/fuel.png"}
            value={auction.fuel}
          />
          <MiniCard
            containerClass="w-[48%] lg:w-[30%]"
            size={110}
            title={"Color"}
            value={auction.color || "#fffff"}
            isColor
          />
          <MiniCard
            containerClass="w-[48%] lg:w-[30%]"
            size={110}
            title="Transmission"
            img={"/assets/transmission.png"}
            value={TRANSMISSION[auction.specs.transmission || 0] || ""}
          />
          <MiniCard
            containerClass="w-[48%] lg:w-[30%]"
            size={110}
            title="Horse Power"
            img={"/assets/horse.png"}
            value={auction.specs.cv ? auction.specs.cv?.toString() : "-"}
          />
          <MiniCard
            containerClass="w-[48%] lg:w-[30%]"
            size={110}
            title="Mileage"
            img={"/assets/mileage.png"}
            value={auction.specs.kilometrage || "-" + " km/h"}
          />
          <MiniCard
            containerClass="w-[48%] lg:w-[30%] text-primary"
            size={110}
            title="Emission co2"
            img={"/assets/CO2.svg"}
            value={auction.specs.co2 || "-"}
          />
          <MiniCard
            containerClass="w-[48%] lg:w-[30%]"
            size={110}
            title="Doors"
            img={"/assets/Doors.svg"}
            value={auction.specs.doors?.toString() || "-"}
          />
          <MiniCard
            containerClass="w-[48%] lg:w-[30%]"
            size={110}
            title="Engine Size "
            img={"/assets/engine.svg"}
            value={auction.specs.cc || "-"}
          />
        </div>
      </div>
      <CountDown
        variant="primary"
        onTimeOut={onTimeOut}
        endDate={auction.end_date!}
      />
      <BidSection auction={auction} isTimeOut={isTimeOut} />
      <Map
        options={{ zoomControl: false }}
        latitude={auction.address.lat}
        longitude={auction.address.lon}
        onClick={() => {
          // console.log(el);
          // if(el.latLng){
          // setData({
          //   ...data,
          //   lat: el.latLng.lat(),
          //   lon: el.latLng.lng(),
          // });
          //}
        }}
        containerClass={"w-full h-[400px] bg-red-100 mt-10"}
      />
    </div>
  );
};

const MiniCard = (props: {
  value?: string;
  img?: string;
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
        "flex flex-col items-center justify-between gap-1 rounded-xl bg-base-100 py-2  px-4 text-primary",
        containerClass,
        { [`h-[${size}px]`]: size }
      )}
    >
      <span className="text-[10px] text-gray-500">{title ? title : ""}</span>
      {img && (
        <div className={cx("relative h-[30px] w-full", imgClass)}>
          <Image alt="logo" src={img} fill className="object-contain" />
        </div>
      )}
      {isColor ? (
        <>
          <div
            style={{ backgroundColor: value }}
            className={cx("h-8 w-8 rounded-full border")}
          ></div>
          <span className="text-[12px]">
            {COLORS.filter((c) => c.value === value)[0]?.name ||
              ""}
          </span>
        </>
      ) : (
        <span className="text-[12px]">{value}</span>
      )}
    </div>
  );
};
export default Home;
