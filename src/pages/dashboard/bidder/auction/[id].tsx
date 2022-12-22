/* eslint-disable @next/next/no-img-element */
import Dashboard from "@ui/dashboard";
import { InDevelopmentMini } from "@ui/inDevelopment";
import {
  type InferGetServerSidePropsType,
  type GetServerSideProps,
  type NextPage,
} from "next";
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
import cx from 'classnames'
import CountDown from "@ui/components/countDown";
import { ProcessDate } from "@utils/processDate";
import BidSection from "@ui/bidSection";
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
  return (
    <div className="flex  w-full flex-grow flex-col gap-3 lg:w-[57%]">
      <div className="h-[400px] w-full "></div>
    </div>
  );
};

const RightSide = ({ auction }: { auction: TAuction }) => {

  const brand = BRAND[auction.brand]?.title || "";
  const model = BRAND[auction.brand]?.model[auction.model];
 const carrosserie=CARROSSERIE[auction.specs.carrosserie||0]
 const onTimeOut=()=>{
  console.log("Time out, executing...")
 }
  return (
    <div className=" w-full lg:w-[40%] ">
      <div className="w-full rounded-xl bg-grey p-3 space-y-4">
        <div className="flex flex-row items-center justify-between gap-2">
          <MiniCard imgClass="scale-110" value={brand} img="/assets/Cars/Audi.svg" />
          <div className="flex flex-col items-center font-semibold text-primary">
            <h6 className="text-lg">{model}</h6>
            <span>{auction.build_year}</span>
          </div>
          <span className="font-semibold text-gray-500">#{auction.id}</span>
        </div>
        <div className="flex flex-wrap gap-4">
        <MiniCard containerClass="w-[48%] lg:w-[30%]" size={94} title="Carrosserie" img={"/assets/step2/"+carrosserie?.img+".svg"} value={carrosserie?.title||""}/>
        <MiniCard containerClass="w-[48%] lg:w-[30%]" size={94} title="Fuel" img={"/assets/fuel.png"} value={auction.fuel}/>
        <MiniCard containerClass="w-[48%] lg:w-[30%]" size={94} title="Color" img={"/assets/color.png"} value={auction.color||"#fffff"} isColor/>
        <MiniCard containerClass="w-[48%] lg:w-[30%]" size={94} title="Transmission" img={"/assets/transmission.png"} value={TRANSMISSION[auction.specs.transmission||0]||""}/>
        <MiniCard containerClass="w-[48%] lg:w-[30%]" size={94} title="Horse Power" img={"/assets/horse.png"} value={auction.specs.cc+" cc"}/>
        <MiniCard containerClass="w-[48%] lg:w-[30%]" size={94} title="Mileage" img={"/assets/mileage.png"} value={auction.specs.kilometrage+" km/h"}/>
      </div>
      </div>
      <CountDown variant="primary" onTimeOut={onTimeOut} endDate={auction.end_date}/>
         <BidSection auction={auction}/>
    </div>
  );
};

const MiniCard = (props: { value: string; img: string; title?: string,imgClass?:string,size?:number,containerClass?:string,isColor?:boolean }) => {
  const { value, img, title,imgClass,size,containerClass,isColor } = props;

  return (
    <div className={cx("flex flex-col justify-between items-center rounded-xl bg-base-100 py-2 px-4  text-primary",containerClass,{[`h-[${size}px]`]:size})}>
      <span className="font-semibold ">{title ? title : ""}</span>
     <div className={cx("h-[20px] relative w-full",imgClass)}>
     <Image alt="logo" src={img} fill className="object-contain"/>
     </div>
     {isColor? <div style={{backgroundColor:value}} className={cx("w-8 h-4 rounded-full")}></div> : <span className="text-[12px]">{value}</span>}
    </div>
  );
};
export default Home;
