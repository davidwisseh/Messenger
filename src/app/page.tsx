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
  getDocs,
  where,
} from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import { json } from "stream/consumers";
import { useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";

export default function Home() {
  const user = useUser();
  if (user.isLoaded) {
    return (
      <>
        <Navbar></Navbar>

        {user.isSignedIn && (
          <>
            <div className="m-auto w-[80%] h-max relative">
              <MaxWidthWrapper className="mt-14 shadow-md rounded-md">
                <Message></Message>
              </MaxWidthWrapper>
            </div>
            <div className="m-auto w-[80%] h-max relative">
              <MaxWidthWrapper className="mt-14 shadow-md rounded-md">
                <MessageTable type="to" userId={user.user.id}></MessageTable>
              </MaxWidthWrapper>
            </div>
            <div className="m-auto w-[80%] h-max relative">
              <MaxWidthWrapper className="mt-14 shadow-md rounded-md">
                <MessageTable type="from" userId={user.user.id}></MessageTable>
              </MaxWidthWrapper>
            </div>
          </>
        )}
      </>
    );
  }
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Loader2Icon className="animate-spin"></Loader2Icon>
    </div>
  );
}
