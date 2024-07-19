"use client";

import { app } from "@/app/fb";
import DefUser from "@/components/DefUser";
import LoadingPage from "@/components/LoadingPage";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Profile from "@/components/Profile/Profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { UserName, UserObj } from "@/util/util";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { ArrowRightCircle, Loader2Icon, PencilIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const Page = () => {
  return (
    <div className="w-full h-full">
      <Profile />
    </div>
  );
};
export default Page;
