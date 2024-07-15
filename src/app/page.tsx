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
} from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import { json } from "stream/consumers";
import { useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";
import { app } from "./fb";
import { UserObj } from "@/util/util";
import ChatTemp from "../components/ChatTemp/ChatTemp";

export default function Home() {
  const user = useUser();
  if (user.isLoaded) {
    return (
      <>
        <Navbar></Navbar>

        {user.isSignedIn && <ChatTemp></ChatTemp>}
      </>
    );
  }
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Loader2Icon className="animate-spin"></Loader2Icon>
    </div>
  );
}
