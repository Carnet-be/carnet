/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import Dashboard from "@ui/dashboard";
import {
  type InferGetServerSidePropsType,
  type GetServerSideProps,
} from "next";
import ReactImageMagnify from "react-image-magnify";
import Map from "@ui/components/map";
import Slider from "react-slick";
import { getServerAuthSession } from "@server/common/get-server-auth-session";
import BigTitle from "@ui/components/bigTitle";
import { useRouter } from "next/router";
import { trpc } from "../../../../utils/trpc";
import { toast } from "react-hot-toast";
import Loading from "@ui/components/loading";
import type { TAuction, TCar } from "@model/type";
import { BRAND, CARROSSERIE, COLORS, TRANSMISSION } from "@data/internal";
import Image from "next/image";
import cx from "classnames";
import CountDown from "@ui/components/countDown";
import BidSection from "@ui/bidSection";
import { useContext, useEffect, useState } from "react";
import { useRef } from "react";
import { SampleNextArrow, SamplePrevArrow } from "@ui/createAuction/step3";
import { Chip } from "@mui/material";
import type { Auction, AuctionOptions, AuctionState } from "@prisma/client";
import { HANDLING } from "@data/internal";
import { EXTERIOR } from "@data/internal";
import { INTERIOR } from "@data/internal";
import { TIRES } from "@data/internal";
import { StarIcon } from "@ui/icons";
import cloudy from "@utils/cloudinary";
import { NO_IMAGE_URL } from "@ui/components/auctionCard";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  LangCommonContext,
  LangContext,
  useConfirmation,
  useLang,
  useNotif,
} from "../../../hooks";
import { UserContext } from "../../entreprise/auction/[id]";
import { prisma } from "../../../../server/db/client";
import { FaMoneyBill } from "react-icons/fa";
import ImageZoom from "@ui/components/imageZoom";
import Price from "@ui/components/price";
import { Tag } from "antd";
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
        destination: "/dashboard/user/home",
        permanent: true,
      },
    };
  }

  const auction = await prisma?.auction.findUnique({
    where: { id },
  });

  if (auction?.state !== "published") {
    return {
      redirect: {
        destination: "/dashboard/user/home",
        permanent: true,
      },
    };
  }
  if (auction.isClosed || auction.end_date! < new Date()) {
    return {
      redirect: {
        destination: "/dashboard/user/home",
        permanent: true,
      },
    };
  }

  const user = await prisma.user
    .findUnique({
      where: {
        email: session?.user?.email || "",
      },
    })
    .then((res) => JSON.parse(JSON.stringify(res)));

  return {
    props: {
      user,
      id,
      ...(await serverSideTranslations(ctx.locale || "fr", [
        "common",
        "dashboard",
      ])),
    },
  };
};
const Home = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { text } = useLang({ file: "dashboard", selector: "auction" });
  const { text: common } = useLang(undefined);
  const { data: auction } = trpc.auctionnaire.get.useQuery(props.id, {
    onError: (err) => {
      console.log(err);
      toast.error("");
    },
  });

  return (
    <Dashboard type="BID" background="bg-[#FCFCFF]">
      {!auction ? (
        <Loading classContainer="h-[80vh]" />
      ) : (
        <UserContext.Provider value={props.user}>
          <LangCommonContext.Provider value={common}>
            <LangContext.Provider value={text}>
              <BigTitle title={auction.name} />
              <div className="flex flex-wrap justify-center gap-6">
                <LeftSide auction={auction as TAuction} />
                <RightSide auction={auction as TAuction} />
              </div>
            </LangContext.Provider>
          </LangCommonContext.Provider>
        </UserContext.Provider>
      )}
    </Dashboard>
  );
};

export const LeftSide = ({ auction }: { auction: TAuction | TCar }) => {
  const text = useContext(LangContext);
  const common = useContext(LangCommonContext);

  const rate = (s: string) => text(`rating text.${s}`);
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
      title: text("fields.handling"),
      list: HANDLING,
      rate: auction.rating.handling,
    },
    {
      title: text("fields.exterior"),
      list: EXTERIOR,
      rate: auction.rating.exterior,
    },
    {
      title: text("fields.interior"),
      list: INTERIOR,
      rate: auction.rating.interior,
    },
    {
      title: text("fields.tires"),
      list: TIRES,
      rate: auction.rating.tires,
    },
  ];

  const [parentSize, setParentSize] = useState(0);

  useEffect(() => {
    if (imgRef.current) {
      setParentSize(imgRef.current.clientWidth);
    }
  }, [imgRef]);

  return (
    <div className="flex  w-full flex-grow flex-col gap-3 lg:w-[57%]">
      <div
        ref={imgRef}
        className="ro flex h-[385px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-white"
      >
        <Image
          src={cloudy
            .image(noImg ? NO_IMAGE_URL : auction.images[imgP]?.fileKey)
            .resize(fill(parentSize, 400))
            .toURL()}
          alt="photo"
          width={imgSize}
          height={385}
        />
      </div>
      <div className={cx("border bg-white  p-2", { hidden: noImg })}>
        <Slider {...settings} className="">
          {auction.images
            .map((im) => im.fileKey)
            .map((m, i) => {
              const isActive = imgP == i;
              return (
                <div
                  key={i}
                  onClick={() => setImgP(i)}
                  className={cx(
                    "relative flex h-[100px] w-[140px] cursor-pointer flex-col items-center rounded-lg p-1",
                    {
                      border: isActive,
                    }
                  )}
                >
                  <img
                    src={cloudy.image(m).resize(fill(undefined, 120)).toURL()}
                    alt="photo"
                    className="h-full w-full rounded-lg object-cover"
                  />
                </div>
              );
            })}
        </Slider>
      </div>
      <div className="my-3 flex flex-col gap-3 border bg-white p-6">
        <h4 className="text-primary">{text("text.description")}</h4>
        <p className="whitespace-pre-line">{auction.description}</p>
      </div>
      <div className="my-3 flex flex-col gap-3 border bg-white p-6">
        <h4 className="text-primary">{text("steps.options")}</h4>
        <div className="flex flex-wrap gap-3">
          {Object.keys(auction.options)
            .filter((o) => auction.options[o as keyof AuctionOptions] === true)
            .map((k, i) => {
              return <Chip key={i} label={text("options." + k)} />;
            })}
        </div>
      </div>
      <div className="my-3 flex flex-col gap-3 border bg-white p-6">
        <h4 className="text-primary">{text("steps.rating")}</h4>
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
                            s <= (r.rate || 0)
                              ? "text-yellow-500"
                              : "opacity-50"
                          )}
                        />
                      );
                    })}
                  </div>
                  <span className="text-sm italic text-black/70">
                    {rate(`handling.${r.rate}`)}
                  </span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export const RightSide = ({
  auction,
  isBuyNow,
}: {
  auction: any;
  isBuyNow?: boolean;
}) => {
  const text = useContext(LangContext);
  const [isTimeOut, setisTimeOut] = useState(false);
  const model = auction.model;
  const carrosserie = CARROSSERIE[auction.specs.carrosserie || 0];
  const onTimeOut = () => {
    setisTimeOut(true);
    console.log("Time out, executing...");
  };
  const user = useContext(UserContext);
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
            title={text("fields.carossery")}
            img={"/assets/step2/" + carrosserie?.img + ".svg"}
            value={carrosserie?.title || ""}
          />
          <MiniCard
            containerClass="w-[48%] lg:w-[30%]"
            size={110}
            title={text("fields.fuel")}
            img={"/assets/fuel.png"}
            value={auction.fuel}
          />
          <MiniCard
            containerClass="w-[48%] lg:w-[30%]"
            size={110}
            title={text("fields.color")}
            value={auction.color || "#fffff"}
            isColor
          />
          <MiniCard
            containerClass="w-[48%] lg:w-[30%]"
            size={110}
            title={text("fields.transmission")}
            img={"/assets/transmission.png"}
            value={TRANSMISSION[auction.specs.transmission || 0] || ""}
          />
          <MiniCard
            containerClass="w-[48%] lg:w-[30%]"
            size={110}
            title={text("fields.horse power")}
            img={"/assets/horse.png"}
            value={auction.specs.cv ? auction.specs.cv?.toString() : "-"}
          />
          <MiniCard
            containerClass="w-[48%] lg:w-[30%]"
            size={110}
            title={text("fields.mileage")}
            img={"/assets/mileage.png"}
            value={auction.specs.kilometrage || "-" + " km/h"}
          />
          <MiniCard
            containerClass="w-[48%] lg:w-[30%] text-primary"
            size={110}
            title={text("fields.co2 emission")}
            img={"/assets/CO2.svg"}
            value={auction.specs.co2 || "-"}
          />
          <MiniCard
            containerClass="w-[48%] lg:w-[30%]"
            size={110}
            title={text("fields.doors")}
            img={"/assets/Doors.svg"}
            value={auction.specs.doors?.toString() || "-"}
          />
          <MiniCard
            containerClass="w-[48%] lg:w-[30%]"
            size={110}
            title={text("fields.engine size")}
            img={"/assets/engine.svg"}
            value={auction.specs.cc || "-"}
          />
        </div>
      </div>
      {isBuyNow ? (
        <Buy auction={auction} />
      ) : user?.type === "BID" ? (
        <>
          <CountDown
            variant="primary"
            onTimeOut={onTimeOut}
            endDate={auction.end_date || new Date()}
          />
        </>
      ) : (
        <AuctionStatus auction={auction} />
      )}
      {!isBuyNow && (
        <BidSection user={user} auction={auction} isTimeOut={isTimeOut} />
      )}
      {auction.address.lat && auction.address.lon && (
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
      )}
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
            {COLORS.filter((c) => c.value === value)[0]?.name || ""}
          </span>
        </>
      ) : (
        <span className="text-[12px]">{value}</span>
      )}
    </div>
  );
};
export default Home;

const AuctionStatus = ({ auction }: { auction: TAuction }) => {
  const [state, setState] = useState(auction.state);
  const { text } = useLang({
    file: "dashboard",
    selector: "auction",
  });

  useEffect(() => {
    const getStatus = (): AuctionState => {
      if (auction.state === "published") {
        if (auction.isClosed) return "completed";
        if (auction.end_date && auction.end_date < new Date())
          return "confirmation";
        return "published";
      }
      return auction.state;
    };
    setState(getStatus());
  }, [auction.end_date, auction.isClosed, auction.state]);
  return (
    <div className="py-10">
      <div className="border border-primary p-6 text-xl uppercase text-primary">
        <h3 className="text-center text-lg"> {text("status." + state)}</h3>
      </div>
    </div>
  );
};

type PropsByNow = {
  auction: TCar;
};
const Buy = ({ auction }: PropsByNow) => {
  const user = useContext(UserContext);
  const common = useContext(LangCommonContext);
  const { show } = useConfirmation();
  const router = useRouter();
  const { error, succes, loading } = useNotif();
  const { mutate } = trpc.auctionnaire.buy.useMutation({
    onError: (e) => {
      console.log(e);
      error();
    },
    onSuccess: () => {
      succes();
      router.reload();
    },
  });
  return (
    <div className="my-10 flex flex-row items-center justify-between rounded-lg bg-background p-6">
      <div className="flex flex-row items-center gap-3 text-xl font-bold text-primary">
        <FaMoneyBill className="text-gray-500" />
        <Price value={auction.price} />
      </div>

      {auction.state === "confirmation" ? (
        <Tag color="red">{common("text.selled")}</Tag>
      ) : (
        <button
          disabled={user?.type == "ADMIN"}
          onClick={() =>
            show(() => {
              mutate({ car_id: auction.id });
            })
          }
          className={cx("btn-sm btn")}
        >
          {common("button.buy")}
          {user?.username}
        </button>
      )}
    </div>
  );
};
