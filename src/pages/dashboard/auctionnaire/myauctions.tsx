import { TAuction } from "@model/type";
import { Auction } from "@prisma/client";
import AuctionCard from "@ui/components/auctionCard";
import CreateAuction from "@ui/createAuction";
import Dashboard from "@ui/dashboard";
import  { InDevelopmentMini } from "@ui/inDevelopment";
import { trpc } from "@utils/trpc";
import { type GetServerSideProps, type NextPage } from "next";
import {useState} from 'react'
import { BannierAddAuction } from ".";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
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
      props:{
      }
    };
  };
const Home: NextPage = () => {
  const { data: auctions,refetch } = trpc.auctionnaire.getMyAuctions.useQuery({full:true});
  const [editAuction,setEditAuction]=useState<TAuction|undefined>()
    return   <Dashboard type="AUC">
    <BannierAddAuction />
    <br/>
    <br/>
     <div className="flex flex-wrap items-center  gap-6">
        {!auctions ? (
          <span>No data</span>
        ) : (
          auctions.map((a, i) => <AuctionCard key={i} refetch={refetch} auction={a as TAuction} mineAuction={true} onEdit={()=>{
            
            setEditAuction(a as TAuction)
          }}/>)
        )}
      </div>
    </Dashboard>
    };


    export default Home