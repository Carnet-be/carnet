import Dashboard from "@ui/dashboard";
import  { InDevelopmentMini } from "@ui/inDevelopment";
import { type GetServerSideProps, type NextPage } from "next";
import { getServerAuthSession } from "@server/common/get-server-auth-session";
import BigTitle from "@ui/components/bigTitle";
import { useRouter } from "next/router";

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
      props:{id
      }
    };
  };
const Home: NextPage = () => {
  const router=useRouter()
    return   <Dashboard type="BID">
      <BigTitle />

    </Dashboard>
    };


    export default Home