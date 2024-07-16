"use server";
import { Chat, Message, Messaged, UserObj } from "@/util/util";
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
var AES = require("crypto-js/aes");
import { app } from "../../app/fb";
import { nanoid } from "nanoid";
import { currentUser } from "@clerk/nextjs/server";
export const sendMessage = async ({
  message,
  to,
}: {
  message: string;
  to: string;
}) => {
  const user = await currentUser();
  if (!user) {
    throw new Error("Not Logged In");
    return;
  }
  const { id } = user;
  const messId = nanoid();
  const db = getFirestore(app);
  const dbUser = (await getDoc(doc(db, "Users", id))).data() as UserObj;
  const toUser = (await getDoc(doc(db, "Users", to === "me" ? id : to))).data();
  if (!toUser) {
    throw new Error("No user");
    return;
  }

  if (dbUser.blockedBy?.includes(to)) {
    throw new Error("Blocked By User");
    return;
  }

  let chat = dbUser.messaged?.find(
    (mess) => mess.user === (to === "me" ? id : to)
  )?.chat;
  if (!chat) {
    chat = nanoid();
    const messObj: Message = {
      time: Date.now(),
      to: to === "me" ? id : to,
      message: AES.encrypt(message, chat).toString(),
      from: id,
      read: false,
      id: messId,
    };
    await setDoc(doc(db, "Chats", chat), { messages: [messObj] } as Chat);
    await updateDoc(doc(db, "Users", id), {
      messaged: arrayUnion({
        chat: chat,
        user: to === "me" ? id : to,
      } as Messaged),
      chats: arrayUnion(chat),
    });
    await updateDoc(doc(db, "Users", to === "me" ? id : to), {
      messaged: arrayUnion({ chat: chat, user: id }),
      chats: arrayUnion(chat),
    });
  } else {
    const messObj: Message = {
      time: Date.now(),
      to: to === "me" ? id : to,
      message: AES.encrypt(message, chat).toString(),
      from: id,
      read: false,
      id: messId,
    };
    await updateDoc(doc(db, "Chats", chat), {
      messages: arrayUnion(messObj),
    });
  }
};
