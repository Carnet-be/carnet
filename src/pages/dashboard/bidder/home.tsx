import BigTitle from "@ui/components/bigTitle";
import Dashboard from "@ui/dashboard";
import { InDevelopmentMini } from "@ui/inDevelopment";
import { type GetServerSideProps, type NextPage } from "next";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import cx from "classnames";
import { useState } from "react";
import { trpc } from '../../../utils/trpc';
import { useRouter } from "next/router";
import AuctionCard from "@ui/components/auctionCard";

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

  return {
    props: {},
  };
};
type TFilterBidde = "new" | "feature" | "trending" | "buy now";
const Home: NextPage = () => {
const router=useRouter()
const filter=router.query.filter as TFilterBidde||"new" 
  const {data:auctions}=trpc.auctionnaire.getAuctions.useQuery({filter})
  return (
    <Dashboard type="BID">
      <BigTitle />
      <div className="flex flex-row gap-4 py-6">
        {(["new", "feature", "trending", "buy now"] as TFilterBidde[]).map((f, i) => {
           
            const isActive=filter == f
          return (
            <button
              key={i}
              onClick={() =>{
            
               if(!isActive){
                router.push({pathname:"/dashboard/bidder/home",
                    query:{filter:f}},undefined,{shallow:true})
                console.log('click')
               }
              }}
              className={cx("  btn", {
                "btn-active  btn-primary": isActive,
                "btn-ghost":!isActive
              })}
            >
              {f}
            </button>
          );
        })}
      
      </div>
      <div className="flex flex-wrap gap-6 items-center justify-center">
       {!auctions? <span></span>:auctions.map((a,i)=><AuctionCard key={i} auction={a}/>)}
      </div>
    </Dashboard>
  );
};

export default Home;
