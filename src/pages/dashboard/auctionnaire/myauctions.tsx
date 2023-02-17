import { TAuction } from "@model/type";
import { Auction } from "@prisma/client";
import AuctionCard from "@ui/components/auctionCard";
import CreateAuction from "@ui/createAuction";
import Dashboard from "@ui/dashboard";
import { InDevelopmentMini } from "@ui/inDevelopment";
import { trpc } from "@utils/trpc";
import { type GetServerSideProps, type NextPage } from "next";
import { useState } from "react";
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
    props: {},
  };
};
const Home: NextPage = () => {
  const [auctions, setAuctions] = useState<
    Array<{
      auction: Auction;
      state: "published" | "pending" | "pause" | "completed" | "confirmation";
    }>
  >([]);
  const { refetch, isLoading } = trpc.auctionnaire.getMyAuctions.useQuery(
    {
      full: true,
    },
    {
      onSuccess(data) {
        setAuctions(
          data.map((a) => {
            let state:
              | "published"
              | "pending"
              | "pause"
              | "completed"
              | "confirmation" = a.state;
            if (a.isClosed) state = "completed";
            if (a.state == "published") {
              if (a.end_date?.getDate() || 0 < new Date().getDate())
                state = "confirmation";
            }
            return {
              auction: a,
              state: state,
            };
          })
        );
      },
    }
  );
  const [editAuction, setEditAuction] = useState<TAuction | undefined>();
  return (
    <Dashboard type="AUC">
      <BannierAddAuction />
      <br />
      <br />
      <div className="flex flex-wrap items-center  gap-6">
        {!auctions ? (
          <span>No data</span>
        ) : (
          auctions.map((a, i) => (
            <AuctionCard
              key={i}
              refetch={refetch}
              auction={a.auction as TAuction}
              state={a.state}
              mineAuction={true}
              onEdit={() => {
                setEditAuction(a.auction as TAuction);
              }}
            />
          ))
        )}
      </div>
    </Dashboard>
  );
};

export default Home;
