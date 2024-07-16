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
  console.log(user);
};
