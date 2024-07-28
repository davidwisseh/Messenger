"use server";

import { app } from "@/app/fb";
import { UserObj } from "@/util/util";
import { currentUser } from "@clerk/nextjs/server";
import { error } from "console";
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
    throw new Error("No User");
  }
  const { messaged } = (
    await getDoc(doc(db, "Users", user?.id))
  ).data() as UserObj;
  const chat = messaged.find((mess) => mess.user == to)?.chat;
  if (!chat) {
    throw new Error("No Chat");
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
};
