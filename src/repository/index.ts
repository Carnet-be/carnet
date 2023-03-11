/* eslint-disable @typescript-eslint/no-explicit-any */
import { TNotification} from "@model/type";
import { db } from "@utils/firebase";
import { addDoc, collection,Timestamp } from "firebase/firestore";

//function that add a doc to firestore

export const sendNotification = async (
  data: TNotification
) => addDoc(collection(db, "notifications"), {
    ...data,
    date: Timestamp.fromDate(data.date)
});
