"use server";
import { Message } from "@/util/util";
import { currentUser } from "@clerk/nextjs/server";
import { firestore } from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

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
  await db.collection("Messages").add(messObj);
};
