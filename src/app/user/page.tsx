"use client";

import { useUser } from "@clerk/nextjs";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import { app } from "../fb";
import { useEffect, useState } from "react";
import { UserObj } from "@/util/util";
import { useRouter } from "next/navigation";
import LoadingPage from "@/components/LoadingPage";

const User = () => {
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
          if (!snap.get("userName")) {
            router.push("/user/complete/");
          }
          setDbUser(snap.data() as UserObj);
        });
        return () => {
          unsub();
        };
      }
    }
  }, [user.isLoaded, router]);
  if (dbUser) {
    return <>yep</>;
  } else {
    return <LoadingPage />;
  }
};

export default User;
