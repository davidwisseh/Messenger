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
import { useEffect, useRef, useState } from "react";
import { Loader2Icon, SearchIcon } from "lucide-react";
import { app } from "./fb";
import { Messaged, UserObj, UserObjStr } from "@/util/util";
import ChatTemp from "../components/ChatTemp/ChatTemp";
import { Router } from "next/router";
import { useRouter } from "next/navigation";

import SearchBar from "@/components/SearchBar/SearchBar";
import { Button } from "@/components/ui/button";
import LoadingPage from "@/components/LoadingPage";

export default function Home() {
  const user = useUser();
  const [dbUser, setDbUser] = useState<null | UserObj>(null);
  const [contacts, setContacts] = useState<string[] | undefined>(undefined);
  const [chats, setChats] = useState<undefined | string[]>(undefined);
  const chatTo = useRef<string>("");
  const dbUserRef = useRef<UserObj | undefined>(undefined);

  const router = useRouter();
  useEffect(() => {
    if (user.isLoaded && !user.isSignedIn) {
      router.push("/Welcome");
    }
    if (user.user) {
      const db = getFirestore(app);
      const u = onSnapshot(doc(db, "Users", user.user.id), (d) => {
        const dbUserTemp = d.data() as UserObj;
        if (!dbUserTemp.userName) {
          router.push(`/user/complete/`);
        }

        setDbUser(dbUserTemp);
      });
      return () => {
        u();
      };
    }
    return () => {};
  }, [user.user]);
  const db = getFirestore(app);

  if (dbUser?.userName) {
    return (
      <div>
        <div className="h-screen  w-screen overflow-y-scroll pt-16">
          <ChatTemp toUser={chatTo} dbUser={dbUser}></ChatTemp>
        </div>
      </div>
    );
  }
  return <LoadingPage />;
}
