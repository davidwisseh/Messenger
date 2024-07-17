"use client";
import { app } from "@/app/fb";
import { SignedIn, SignOutButton, UserButton, useUser } from "@clerk/nextjs";
import { doc, getDoc, getFirestore, onSnapshot } from "firebase/firestore";
import { MutableRefObject, useEffect, useState } from "react";
import { Chat, UserObj } from "../../util/util";
import ChatBox from "../ChatBox/ChatBox";
import MaxWidthWrapper from "../MaxWidthWrapper";
import Message from "../Message/Message";
import { SearchIcon } from "lucide-react";
import SearchBar from "../SearchBar/SearchBar";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import { makeEmptyChat } from "./actions";

const ChatTemp = ({
  dbUser,
  toUser,
}: {
  dbUser: UserObj;
  toUser: MutableRefObject<string>;
}) => {
  const [chats, setChats] = useState();
  const db = getFirestore();

  const handleCLick = () => {
    if (!toUser.current) {
      toast({ title: "No User", variant: "destructive" });
    } else if (dbUser.blockedBy.includes(toUser.current)) {
      toast({ title: "Blocked by User", variant: "destructive" });
    } else if (!dbUser.messaged.every((me) => me.user !== toUser.current)) {
      toast({
        title: "Messaged Already",
        variant: "destructive",
      });
    } else {
      makeEmptyChat(toUser.current);
    }
  };

  return (
    <>
      <div className="m-auto w-[80%] h-max relative">
        <MaxWidthWrapper className="justify-center items-start  gap-2 ">
          <div className="pt-2">
            <SearchIcon></SearchIcon>
          </div>
          <SearchBar
            className="h-full "
            toUser={toUser}
            dbUser={dbUser}
          ></SearchBar>
          <Button onClick={() => handleCLick()}>Chat</Button>
        </MaxWidthWrapper>
        {dbUser.messaged
          .map((messaged) => {
            return (
              <ChatBox
                dbUser={dbUser}
                messaged={messaged}
                key={messaged.chat}
              />
            );
          })
          .reverse()}
      </div>
      <SignedIn>
        <UserButton></UserButton>
      </SignedIn>
    </>
  );
};

export default ChatTemp;
