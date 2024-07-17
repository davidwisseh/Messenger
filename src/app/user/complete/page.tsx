"use client";

import { app } from "@/app/fb";
import DefUser from "@/components/DefUser";
import LoadingPage from "@/components/LoadingPage";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserObj } from "@/util/util";
import { useUser } from "@clerk/nextjs";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const page = () => {
  const user = useUser();
  const db = getFirestore(app);
  const [dbUser, setDbUser] = useState<UserObj | undefined>(undefined);
  const router = useRouter();
  useEffect(() => {
    if (user.isLoaded) {
      if (!user.isSignedIn) {
        router.push("/Welcome");
      } else {
        getDoc(doc(db, "Users", user.user.id)).then((doc) => {
          setDbUser(doc.data() as UserObj);
        });
      }
    }
  }, [user.isLoaded]);
  if (user.isSignedIn) {
    return (
      <div className="h-screen w-screen bg-gray-100 flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold drop-shadow-md  ">
          Complete your acount
        </h1>
        <MaxWidthWrapper className=" w-[70%] h-[70%] mt-14 bg-gray-700/30 rounded-lg">
          <div className="w-40 h-40 rounded-full mx-auto object-contain">
            <img src={user.user.imageUrl} alt="" />
          </div>
        </MaxWidthWrapper>
      </div>
    );
  }
  return <LoadingPage />;
};
export default page;
