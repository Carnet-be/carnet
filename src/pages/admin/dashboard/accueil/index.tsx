/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerAuthSession } from "@server/common/get-server-auth-session";
import Dashboard from "@ui/dashboard";
import type { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useEffect } from "react";
import { useLang } from "../../../hooks";
import { useAuctionCountStore } from "../../../../state";
import cx from "classnames";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { Button, Divider, Tag } from "antd";
import { useRouter } from "next/router";
import moment from "moment";
import Price from "@ui/components/price";
import { getStatus } from "../../../../functions";
import { Auction } from "@prisma/client";
import { CheckIcon, ViewIcon, XIcon } from "@ui/icons";
import { TbArrowDownRight } from "react-icons/tb";
import { AiOutlineArrowRight } from "react-icons/ai";
import Link from "next/link";
import SendMessageButton from "@ui/components/sendMessageButton";
ChartJS.register(ArcElement, Tooltip, Legend);

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  //TODO: fix prisma
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }

  const data = await prisma?.$transaction([
    prisma.auction.count(),
    prisma.auction.findMany({
      take: 5,
      include: {
        images: true,
        bids: true,
        auctionnaire: true,
      },
      orderBy: {
        createAt: "desc",
      },
    }),
    prisma.bid.count(),
    prisma.bid.findMany({
      take: 5,
      include: {
        auction: true,
        bidder: true,
      },
      orderBy: {
        createAt: "desc",
      },
    }),
    prisma.user.count({
      where: {
        OR: [
          {
            type: "AUC",
          },
          {
            type: "BID",
          },
        ],
      },
    }),
    prisma.user.findMany({
      take: 5,
      where: {
        OR: [
          {
            type: "AUC",
          },
          {
            type: "BID",
          },
        ],
      },
      include: {
        image: true,
      },
      orderBy: {
        createAt: "desc",
      },
    }),
  ]);

  const auctionCount = data ? data[0] : 0;
  const auctions = data ? data[1] : [];
  const bidCount = data ? data[2] : 0;
  const bids = data ? data[3] : [];
  const userCount = data ? data[4] : 0;
  const users = data ? data[5] : [];

  return {
    props: {
      ...(await serverSideTranslations(ctx.locale || "fr", [
        "common",
        "dashboard",
      ])),

      auctionCount,
      auctions: JSON.parse(JSON.stringify(auctions)),
      bidCount,
      bids: JSON.parse(JSON.stringify(bids)),
      userCount,
      users: JSON.parse(JSON.stringify(users)),
    },
  };
};

const convertK = (number: number) => {
  if (number < 1000) {
    return number;
  } else {
    return `${number / 1000}k`;
  }
};
const colors = [
  "rgba(255, 99, 132, 0.2)",
  "rgba(34, 16, 235, 0.2)",
  "rgba(255, 206, 86, 0.2)",
  "rgba(75, 192, 192, 0.2)",
  "rgba(153, 102, 255, 0.2)",
  "rgba(255, 159, 64, 0.2)",
];

const borderColors = [
  "rgba(255, 99, 132, 1)",
  "rgba(34, 16, 235, 1)",
  "rgba(255, 206, 86, 1)",
  "rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 1)",
  "rgba(255, 159, 64, 1)",
];

// const auctionToStatus = (auction: Auction) => {

// }

const getColorByIndex = (index: number) => {
  return {
    backgroundColor: colors[index],
    borderColor: borderColors[index],
  };
};

const Accueil = ({
  auctionCount,
  auctions,
  bidCount,
  bids,
  userCount,
  users,
}: {
  auctionCount: number;
  auctions: any[];
  bidCount: number;
  bids: any[];
  userCount: number;
  users: any[];
}) => {
  const { text } = useLang({
    file: "dashboard",
    selector: "admin home",
  });
  const { text: a } = useLang({
    file: "dashboard",
    selector: "auction",
  });
  const { data } = useAuctionCountStore();
  useEffect(() => {
    console.log(data);
  }, [data]);
  const router = useRouter();
  const { text: common } = useLang(undefined);
  return (
    <Dashboard type="ADMIN">
      <h1>{text("title")}</h1>
      <div className="w-full rounded border bg-white p-5">
        <div className="flex flex-row items-center">
          <div className="flex flex-grow flex-col gap-2">
            {Object.keys(data)
              .map((key, index) => ({
                label: key,
                number: data[key as keyof typeof data],
                ...getColorByIndex(index),
              }))
              .map(({ label, number, backgroundColor, borderColor }, index) => (
                <div
                  onClick={() => {
                    router.push(`/admin/dashboard/auctions/${label}`);
                  }}
                  key={index}
                  className="flex cursor-pointer flex-row items-center justify-between gap-4 rounded border p-2 hover:bg-gray-100"
                >
                  <div
                    className="h-5 w-5 border"
                    style={{ backgroundColor, borderColor }}
                  />

                  <div className="text-sm">{a("status." + label)}</div>
                  <div className="flex-grow" />
                  <Tag className="text-sm">{number}</Tag>
                </div>
              ))}
          </div>
          <Divider type="vertical" />
          <ChartPie data={data} />
        </div>
      </div>
      <div className="my-10 w-full rounded border bg-white p-5">
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-lg font-bold text-primary">
            {text("total cars")} : ({convertK(auctionCount)})
          </h2>

          <button
            onClick={() => router.push("/admin/dashboard/auctions")}
            className="btn-ghost btn-xs btn gap-2"
          >
            {common("text.more")}
            <AiOutlineArrowRight />
          </button>
        </div>

        <div className="divider my-0"></div>
        <div className="flex flex-row items-center gap-2 py-3 font-bold text-black">
          <span>{text("recent cars")}</span>
          <TbArrowDownRight />
        </div>
        <div className="relative overflow-x-auto pl-3">
          <table className="w-full text-left text-sm text-gray-500 ">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 ">
              <tr>
                <th scope="col" className="px-6 py-3">
                  {common("table.name")}
                </th>
                <th scope="col" className="px-6 py-3">
                  {common("table.auctioneer")}
                </th>
                <th scope="col" className="px-6 py-3">
                  {common("table.date pub")}
                </th>
                <th scope="col" className="px-6 py-3 text-end">
                  {common("table.expected price")}
                </th>
                <th scope="col" className="px-6 py-3">
                  {common("table.status")}
                </th>
              </tr>
            </thead>
            <tbody>
              {auctions.map((auction, index) => (
                <tr key={index} className="border-b bg-white">
                  <th className="px-6 py-4 font-medium text-gray-900 ">
                    <Link
                      href={"/admin/auction/" + auction.id}
                      className="text-black hover:text-primary"
                    >
                      <h6>{auction.name}</h6>
                    </Link>
                    <span className="text-xs text-primary">#{auction.id}</span>
                  </th>
                  <td className="px-6 py-4">
                    <h6>{auction.auctionnaire.username}</h6>
                    <span className="text-xs text-primary">
                      #{auction.auctionnaire.id}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <Tag color="blue">{moment(auction.createAt).fromNow()}</Tag>
                  </td>
                  <td className="px-6 py-4 text-end">
                    <Price value={auction.expected_price as number} />
                  </td>
                  <td className="px-6 py-4">
                    <Tag>{a("status." + getStatus(auction))}</Tag>
                  </td>
                  {/* <td className="px-6 py-4">
                    <Button
                      onClick={() => {
                        router.push("/admin/auction/" + auction.id);
                      }}
                      shape="circle"
                      icon={<ViewIcon className="mx-auto text-lg" />}
                    />
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="w-full rounded border bg-white p-5">
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-lg font-bold text-primary">
            {text("total bids")} : ({convertK(bidCount)})
          </h2>

          <button
            onClick={() => router.push("/admin/dashboard/bids")}
            className="btn-ghost btn-xs btn gap-2"
          >
            {common("text.more")}
            <AiOutlineArrowRight />
          </button>
        </div>

        <div className="divider my-0"></div>
        <div className="flex flex-row items-center gap-2 py-3 font-bold text-black">
          <span>{text("recent bids")}</span>
          <TbArrowDownRight />
        </div>
        <div className="relative overflow-x-auto pl-3">
          <table className="w-full text-left text-sm text-gray-500 ">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 ">
              <tr>
                <th scope="col" className="px-6 py-3">
                  {common("table.auction")}
                </th>
                <th scope="col" className="px-6 py-3">
                  {common("table.bidder")}
                </th>
                <th scope="col" className="px-6 py-3">
                  {common("table.date")}
                </th>
                <th scope="col" className="px-6 py-3 text-end">
                  {common("table.value")}
                </th>
              </tr>
            </thead>
            <tbody>
              {bids.map((auction, index) => (
                <tr key={index} className="border-b bg-white ">
                  <th className="px-6 py-4 font-medium text-gray-900">
                    <Link
                      href={"/admin/auction/" + auction.id}
                      className="text-black hover:text-primary"
                    >
                      <h6>{auction.auction.name}</h6>
                    </Link>
                    <span className="text-xs text-primary">
                      #{auction.auction.id}
                    </span>
                  </th>
                  <td className="px-6 py-4">
                    <h6>{auction.bidder.username}</h6>
                    <span className="text-xs text-primary">
                      #{auction.bidder.id}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <Tag color="blue">{moment(auction.createAt).fromNow()}</Tag>
                  </td>
                  <td className="px-6 py-4 text-end">
                    <Price value={auction.montant} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="my-10 w-full rounded border bg-white p-5">
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-lg font-bold text-primary">
            {text("total users")} : ({convertK(userCount)})
          </h2>

          <button
            onClick={() => router.push("/admin/dashboard/users")}
            className="btn-ghost btn-xs btn gap-2"
          >
            {common("text.more")}
            <AiOutlineArrowRight />
          </button>
        </div>

        <div className="divider my-0"></div>
        <div className="flex flex-row items-center gap-2 py-3 font-bold text-black">
          <span>{text("recent users")}</span>
          <TbArrowDownRight />
        </div>
        <div className="relative overflow-x-auto pl-3">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3">
                  {common("table.image")}
                </th>
                <th scope="col" className="px-6 py-3">
                  {common("table.name")}
                </th>
                <th scope="col" className="px-6 py-3">
                  {common("table.email")}
                </th>

                <th scope="col" className="px-6 py-3 text-end">
                  {common("table.type")}
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((auction, index) => (
                <tr key={index} className="border-b bg-white">
                  <th className="flex flex-row px-6 py-4 font-medium text-gray-900">
                    {/* <SendMessageButton receiver={auction.id} /> */}
                    <div>
                      <h6>{auction.username}</h6>

                      <span className="text-xs text-primary">
                        #{auction.id}
                      </span>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    <div className="flex flex-row items-center gap-2">
                      <span className="text-[12px]">{auction.email}</span>
                      {!auction.emailVerified ? (
                        <XIcon className={cx("text-lg text-red-500")} />
                      ) : (
                        <CheckIcon className={cx("text-lg text-primary")} />
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <Tag color="blue">{moment(auction.createAt).fromNow()}</Tag>
                  </td>
                  <td className="px-6 py-4 text-end">
                    <Tag>
                      {common(
                        "table." +
                          (auction.type == "BID" ? "bidder" : "auctioneer")
                      )}
                    </Tag>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Dashboard>
  );
};

export default Accueil;

const ChartPie = ({
  data,
}: {
  data: {
    published: number;
    pending: number;
    pause: number;
    confirmation: number;
    completed: number;
  };
}) => {
  const { text: a } = useLang({
    file: "dashboard",
    selector: "auction",
  });
  return (
    <div className="w-[300px]">
      <Pie
        data={{
          labels: Object.keys(data).map((key) => a("status." + key)),
          datasets: [
            {
              label: a("text.auction number"),
              data: Object.values(data),
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(34, 16, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 1,
            },
          ],
        }}
      />
    </div>
  );
};
