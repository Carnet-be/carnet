/* eslint-disable @typescript-eslint/no-explicit-any */
import { TNotification } from "@model/type";
import { db } from "@utils/firebase";
import { addDoc, collection, deleteDoc, doc, onSnapshot, Timestamp, Unsubscribe } from "firebase/firestore";

//function that add a doc to firestore
type Collection= "notifications" | "messages"
export const sendNotification = async (data: TNotification) =>
  addDoc(collection(db, "notifications"), {
    ...data,
    date: Timestamp.fromDate(data.date),
    hasRead: [],
  });

type TId = "ADMIN" | string;
export type TMessage = {
  date: Date;
  uid: string;
  sender: TId;
  receiver: TId;
  content: string;
  senderRead: boolean;
  receiverRead: boolean;
};
export const sendMessage = (data: {
  sender: TId;
  receiver: TId;
  content: string;
}) =>
  addDoc(collection(db, "messages"), {
    ...data,
    date: Timestamp.fromDate(new Date()),
    senderRead: true,
    receiverRead: false,
  });

export const getMessages = ({
  id,
  setMessage,
}: {
  id: TId;
  setMessage: (msg: TMessage[]) => void;
}):Unsubscribe => {
  const messages = collection(db, "messages");

  const unsubscribe=onSnapshot(messages, (querySnapshot) => {
    const msg:TMessage[] = querySnapshot.docs
      .filter((d) => d.data().receiver === id || d.data().sender === id)
      .map((d) => ({
        uid: d.id,
        ...d.data(),
      }) as TMessage).sort((a:any, b:any) => a.date - b.date);
    setMessage(msg.map((m)=>({...m,date:(m.date as any).toDate()})) as TMessage[]);
  });
  return unsubscribe
};


//delete a doc from firestore

export const deleteDocument = async (col:Collection,id:string) => {
  await deleteDoc(doc(db, col, id));
};