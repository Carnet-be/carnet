/* eslint-disable @typescript-eslint/no-explicit-any */
import { TNotification } from "@model/type";
import { db } from "@utils/firebase";
import { trpc } from "@utils/trpc";
import {
  query,
  collection,
  where,
  onSnapshot,
  documentId,
  writeBatch,
  doc,
  arrayUnion,
} from "firebase/firestore";
import moment from "moment";
import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { toast as notif } from "react-hot-toast";
import { useNotifStore } from "../state";
import { getPrice } from "@ui/components/price";
import { User } from "@prisma/client";
import { useTranslation } from "next-i18next";

const playNotificationSound = () => {
  const audio = document.getElementById("audio") as HTMLAudioElement;

  audio.play();
};

export const useNotifyMe = ({ uid }: { uid: string }) => {
  const { text: common } = useLang(undefined);
  const t = (key: string) => common("notifications." + key);
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
      <p className="line-clamp-2">{content.body}</p>
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
        content.title = t(notification.type + ".title");
        content.body = t(notification.type + ".body");
        content.link =
          "/admin/dashboard/auctions/pending?id=" + notification.auction_id;
        break;
      case "new user":
        const isBid = notification.user_type === "BID";
        content.title = t(notification.type + ".title");
        content.body = t(notification.type + ".body");
        content.link =
          `/admin/dashboard/users/${isBid ? "bidder" : "auctioneers"}?id=` +
          notification.user_id;
        break;
      case "auction modified":
        title = t(notification.type + "." + notification.type_2);
        // switch (notification.type_2) {
        //   case "pause":
        //     title = "Auction Paused";
        //     break;
        //   case "resume":
        //     title = "Auction Resumed";
        //     break;
        //   case "edit":
        //     title = "Auction Edited";
        //     break;
        //   case "delete":
        //     title = "Auction Deleted";
        //     break;
        //   case "published":
        //     title = "Auction Published";
        //     break;
        //   case "republished":
        //     title = "Auction Republished";
        //     break;
        //   case "add time":
        //     title = "Auction extended";
        //     break;
        //   case "cancel winner":
        //     title = "Auction winner canceled";
        //     break;
        //   default:
        //     title = notification.type_2;
        //     break;
        // }
        content.title = title;
        content.body = `${notification.auction_name} (#${notification.auction_id})`;
        content.link =
          "/dashboard/auctionnaire/auction/" + notification.auction_id;
        break;
      case "winner":
        content.title = t(notification.type + "." + user?.type);
        content.body = `${notification.auction_name} (#${notification.auction_id})`;
        content.link = `/dashboard/${
          user?.type === "BID" ? "bidder" : "auctionnaire"
        }/auction/${notification.auction_id}`;
        break;

      case "new bid":
        title = t(notification.type + "." + user?.type);
        content.title = `${title} (${getPrice(notification.montant)})`;
        content.body = `${notification.auction_name} (#${notification.auction_id})`;
        content.link =
          `/dashboard/${
            user?.type === "AUC" ? "auctionnaire" : "bidder"
          }/auction/` + notification.auction_id;

        break;
      case "auction expired":
        content.title = t(notification.type);
        content.body = `${notification.auction_name} (#${notification.auction_id})`;
        content.link =
          `/dashboard/${
            user?.type === "AUC" ? "auctionnaire" : "bidder"
          }/auction/` + notification.auction_id;

        break;
      case "auction 1h left":
        content.title = t(notification.type);
        content.body = `${notification.auction_name} (#${notification.auction_id})`;
        content.link =
          `/dashboard/${
            user?.type === "AUC" ? "auctionnaire" : "bidder"
          }/auction/` + notification.auction_id;

        break;
      case "auction 3h left":
        content.title = t(notification.type);
        content.body = `${notification.auction_name} (#${notification.auction_id})`;
        content.link =
          `/dashboard/${
            user?.type === "AUC" ? "auctionnaire" : "bidder"
          }/auction/` + notification.auction_id;

        break;

      case "new message":
        content.title = t(notification.type);
        content.body = `${notification.content}`;
        if (user?.type === "AUC") {
          content.link = `/dashboard/auctionnaire/chat`;
        }
        if (user?.type === "BID") {
          content.link = `/dashboard/bidder/chat`;
        }
        if (user?.type === "ADMIN") {
          content.link = `/admin/dashboard/chat`;
        }
        break;
      default:
        break;
    }
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
          (user?.type === "BID" &&
            user.id === notification.last_bidder_id &&
            notification.last_bidder_id !== notification.bidder_id) ||
          (user?.type === "AUC" && user.id === notification.auctionnaire_id)
        );

      case "auction expired":
        return (
          (user?.type === "AUC" && user.id == notification.auctionnaire_id) ||
          (user?.type === "BID" && user.id in notification.bidders)
        );
      case "auction 1h left":
        return (
          (user?.type === "AUC" && user.id == notification.auctionnaire_id) ||
          (user?.type === "BID" && user.id in notification.bidders)
        );
      case "auction 3h left":
        return (
          (user?.type === "AUC" && user.id == notification.auctionnaire_id) ||
          (user?.type === "BID" && user.id in notification.bidders)
        );
      case "new message":
        return (
          notification.receiver === (user?.type == "ADMIN" ? "ADMIN" : user?.id)
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

export const useGetNotifications = () => {
  const { text: common } = useLang(undefined);
  const t = (key: string) => common("notifications." + key);
  const [notifications, setNotifications] = useState<
    { title: string; body: string; link: string; date: Date; uid: string }[]
  >([]);
  const [newNotifs, setnewNotifs] = useState<TNotification[]>([]);
  const { data: user } = trpc.user.get.useQuery();

  const showNotification = (notification: TNotification) => {
    const content = {
      title: "",
      body: "",
      link: "#",
      date: new Date(),
      uid: notification.uid || "",
    };
    ////
    let title = "";
    switch (notification.type) {
      case "new auction":
        content.title = t(notification.type + ".title");
        content.body = t(notification.type + ".body");
        content.link =
          "/admin/dashboard/auctions/pending?id=" + notification.auction_id;
        break;
      case "new user":
        const isBid = notification.user_type === "BID";
        content.title = t(notification.type + ".title");
        content.body = t(notification.type + ".body");
        content.link =
          `/admin/dashboard/users/${isBid ? "bidders" : "auctioneers"}?id=` +
          notification.user_id;
        break;
      case "auction modified":
        title = t(notification.type + "." + notification.type_2);
        // switch (notification.type_2) {
        //   case "pause":
        //     title = "Auction Paused";
        //     break;
        //   case "resume":
        //     title = "Auction Resumed";
        //     break;
        //   case "edit":
        //     title = "Auction Edited";
        //     break;
        //   case "delete":
        //     title = "Auction Deleted";
        //     break;
        //   case "published":
        //     title = "Auction Published";
        //     break;
        //   case "republished":
        //     title = "Auction Republished";
        //     break;
        //   case "add time":
        //     title = "Auction extended";
        //     break;
        //   case "cancel winner":
        //     title = "Auction winner canceled";
        //     break;
        //   default:
        //     title = notification.type_2;
        //     break;
        // }
        content.title = title;
        content.body = `${notification.auction_name} (#${notification.auction_id})`;
        content.link =
          "/dashboard/auctionnaire/auction/" + notification.auction_id;
        break;
      case "winner":
        content.title = t(notification.type + "." + user?.type);
        content.body = `${notification.auction_name} (#${notification.auction_id})`;
        content.link = `/dashboard/${
          user?.type === "BID" ? "bidder" : "auctionnaire"
        }/auction/${notification.auction_id}`;
        break;

      case "new bid":
        title = t(notification.type + "." + user?.type);
        content.title = `${title} (${getPrice(notification.montant)})`;
        content.body = `${notification.auction_name} (#${notification.auction_id})`;
        content.link =
          `/dashboard/${
            user?.type === "AUC" ? "auctionnaire" : "bidder"
          }/auction/` + notification.auction_id;

        break;
      case "auction expired":
        content.title = t(notification.type);
        content.body = `${notification.auction_name} (#${notification.auction_id})`;
        content.link =
          `/dashboard/${
            user?.type === "AUC" ? "auctionnaire" : "bidder"
          }/auction/` + notification.auction_id;

        break;
      case "auction 1h left":
        content.title = t(notification.type);
        content.body = `${notification.auction_name} (#${notification.auction_id})`;
        content.link =
          `/dashboard/${
            user?.type === "AUC" ? "auctionnaire" : "bidder"
          }/auction/` + notification.auction_id;

        break;
      case "auction 3h left":
        content.title = t(notification.type);
        content.body = `${notification.auction_name} (#${notification.auction_id})`;
        content.link =
          `/dashboard/${
            user?.type === "AUC" ? "auctionnaire" : "bidder"
          }/auction/` + notification.auction_id;

        break;

      case "new message":
        content.title = t(notification.type);
        content.body = `${notification.content}`;
        if (user?.type === "AUC") {
          content.link = `/dashboard/auctionnaire/chat`;
        }
        if (user?.type === "BID") {
          content.link = `/dashboard/bidder/chat`;
        }
        if (user?.type === "ADMIN") {
          content.link = `/admin/dashboard/chat`;
        }
        break;

      default:
        break;
    }
    content.date = (notification.date as any).toDate();
    return content;
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
          (user?.type === "BID" &&
            user.id === notification.last_bidder_id &&
            notification.last_bidder_id !== notification.bidder_id) ||
          (user?.type === "AUC" && user.id === notification.auctionnaire_id)
        );
      case "auction expired":
        return (
          (user?.type === "AUC" && user.id == notification.auctionnaire_id) ||
          (user?.type === "BID" && user.id in notification.bidders)
        );
      case "auction 1h left":
        return (
          (user?.type === "AUC" && user.id == notification.auctionnaire_id) ||
          (user?.type === "BID" && user.id in notification.bidders)
        );
      case "auction 3h left":
        return (
          (user?.type === "AUC" && user.id == notification.auctionnaire_id) ||
          (user?.type === "BID" && user.id in notification.bidders)
        );
      case "new message":
        return (
          notification.receiver === (user?.type == "ADMIN" ? "ADMIN" : user?.id)
        );

      default:
        return false;
    }
  };

  const onSeenNotifications = () => {
    const batch = writeBatch(db);

    // Define the documents to update
    for (const i of newNotifs) {
      batch.update(doc(db, "notifications", i.uid || ""), {
        hasRead: arrayUnion(user?.type === "ADMIN" ? "ADMIN" : user?.id),
      });
    }
    // Commit the write batch
    batch
      .commit()
      .then(() => {
        console.log("Batch write successful!");
      })
      .catch((error) => {
        console.error("Error writing batch: ", error);
      });
  };
  useEffect(() => {
    let unsubscribe;
    if (user) {
      const dateLimit = new Date(moment().subtract(7, "days").format());

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
        const ni = querySnapshot.docs
          .map((doc) => ({ ...doc.data(), uid: doc.id } as TNotification))
          .filter((qs) => isIllegible(qs));

        setNotifications(ni.map((n) => showNotification(n)));
        setnewNotifs(
          ni.filter((qs) => {
            if (qs.hasRead) {
              if (
                qs.hasRead.includes(user?.type === "ADMIN" ? "ADMIN" : user.id)
              ) {
                return false;
              }
            }
            return true;
          })
        );
      });
    }

    return unsubscribe;
  }, [user]);

  return {
    notifications,
    newNotifs,
    onSeenNotifications,
    num: newNotifs.length,
  };
};
type TypeLang = "common" | "pages" | "dashboard";
type FileLang = "common" | "pages" | "dashboard" | TypeLang[];
export const useLang = (
  params:
    | {
        selector: string;
        file: FileLang;
      }
    | undefined
) => {
  const { t } = useTranslation(params?.file);
  const text = (s: string) => t(params ? params.selector + "." + s : s);
  return { text };
};

export const LangContext = createContext<(s: string) => string>(() => "");
export const LangCommonContext = createContext<(s: string) => string>(() => "");

export const useNotif = () => {
  const { text: common } = useLang(undefined);
  return {
    error(callback?: () => void) {
      notif.error(common("toast.error"));
      if (callback) callback();
    },
    succes(callback?: () => void) {
      notif.success(common("toast.success"));
      if (callback) callback();
    },
    loading(callback?: () => void) {
      notif.loading(common("toast.loading"));
      if (callback) callback();
    },
  };
};
