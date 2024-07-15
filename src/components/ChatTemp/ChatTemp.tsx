"use client";
import { app } from "@/app/fb";
import { doc, getDoc, getFirestore, onSnapshot } from "firebase/firestore";
import { UserObj } from "../../util/util";
import { useUser } from "@clerk/nextjs";
import MaxWidthWrapper from "../MaxWidthWrapper";
import Message from "../Message/Message";
import MessageTable from "../MessageTable/MessageTable";
import { currentUser } from "@clerk/nextjs/server";
import { useEffect, useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import Chat from "../Chat/Chat";

const ChatTemp = ({ dbUser }: { dbUser: UserObj }) => {
  const [users, setUsers] = useState<string[] | undefined>(undefined);
  const user = useUser();
  const db = getFirestore(app);

  const [chats, setChats] = useState<undefined | string[]>(undefined);

  return (
    <>
      <SearchBar dbUser={dbUser}></SearchBar>
      <div className="m-auto w-[80%] h-max relative">
        <MaxWidthWrapper className="shadow-md border-t-[1px] border-gray-200/50 rounded-md">
          <Message></Message>
        </MaxWidthWrapper>
      </div>
      {chats && chats?.length > 0 && (
        <div className="m-auto w-[80%] h-max relative">
          {chats?.map((chat) => {
            return <Chat key={chat} />;
          })}
        </div>
      )}
    </>
  );
};

export default ChatTemp;
