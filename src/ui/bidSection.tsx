/* eslint-disable react-hooks/exhaustive-deps */
import type { TAuction, TBid } from "@model/type";
import { useEffect, useState } from "react";
import Price from "./components/price";
import { AddIcon, AuctionIcon, MoinsIcon } from "./icons";
import cx from "classnames";
import { trpc } from "@utils/trpc";
import { toast } from "react-hot-toast";
import {PersonIcon} from '@ui/icons'
import moment from "moment";
import { number } from "zod";
type BidSection = {
  auction: TAuction;
  isTimeOut:boolean
};
const getMax=(bids:TBid[])=>{
  let max=0
  bids.forEach(bid=>{
    if(bid.montant>max){
      max=bid.montant
    }
  })
  return max
}
const BidSection = ({ auction ,isTimeOut}: BidSection) => {
  const getBidPrice = (bids: TBid[],price?:number) =>
    bids.length <= 0
      ? price|| auction.expected_price / 2
      : getMax(bids);
  const [bids, setbids] = useState(auction.bids);
  const [bidPrice, setbidPrice] = useState<number | undefined>(
    getBidPrice(auction.bids,auction.starting_price_with_commission||undefined)
  );
  const {
    data,
    isLoading: isLoadingFetching,
    refetch,
  } = trpc.bidder.getAuctionBidOnly.useQuery(auction.id, {
    enabled: false,
    onSuccess(data) {
      setbids(data?.bids as TBid[]);
    },
    onSettled(data) {
      setbids(data?.bids as TBid[]);
    },
  });

  useEffect(() => {
    setbidPrice(getBidPrice(bids,auction.starting_price_with_commission||undefined));
  }, [bids, getBidPrice]);

  return (
    <div className="flex max-h-[600px] w-full flex-col items-center space-y-4 rounded-xl bg-grey  p-6 overflow-hidden">
      <div className="rounded-3xl bg-white px-6 py-3 text-3xl font-semibold text-primary">
        {new Intl.NumberFormat().format(bidPrice || 0)} {" €"}
      </div>
      <span className="flex flex-row items-center">
        {bids.length == 0 ? "Initial price" : "Current bids"}{" "}
        <div className="w-10"></div>{" "}
        <div className="flex flex-row items-center text-xl text-primary">
          {bids.length} <AuctionIcon />
        </div>
      </span>

       {!isTimeOut&&  <AddBid
        start={bidPrice || 0}
        onAddBidSucces={() => {
          refetch();
        }}
        commission={auction.commission||undefined}
        number={auction.bids.length}
        auctionId={auction.id}
      />}
      <div className="w-full space-y-2 overflow-scroll">
        {bids.map((b, i) => {
          return (
            <div key={i} className={cx("flex flex-row items-center justify-between border-t-2 pt-2")}>
              <div>
                <h6 className="text-primary/80 flex flex-row items-center"><PersonIcon/> #{b.bidder.id}</h6>
                <span>{moment(b.createAt).fromNow()}</span>
              </div>
              <Price value={b.montant} textStyle="text-primary font-semibold text-lg"/>
            </div>
          );
        })}
      </div>
    </div>
  );
};

type AddBidPros = {
  start: number;
  onAddBidSucces: () => void;
  auctionId: string;
  number:number,
  commission: number|undefined;
};

const AddBid = ({ start, onAddBidSucces, auctionId,number,commission=0 }: AddBidPros) => {
  const incrWithCommission = (price: number) => price + price * commission / 100;
  const [price, setprice] = useState(start + incrWithCommission(100));
  const { mutate: addBid, isLoading } = trpc.bidder.add.useMutation({
    onError(error) {
      console.log("error lors d'un nouveau bid", error);
      toast.error("Echec de l'opération");
    },
    onSuccess(data) {
      toast.success("Vous avez deposé un bid");
      onAddBidSucces();
    },
  });
 
  const onAddBid = () => addBid({ price:price, auctionId,number:number+1 });
  return (
    <>
      {" "}
      <div className="flex w-[70%] flex-row items-center justify-between gap-2">
        <button
          onClick={() => setprice(price - incrWithCommission(100))}
          className={cx("btn-primary btn-sm btn-circle btn", {
            "btn-disabled": price <= start + incrWithCommission(100),
          })}
        >
          <MoinsIcon className="text-lg" />
        </button>
        <Price value={price} textStyle="font-semibold text-xl text-primary" />
        <button
          onClick={() => setprice(price + incrWithCommission(100))}
          className={cx("btn-primary btn-sm btn-circle btn")}
        >
          <AddIcon className="text-lg" />
        </button>
      </div>
      <span className="text-sm italic">Must be in ${incrWithCommission(100)}increments</span>
      <button
        onClick={onAddBid}
        className={cx("btn-primary btn-wide btn my-2", {
          loading: isLoading,
        })}
      >
        Bid Now
      </button>
    </>
  );
};
export default BidSection;
