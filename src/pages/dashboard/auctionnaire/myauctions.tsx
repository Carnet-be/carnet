import { TAuction } from "@model/type";
import AuctionCard from "@ui/components/auctionCard";
import Dashboard from "@ui/dashboard";
import  { InDevelopmentMini } from "@ui/inDevelopment";
import { trpc } from "@utils/trpc";
import { type GetServerSideProps, type NextPage } from "next";
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
  const { data: auctions } = trpc.auctionnaire.getMyAuctions.useQuery();
    return   <Dashboard type="AUC">
     <div className="flex flex-wrap items-center  gap-6">
        {!auctions ? (
          <span>No data</span>
        ) : (
          auctions.map((a, i) => <AuctionCard key={i} auction={a as TAuction} mineAuction={true}/>)
        )}
      </div>
    </Dashboard>
    };


    export default Home