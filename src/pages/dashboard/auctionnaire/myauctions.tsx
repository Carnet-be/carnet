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
import { isConfirmation } from '../../../functions/date';
import { FullStatus, getStatus } from "../../../functions";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
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

  const { locale } = ctx;
  return {
    props: {
      ...(await serverSideTranslations(locale || "fr", ["common", "dashboard"])),
    },
  };
};
const Home: NextPage = () => {
  const [auctions, setAuctions] = useState<
    Array<{
      auction: Auction;
      state:FullStatus;
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
           
            return {
              auction: a,
              state: getStatus(a),
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
