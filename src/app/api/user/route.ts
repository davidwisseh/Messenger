"use server";

import { app } from "@/app/fb";
import { UserName, UserObj } from "@/util/util";
import { currentUser } from "@clerk/nextjs/server";
import { doc, getFirestore, setDoc, updateDoc } from "firebase/firestore";

export const POST = async (req: Request) => {
  const res: UserName = await req.json();
  const user = await currentUser();
  if (!user) {
    return new Response("Not Signed In", { status: 400 });
  }
  const { displayName, id, image_url, name } = res;

  if (!displayName || !name || id !== user.id) {
    return new Response("Bad Data", { status: 400 });
  }

  const db = getFirestore(app);
  await setDoc(doc(db, "UserNames", id), res).catch((e) => {
    return new Response("Firebase Error", { status: 400 });
  });
  await updateDoc(doc(db, "Users", id), {
    userName: name.toLowerCase(),
    displayName: displayName,
    img_url: image_url,
  }).catch((e) => {
    return new Response("Firebase Error", { status: 400 });
  });

  return new Response("ok", { status: 200 });
};
