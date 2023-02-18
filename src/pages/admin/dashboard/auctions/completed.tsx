/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { getServerAuthSession } from "@server/common/get-server-auth-session";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import cx from "classnames";
import { ColumnsType } from "antd/es/table";
import { Auction, Bid } from "@prisma/client";
import { TAuction } from "@model/type";
import BigTitle from "@ui/components/bigTitle";
import Price from "@ui/components/price";
import App from "antd";
import MyTable, {
  renderDate,
  RenderTimer,
  ActionTable,
  TableType,
} from "@ui/components/table";
import { AuctionIcon, CheckIcon, PauseIcon, WinIcon } from "@ui/icons";
import { trpc } from "@utils/trpc";
import { useState } from "react";

import { Tag } from "antd";
import Dashboard from "@ui/dashboard";
import CreateAuction from "@ui/createAuction";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { BiPause } from "react-icons/bi";
import moment from "moment";
import { SwitcherAuctions } from ".";
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


const Completed = () => {
  const {
    data: auctions,
    isLoading,
    refetch,
  } = trpc.auctionnaire.getCompleted.useQuery();
  const { data: bids, isLoading: isLoadingBids } =
    trpc.auctionnaire.getBids.useQuery({
      filter: "all",
    });
 
//   const expandedColumns = (record: Auction) => {
//     const columns: ColumnsType<Bid> = [
//       {
//         title: "Numero",
//         width: "80px",
//         dataIndex: "numero",
//         key: "numero",
//         align: "center",
//         render: (v) => (
//           <div className="mx-auto flex h-[20px] w-[20px] items-center justify-center rounded-full bg-primary/60 text-white">
//             <h6>{v}</h6>
//           </div>
//         ),
//       },
//       {
//         title: "Id",
//         width: "150px",
//         dataIndex: "id",
//         key: "id",
//         render: (v) => (
//           <span className="text-[12px] italic text-primary">#{v}</span>
//         ),
//       },
//       {
//         title: "Date",
//         width: "150px",
//         dataIndex: "createAt",
//         key: "createAt",
//         align: "center",
//         render: (v) => renderDate(v, "DD/MM/YYYY HH:mm:ss"),
//       },
//       {
//         title: "Bidder",

//         dataIndex: "bidder",
//         key: "bidder",
//         render: (_, v) => (
//           <div>
//             <h6>{(v as any).bidder.username}</h6>
//             <span className="text-[12px] italic text-primary">
//               #{(v as any).bidder.id}
//             </span>
//           </div>
//         ),
//       },

//       {
//         title: "Value",
//         dataIndex: "montant",

//         key: "montant",
//         render: (v) => <Price value={v} textStyle="text-sm leading-4" />,
//       },
      
//     ];
//     return (
//       <MyTable
//         loading={isLoadingBids}
//         columns={columns as ColumnsType<TableType>}
//         data={(bids || [])
//           .map((b, i) => ({ ...b, key: b.auction_id }))
//           .filter((f) => f.auction_id == record.id)}
//         options={{ pagination: false }}
//       />
//     );
//   };
//   const { mutate: pauseAuction } = trpc.auctionnaire.pauseAuction.useMutation({
//     onMutate: () => {
//       toast.loading("In process");
//     },
//     onError: (err) => {
//       console.log(err);
//       toast.dismiss();
//       toast.error("Faild to pause");
//     },
//     onSuccess: () => {
//       toast.dismiss();
//       toast.success("Success");
//       refetch();
//     },
//   });
  const columns: ColumnsType<Auction> = [
    {
      title: "Id",
      width: "80px",
      dataIndex: "id",
      key: "id",
      render: (v) => (
        <span className="text-[12px] italic text-primary">#{v}</span>
      ),
    },

    {
      title: "Completed At",

      dataIndex: "closedAt",
      key: "createAt",
      width: "100px",
      align: "center",
      render: (v) => renderDate(v, "DD/MM/YYYY HH:mm"),
    },
    {
      title: "Name",

      // className: "w-[150px] text-[12px] lg:w-[240px] lg:text-base",
      dataIndex: "name",
      key: "name",
    },
    {
        title: "Commission",
  
        // className: "w-[150px] text-[12px] lg:w-[240px] lg:text-base",
        dataIndex: "commission",
        key: "commission",
        align: "center",
        render: (_,v) => <span className="font-bold">{(v as TAuction).commission}%</span>
      },
   
    {
      title: "Value",
      dataIndex: "value",
      align: "right",
      key: "value",
      render: (_,v) => <Price value={(v as TAuction).bids.find((b)=>b.winner==true)?.montant} textStyle="text-sm leading-4" />,
    },
    {
        title: "Bidder",
  
        // className: "w-[150px] text-[12px] lg:w-[240px] lg:text-base",
        dataIndex: "bid",
        key: "bid",
        render: (_,v) => <h6>{(v as TAuction).bids.find((d)=>d.winner==true)?.bidder.username}</h6>
      },
    
    // {
    //   title: "Publish",
    //   dataIndex: "publish",
    //   align: "center",
    //   key: "publish",
    //   render: (v) => (
    //     <Tag
    //       icon={<CheckIcon />}
    //       color="#55acee"
    //       className="flex flex-row items-center justify-center gap-1 px-1"
    //     >
    //       published
    //     </Tag>
    //   ),
    // },
    
  ];

  return (
    <>
  

      <Dashboard type="ADMIN">
        <BigTitle title="Management of auctions" />
        <SwitcherAuctions />
        <div className="mt-6 flex w-full flex-col items-end">
          <MyTable
            loading={isLoading}
            data={(auctions || []).map((auc) => ({ ...auc, key: auc.id }))}
            // options={{ scroll: { x: 1400 } }}
            columns={columns as ColumnsType<TableType>}
           // options={{ expandedRowRender: expandedColumns }}
          />
        </div>
      </Dashboard>
    </>
  );
};


export default Completed