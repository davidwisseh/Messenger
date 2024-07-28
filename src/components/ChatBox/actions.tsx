"use server";

import { app } from "@/app/fb";
import { UserObj } from "@/util/util";
import { currentUser } from "@clerk/nextjs/server";
import {
  arrayRemove,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export const deleteChat = async (to: string) => {
  const db = getFirestore(app);
  const user = await currentUser();
  if (!user) {
    return new Response("NO USER", { status: 400 });
  }
  const { messaged } = (
    await getDoc(doc(db, "Users", user?.id))
  ).data() as UserObj;
  const chat = messaged.find((mess) => mess.user == to)?.chat;
  if (!chat) {
    return new Response("NO CHAT", { status: 400 });
  }
  await updateDoc(doc(db, "Users", to), {
    messaged: arrayRemove({
      chat: chat,
      user: user.id,
    }),
  });
  await updateDoc(doc(db, "Users", user.id), {
    messaged: arrayRemove({
      chat: chat,
      user: to,
    }),
  });
  return new Response("Ok", { status: 200 });
};
