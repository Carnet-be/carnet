import { getServerAuthSession } from "@server/common/get-server-auth-session";
import { GetServerSideProps } from "next";
import { AuctionsPage } from ".";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getServerAuthSession(ctx);
    console.log(session?.user);
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
const Pending=()=>{
    return <AuctionsPage state="completed"/>
}

export default Pending