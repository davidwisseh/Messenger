"use client";
import { useUser } from "@clerk/nextjs";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";

import { UserObj } from "@/util/util";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ChatTemp from "../components/ChatTemp/ChatTemp";
import { app } from "./fb";

import LoadingPage from "@/components/LoadingPage";
import NavCol from "@/components/NavCol";
import { useTheme } from "next-themes";
import Profile from "@/components/Profile/Profile";
import { cn } from "@/lib/utils";
import Search from "@/components/Search/Search";

export default function Home() {
  const navRef = useRef<HTMLDivElement>();
  const user = useUser();
  const [dbUser, setDbUser] = useState<null | UserObj>(null);

  const [chat, setChat] = useState<string>("");
  const chatTo = useRef<string>("");
  const dbUserRef = useRef<UserObj | undefined>(undefined);
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [page, setPage] = useState<string>("Chat");

  useEffect(() => {
    let u = () => {};
    console.log("here");
    if (user.isLoaded && !user.isSignedIn) {
      router.push("/Welcome");
    }

    if (user.user) {
      if (!dbUser) {
        const db = getFirestore(app);
        u = onSnapshot(
          doc(db, "Users", user.user.id),
          (d) => {
            const dbUserTemp = d.data() as UserObj;
            if (!dbUserTemp.userName) {
              router.push(`/user/complete/`);
            } else {
              setDbUser(dbUserTemp);
              dbUserRef.current = dbUserTemp;
            }
          },
          (e) => {
            console.error(e);
          }
        );
      }
    }

    return () => {
      u();
    };
  }, [user.user, router]);
  const db = getFirestore(app);

  if (dbUser?.userName) {
    return (
      <div className="flex h-full w-full  flex-col-reverse sm:flex-row bg-gray-100 dark:bg-gray-900">
        <NavCol dbUser={dbUser} page={page} setPage={setPage} navRef={navRef} />
        {
          <div className={cn("h-full w-full ", { hidden: page !== "Chat" })}>
            <ChatTemp
              selected={chat}
              setSelected={setChat}
              navRef={navRef}
              toUser={chatTo}
              dbUser={dbUser}
            ></ChatTemp>
          </div>
        }
        {page === "Profile" && <Profile DUser={dbUser} />}
        {page === "Search" && (
          <Search setPage={setPage} setSelected={setChat} dbUser={dbUser} />
        )}
      </div>
    );
  }

  return <LoadingPage />;
}
