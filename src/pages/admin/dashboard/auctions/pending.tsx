import { AuctionsPage } from "."

import { type GetServerSideProps } from 'next';
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

  return {
    props: {},
  };
};
const Pending=()=>{
    return <AuctionsPage state="pending"/>
}

export default Pending