"use server";
import { Chat, Message, UserObj } from "@/util/util";
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
  if (dbUser.blockedBy?.includes(to)) {
    throw new Error("Blocked By User");
    return;
  }

  const messObj: Message = {
    time: Date.now(),
    to: to === "me" ? id : to,
    message,
    from: id,
    read: false,
    id: messId,
  };

  let chat = dbUser.messaged?.find((mess) => mess.user === to)?.chat;
  if (!chat) {
    chat = nanoid();
    await setDoc(doc(db, "Chats", chat), { messages: [messObj] } as Chat);
    await updateDoc(doc(db, "Users", id), {
      messaged: arrayUnion(to),
    });
    await updateDoc(doc(db, "Users", to), {
      messaged: arrayUnion(id),
    });
  } else {
    await updateDoc(doc(db, "Chats", chat), {
      messages: arrayUnion(messObj),
    });
  }
};
