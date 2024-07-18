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

export default function Home() {
  const navRef = useRef<HTMLDivElement>();
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
  }, [user.user, router]);
  const db = getFirestore(app);

  if (dbUser?.userName) {
    return (
      <div className="flex h-screen w-screen  flex-col-reverse sm:flex-row bg-gray-100 dark:bg-gray-900">
        <div
          //@ts-ignore
          ref={navRef}
          className={cn(
            "     sm:flex    flex-col dark:bg-slate-900/80 brightness-125 sm:w-40 bg-gray-600/20 border-t-2 sm:border-t-0 sm:border-r-2 border-black/20 shadow-lg h-14 w-full sm:h-full"
          )}
        >
          <div className="ml-auto px-2 my-2 mt-auto">
            <SignedIn>
              <UserButton></UserButton>
            </SignedIn>
          </div>
        </div>
        <ChatTemp navRef={navRef} toUser={chatTo} dbUser={dbUser}></ChatTemp>
      </div>
    );
  }
  return <LoadingPage />;
}
