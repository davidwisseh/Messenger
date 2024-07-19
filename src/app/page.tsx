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
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";

import { json } from "stream/consumers";
import { LegacyRef, useEffect, useRef, useState } from "react";
import { Loader2Icon, SearchIcon } from "lucide-react";
import { app } from "./fb";
import { Messaged, UserObj, UserObjStr } from "@/util/util";
import ChatTemp from "../components/ChatTemp/ChatTemp";
import { Router } from "next/router";
import { useRouter } from "next/navigation";

import SearchBar from "@/components/SearchBar/SearchBar";
import { Button } from "@/components/ui/button";
import LoadingPage from "@/components/LoadingPage";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import NavCol from "@/components/NavCol";

export default function Home() {
  const navRef = useRef<HTMLDivElement>();
  const user = useUser();
  const [dbUser, setDbUser] = useState<null | UserObj>(null);
  const [contacts, setContacts] = useState<string[] | undefined>(undefined);
  const [chats, setChats] = useState<undefined | string[]>(undefined);
  const chatTo = useRef<string>("");
  const dbUserRef = useRef<UserObj | undefined>(undefined);
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [page, setPage] = useState<string>("Chat");
  function isMobile() {
    const regex =
      /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return regex.test(navigator.userAgent);
  }
  console.log(isMobile());
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
  }, [user, router]);
  const db = getFirestore(app);

  if (dbUser?.userName) {
    return (
      <div className="flex h-screen w-full  flex-col-reverse sm:flex-row bg-gray-100 dark:bg-gray-900">
        <NavCol dbUser={dbUser} page={page} setPage={setPage} navRef={navRef} />
        {page == "Chat" && (
          <ChatTemp navRef={navRef} toUser={chatTo} dbUser={dbUser}></ChatTemp>
        )}
      </div>
    );
  }

  return <LoadingPage />;
}
