import { TNotification } from "@model/type";
import { db } from "@utils/firebase";
import { trpc } from "@utils/trpc";
import {
  query,
  collection,
  where,
  onSnapshot,
  documentId,
} from "firebase/firestore";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useNotifStore } from "../state";
import { getPrice } from "@ui/components/price";

const playNotificationSound = () => {
  const audio = document.getElementById("audio") as HTMLAudioElement;

  audio.play();
};

export const useNotifyMe = ({ uid }: { uid: string }) => {
  const { notifs, add } = useNotifStore((state) => state);
  const { data: user } = trpc.user.get.useQuery();
  const router = useRouter();
  const Msg = ({ closeToast, toastProps, content }: any) => (
    <div
      onClick={() => {
        router.push(content.link);
        closeToast();
      }}
      className="flex flex-col "
    >
      <h6 className="font-bold text-primary">{content.title}</h6>
      <p>{content.body}</p>
    </div>
  );
  const showNotification = async (notification: TNotification) => {
    const content = {
      title: "",
      body: "",
      link: "#",
    };
    ////
    let title = "";
    switch (notification.type) {
      case "new auction":
        content.title = "New Auction";
        content.body = "There is a new auction";
        content.link =
          "/admin/dashboard/auctions/pending?id=" + notification.auction_id;
        break;
      case "new user":
        const isBid = notification.user_type === "BID";
        content.title = "New User";
        content.body = `There is a new ${isBid ? "bidder" : "auctioneer"}`;
        content.link =
          `/admin/dashboard/users/${isBid ? "bidder" : "auctioneers"}?id=` +
          notification.user_id;
        break;
      case "auction modified":
      
        switch (notification.type_2) {
          case "pause":
            title = "Auction Paused";
            break;
          case "resume":
            title = "Auction Resumed";
            break;
          case "edit":
            title = "Auction Edited";
            break;
          case "delete":
            title = "Auction Deleted";
            break;
          case "published":
            title = "Auction Published";
            break;
          case "republished":
            title = "Auction Republished";
            break;
          case "add time":
            title = "Auction extended";
            break;
          case "cancel winner":
            title = "Auction winner canceled";
            break;
          default:
            title = notification.type_2;
            break;
        }
        content.title = title;
        content.body = `${notification.auction_name} (#${notification.auction_id})`;
        content.link =
          "/dashboard/auctionnaire/auction/" + notification.auction_id;
      break
      case "winner":
          
        content.title = user?.type === "BID" ? "Congratulation, you won an auction"  : "Winner chosen";
        content.body = `${notification.auction_name} (#${notification.auction_id})`;
           content.link =
        `/dashboard/${user?.type==="BID"?"bidder":"auctionnaire"}/auction/${notification.auction_id}`;
      break

      case "new bid":
              
          title= user?.type === "BID" ? "Someone bid higher than you"  : "New Bid";
          content.title = `${title} (${getPrice(notification.montant)})`;
          content.body = `${notification.auction_name} (#${notification.auction_id})`;
          content.link =
            `/dashboard/${user?.type==="AUC"?"auctionnaire":"bidder"}/auction/` + notification.auction_id;

         
    break
          default:

    
        break;
    }
    console.log("content", content);
    ///
    playNotificationSound();
    toast(<Msg content={content} />, {
      delay: 550,
    });
  };

  const isIllegible = (notification: TNotification) => {
    switch (notification.type) {
      case "new auction":
      case "new user":
        return user?.type === "ADMIN" || user?.type === "STAFF";
      case "auction modified":
        return user?.type === "AUC" && user.id === notification.auctionnaire_id; //TODO: check if user is admin or staff

      case "winner":
        return (
          (user?.type === "BID" && user.id === notification.winner_id) ||
          (user?.type === "AUC" && user.id === notification.auctionnaire_id)
        );
        case "new bid":
          return (
            (user?.type === "BID" && user.id === notification.last_bidder_id &&notification.last_bidder_id!==notification.bidder_id) ||
            (user?.type === "AUC" && user.id === notification.auctionnaire_id)
          );
      default:
        return false;
    }
  };
  useEffect(() => {
    let unsubscribe;
    if (user) {
      const dateLimit = new Date(moment().subtract(20, "minutes").format());
      console.log("dateLimit", dateLimit);
      const q = query(
        collection(db, "notifications"),

        where("date", ">=", dateLimit)
        //   where(`audiences.${uid}`, "==", true)
      );
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        console.log(
          "Notifications: ",
          querySnapshot.docs.map((doc) => doc.data())
        );
        querySnapshot
          .docChanges()
          //.filter((qs,i)=>i===0)
          .filter((qs) => !notifs.includes(qs.doc.id))
          .forEach(async (change) => {
            if (change.type === "added") {
              console.log("New city: ", change.doc.data());
              const notification = change.doc.data() as TNotification;
              if (isIllegible(notification)) {
                showNotification(notification);
                add(change.doc.id);
              }
            }
          });
      });
    }

    return unsubscribe;
  }, [user]);
};

export default function Notification() {
  return <div></div>;
}
