import { TNotification } from "@model/type";
import { db } from "@utils/firebase";
import { trpc } from "@utils/trpc";
import { query, collection, where, onSnapshot, documentId } from "firebase/firestore";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useNotifStore } from "../state";

const playNotificationSound = () => {
  const audio = document.getElementById('audio') as HTMLAudioElement;

  audio.play();
};

export const useNotifyMe = ({ uid }: { uid: string }) => {
  const {notifs,add}=useNotifStore(state=>state)
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
    switch (notification.type) {
      case "new auction":
        content.title = "New Auction";
        content.body = "There is a new auction";
        content.link =
          "/admin/dashboard/auctions/pending?id=" + notification.auction_id;
        break;
      case "new user":
        const isBid=notification.user_type==="BID"
        content.title = "New User"
        content.body=`There is a new ${isBid?"bidder":"auctioneer"}`
        content.link=`/admin/dashboard/users/${isBid?"bidder":"auctioneers"}?id=`+notification.user_id

      default:
        break;
    }
  console.log("content", content)
    ///
    playNotificationSound();
    toast(<Msg content={content} />, {
      delay: 550,
    });
  };

  const isIllegible = (notification: TNotification) => {
    switch (notification.type) {
      case "new auction":
      case  "new user":
        return user?.type === "ADMIN" || user?.type === "STAFF"; //TODO: check if user is admin or staff
      default:
        return false;
    }
  };
  useEffect(() => {
    let unsubscribe;
    if (user) {
      const dateLimit=new Date(moment().subtract(20, "minutes").format())
      console.log('dateLimit', dateLimit)
      const q = query(
        collection(db, "notifications"),

        where("date", ">=", dateLimit)
        //   where(`audiences.${uid}`, "==", true)
      );
      unsubscribe = onSnapshot(q, (querySnapshot) => {
  

        console.log("Notifications: ", querySnapshot.docs.map((doc) => doc.data()))
        querySnapshot.docChanges()
        //.filter((qs,i)=>i===0)
       // .filter((qs)=>!notifs.includes(qs.doc.id))
        .forEach(async (change) => {
          if (change.type === "added") {
            console.log("New city: ", change.doc.data());
            const notification = change.doc.data() as TNotification;
            if (isIllegible(notification)) {
              showNotification(notification);
              add(change.doc.id)
            }
          }
        });
      });
    }

    return unsubscribe;
  }, [user]);
};

export default function Notification() {
  return (
   <div></div>
  );
}