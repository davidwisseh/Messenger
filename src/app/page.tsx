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
  getDocs,
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

import SearchBar from "@/components/SearchBar/SearchBar";

export default function Home() {
  const user = useUser();
  const [dbUser, setDbUser] = useState<null | UserObj>(null);
  const [contacts, setContacts] = useState<string[] | undefined>(undefined);
  const [chats, setChats] = useState<undefined | string[]>(undefined);

  const router = useRouter();
  useEffect(() => {
    if (user.isSignedIn) {
      const db = getFirestore(app);
      const u = onSnapshot(doc(db, "Users", user.user.id), (d) => {
        const dbUserTemp = d.data();
        setDbUser(dbUserTemp as UserObj);
      });
      return () => {
        u();
      };
    }
    return () => {};
  }, [user.isSignedIn]);
  const db = getFirestore(app);

  if (user.isLoaded) {
    if (user.isSignedIn) {
      if (dbUser) {
        return (
          <div className="h-screen w-screen pt-16">
            <ChatTemp dbUser={dbUser}></ChatTemp>
          </div>
        );
      }
      return <></>;
    }
    return <></>;
  }
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Loader2Icon className="animate-spin"></Loader2Icon>
    </div>
  );
}
