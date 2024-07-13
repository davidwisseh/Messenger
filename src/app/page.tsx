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

export default function Home() {
  const user = useUser();
  let string = "";
  if (user.isSignedIn) {
    string = JSON.stringify(user.user);
  }
  return (
    <>
      <Navbar user={string}></Navbar>

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
