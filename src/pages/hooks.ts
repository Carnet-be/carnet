import { db } from "@utils/firebase";
import { query, collection, where, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";

export const useNotifyMe = ({uid}:{uid:string}) => {
    console.log("useNotifyMe",uid)
  useEffect(() => {
    const q = query(
      collection(db, "notifications"),
    //   where(`audiences.${uid}`, "==", true)
    );
const unsubscribe = onSnapshot(q, (querySnapshot) => {

        querySnapshot.docChanges().forEach((change) => {
          
            if (change.type === "added") {
                console.log("New city: ", change.doc.data());
            }
            if (change.type === "modified") {
                console.log("Modified city: ", change.doc.data());
            }
            if (change.type === "removed") {
                console.log("Removed city: ", change.doc.data());
            }   
        });
    });

    return unsubscribe;
  }, []);
};
