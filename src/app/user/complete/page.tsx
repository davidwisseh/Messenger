"use client";

import { app } from "@/app/fb";
import LoadingPage from "@/components/LoadingPage";
import Profile from "@/components/Profile/Profile";
import { UserObj } from "@/util/util";
import { useUser } from "@clerk/nextjs";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const user = useUser();
  const db = getFirestore(app);
  const [dbUser, setDbUser] = useState<UserObj | undefined>(undefined);
  const router = useRouter();
  useEffect(() => {
    if (user.isLoaded) {
      if (!user.isSignedIn) {
        router.push("/Welcome");
      } else {
        const unsub = onSnapshot(doc(db, "Users", user.user.id), (snap) => {
          if (snap.get("userName")) {
            router.push("/");
          } else {
            setDbUser(snap.data() as UserObj);
          }
        });
        return () => {
          unsub();
        };
      }
    }
  }, [user.isLoaded, router]);
  if (dbUser) {
    return (
      <div className="w-full h-full">
        <Profile />
      </div>
    );
  } else {
    return <LoadingPage />;
  }
};
export default Page;
