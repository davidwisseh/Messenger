"use server";
import { Message } from "@/util/util";
import { currentUser } from "@clerk/nextjs/server";
import { getFirestore, collection, setDoc, doc } from "firebase/firestore";
import nanoid from "nanoid";

export const sendMessage = async ({
  message,
  to,
}: {
  message: string;
  to: string;
}) => {
  const user = await currentUser();

  const messObj: Message = {
    time: Date.now(),
    to: to === "me" ? user?.id! : to,
    message,
    from: user?.id!,
    read: false,
  };
  const db = getFirestore();

  setDoc(doc(db, "Messages", nanoid.nanoid()), messObj);
};
