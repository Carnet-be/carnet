/* eslint-disable @typescript-eslint/no-explicit-any */
import { TNotification } from "@model/type";
import { db } from "@utils/firebase";
import { addDoc, collection, onSnapshot, Timestamp } from "firebase/firestore";

//function that add a doc to firestore

export const sendNotification = async (data: TNotification) =>
  addDoc(collection(db, "notifications"), {
    ...data,
    date: Timestamp.fromDate(data.date),
    hasRead: [],
  });

type TId = "ADMIN" | string;
export type TMessage = {
  date: Date;
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

export const getMessages = async ({
  id,
  setMessage,
}: {
  id: TId;
  setMessage: (msg: TMessage[]) => void;
}) => {
  const messages = collection(db, "messages");

  onSnapshot(messages, (querySnapshot) => {
    const msg = querySnapshot.docs
      .filter((d) => d.data().receiver === id || d.data().sender === id)
      .map((d) => ({
        ...d.data(),
      })).sort((a, b) => a.date - b.date);
    setMessage(msg.map((m)=>({...m,date:m.date.toDate()})) as TMessage[]);
  });
};
