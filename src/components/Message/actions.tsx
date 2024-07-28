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
  arrayRemove,
} from "firebase/firestore";
var AES = require("crypto-js/aes");
import { app } from "../../app/fb";
import { nanoid } from "nanoid";
import { currentUser } from "@clerk/nextjs/server";
export const sendMessage = async ({
  message,
  to,
  chatId,
}: {
  message: string;
  to: string;
  chatId?: string;
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

  let chat = dbUser.messaged.find((mess) => mess.user === to);
  if (!chat) {
    chat = { chat: chatId, user: to } as Messaged;
    await setDoc(doc(db, "Chats", chatId!), chat);
  }

  const messObj: Message = {
    time: Date.now(),
    to,
    message: AES.encrypt(message, chat.chat).toString(),
    from: id,
    read: false,
    id: messId,
  };
  await updateDoc(doc(db, "Chats", chat.chat), {
    messages: arrayUnion(messObj),
  });

  let myMessaged = (await getDoc(doc(db, "Users", id))).get(
    "messaged"
  ) as Messaged[];
  myMessaged = myMessaged.filter((me) => me.chat !== chat.chat);
  myMessaged.push(chat);
  await updateDoc(doc(db, "Users", id), {
    messaged: myMessaged,
  });

  let toMessaged = (await getDoc(doc(db, "Users", id))).get(
    "messaged"
  ) as Messaged[];
  toMessaged = toMessaged.filter((me) => me.chat !== chat.chat);
  toMessaged.push({ chat: chat.chat, user: user.id } as Messaged);
  await updateDoc(doc(db, "Users", to), {
    messaged: toMessaged,
  });
};
