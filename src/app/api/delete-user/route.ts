import { app } from "@/app/fb";
import { UserObj } from "@/util/util";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { deleteDoc, doc, getDoc, getFirestore } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function DELETE() {
  const db = getFirestore(app);
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ message: "No User" });
  } else {
    try {
      await clerkClient.users.deleteUser(userId);
      const user = (await getDoc(doc(db, "Users", userId))).data() as UserObj;
      const { messaged } = user;
      messaged.forEach(async (m) => {
        await deleteDoc(doc(db, "Chats", m.chat));
      });
      await deleteDoc(doc(db, "Users", userId));
      return NextResponse.json({ message: "User deleted" });
    } catch (error) {
      console.log(error);
      return NextResponse.json({ error: "Error deleting user" });
    }
  }
}
