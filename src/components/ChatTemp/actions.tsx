"use server";

import { app } from "@/app/fb";
import { Messaged, UserObj } from "@/util/util";
import { currentUser } from "@clerk/nextjs/server";
import { arrayUnion, doc, getFirestore, updateDoc } from "firebase/firestore";
import { nanoid } from "nanoid";

export const makeEmptyChat = async (to: string) => {
  const user = await currentUser();
  const db = getFirestore(app);
  const chat = nanoid();
  if (user) {
    updateDoc(doc(db, "Users", to), {
      messaged: arrayUnion({ chat, user: user?.id } as Messaged),
      chats: arrayUnion(chat),
    }),
      updateDoc(doc(db, "Users", user!.id), {
        messaged: arrayUnion({ chat, user: to } as Messaged),
        chats: arrayUnion(chat),
      });
  }
};
