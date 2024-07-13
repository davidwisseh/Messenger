"use server";
import { Message } from "@/util/util";
import { collection, doc, getFirestore, setDoc } from "firebase/firestore";
import { app } from "../../app/fb";
export const sendMessage = async ({
  message,
  to,
  id,
}: {
  message: string;
  to: string;
  id: string;
}) => {
  const messObj: Message = {
    time: Date.now(),
    to: to === "me" ? id : to,
    message,
    from: id,
    read: false,
  };
  const db = getFirestore(app);
  console.log(messObj);
  const newMessageRef = doc(collection(db, "Messages"));

  await setDoc(newMessageRef, messObj).catch((err) => {
    console.error(err);
  });
};
