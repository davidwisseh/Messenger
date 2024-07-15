"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import MessageTable from "@/components/MessageTable/MessageTable";
import { currentUser } from "@clerk/nextjs/server";
import Message from "../components/Message/Message";
import Navbar from "../components/NavBar";
import Tess from "@/components/test";
import {
  getFirestore,
  query,
  collection,
  onSnapshot,
  getDoc,
  doc,
  where,
} from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import { json } from "stream/consumers";
import { useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";
import { app } from "./fb";
import { UserObj } from "@/util/util";
import ChatTemp from "../components/ChatTemp/ChatTemp";
import { Router } from "next/router";
import { useRouter } from "next/navigation";

export default function Home() {
  const user = useUser();
  const [dbUser, setDbUser] = useState<null | UserObj>(null);
  const router = useRouter();
  useEffect(() => {
    if (user.user) {
      const db = getFirestore(app);
      const u = getDoc(doc(db, "Users", user.user.id)).then((d) => {
        setDbUser(d.data() as UserObj);
      });
    }
  }, [user.user]);

  if (user.isLoaded) {
    // if (user.isSignedIn && dbUser) {
    //   if (!dbUser.complete) {
    //     router.push(`/user/${user.user.id}/profile/complete`);
    //   } else {
    //     return (
    //       <div className="h-screen w-screen pt-14">
    //         <ChatTemp></ChatTemp>
    //       </div>
    //     );
    //   }
    // } else {
    //   return <></>;
    // }
    return (
      <div className="h-screen w-screen pt-14">
        <ChatTemp></ChatTemp>
      </div>
    );
  }
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Loader2Icon className="animate-spin"></Loader2Icon>
    </div>
  );
}
