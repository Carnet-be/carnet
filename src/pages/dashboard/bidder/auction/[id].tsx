import Dashboard from "@ui/dashboard";
import  { InDevelopmentMini } from "@ui/inDevelopment";
import { type GetServerSideProps, type NextPage } from "next";
import { getServerAuthSession } from "@server/common/get-server-auth-session";

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
    const id=ctx.query.id as string | undefined
     
    if (!id) {
      return {
        redirect: {
          destination: "/dashboard/bidder/home",
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
    return   <Dashboard type="BID">
    <InDevelopmentMini section="My biddes"/>
    </Dashboard>
    };


    export default Home