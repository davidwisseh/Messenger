"use client";
import { app } from "@/app/fb";
import { useUser } from "@clerk/nextjs";
import { getFirestore } from "firebase/firestore";
import { useState } from "react";
import { UserObj } from "../../util/util";
import ChatBox from "../ChatBox/ChatBox";
import MaxWidthWrapper from "../MaxWidthWrapper";
import Message from "../Message/Message";

const ChatTemp = ({ dbUser }: { dbUser: UserObj }) => {
  const [users, setUsers] = useState<string[] | undefined>(undefined);
  const user = useUser();
  const db = getFirestore(app);

  return (
    <>
      <div className="m-auto w-[80%] h-max relative">
        <MaxWidthWrapper className="shadow-md border-t-[1px] border-gray-200/50 rounded-md">
          <Message dbUser={dbUser}></Message>
        </MaxWidthWrapper>
      </div>

      <div className="m-auto w-[80%] h-max relative">
        {dbUser.messaged.map((messaged) => {
          return <ChatBox messaged={messaged} key={messaged.chat} />;
        })}
      </div>
    </>
  );
};

export default ChatTemp;
