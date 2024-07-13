"use server";
import { Message } from "@/util/util";
import {
  collection,
  doc,
  getFirestore,
  setDoc,
  query,
  where,
  updateDoc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import { app } from "../../app/fb";
import { nanoid } from "nanoid";
export const sendMessage = async ({
  message,
  to,
  id,
}: {
  message: string;
  to: string;
  id: string;
}) => {
  const messId = nanoid();
  const messObj: Message = {
    time: Date.now(),
    to: to === "me" ? id : to,
    message,
    from: id,
    read: false,
    id: messId,
  };
  const db = getFirestore(app);
  console.log(messObj);
  const q = doc(db, "Messages", messId);
  const q1 = doc(db, "Users", id);

  await setDoc(q, messObj).catch((err) => {
    console.error(err);
  });
  await updateDoc(q1, {
    messages: arrayUnion(messId),
  });
};
