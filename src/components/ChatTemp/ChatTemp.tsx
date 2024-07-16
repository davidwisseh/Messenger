"use client";
import { app } from "@/app/fb";
import { useUser } from "@clerk/nextjs";
import { getFirestore } from "firebase/firestore";
import { MutableRefObject, useState } from "react";
import { UserObj } from "../../util/util";
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
  const [users, setUsers] = useState<string[] | undefined>(undefined);
  const user = useUser();
  const db = getFirestore(app);
  const handleCLick = () => {
    if (!toUser.current) {
      toast({ title: "No User", variant: "destructive" });
    } else if (dbUser.blockedBy.includes(toUser.current)) {
      toast({ title: "Blocked by User", variant: "destructive" });
    } else {
      makeEmptyChat(toUser.current);
    }
  };

  return (
    <>
      <div className="m-auto w-[80%] h-max relative">
        <MaxWidthWrapper className="justify-center gap-2 items-center">
          <SearchIcon></SearchIcon>
          <SearchBar
            className="h-full"
            toUser={toUser}
            dbUser={dbUser}
          ></SearchBar>
          <Button onClick={() => handleCLick()}>Chat</Button>
        </MaxWidthWrapper>
        {dbUser.messaged.map((messaged) => {
          return (
            <ChatBox dbUser={dbUser} messaged={messaged} key={messaged.chat} />
          );
        })}
      </div>
    </>
  );
};

export default ChatTemp;
