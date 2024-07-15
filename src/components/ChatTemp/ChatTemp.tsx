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

const ChatTemp = () => {
  const user = useUser();
  const db = getFirestore(app);
  const [dbUser, setDbUser] = useState<null | UserObj>(null);
  const [chats, setChats] = useState<undefined | string[]>(undefined);
  useEffect(() => {
    onSnapshot(doc(db, "Users", user.user!.id), (d) => {
      const data = d.data() as UserObj;
      setDbUser(data);
      setChats(data.chats);
      console.log(data);
    });
  }, []);

  return (
    <>
      <div className="m-auto w-[80%] h-max relative">
        <MaxWidthWrapper className="mt-14 shadow-md rounded-md">
          <Message></Message>
        </MaxWidthWrapper>
      </div>
      {chats && chats?.length > 0 && (
        <div className="m-auto w-[80%] h-max relative">
          {chats?.map((chat) => {
            return (
              <MaxWidthWrapper
                key={chat}
                className="mt-14 shadow-md rounded-md"
              >
                <MessageTable chat={chat}></MessageTable>
              </MaxWidthWrapper>
            );
          })}
        </div>
      )}
    </>
  );
};

export default ChatTemp;
