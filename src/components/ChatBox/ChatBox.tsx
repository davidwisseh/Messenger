"use client";
import { useEffect, useState } from "react";
import MaxWidthWrapper from "../MaxWidthWrapper";
import { Chat } from "@/util/util";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import { app } from "@/app/fb";
import { Avatar, AvatarImage } from "../ui/avatar";

const ChatBox = ({ chat }: { chat: string }) => {
  const [chatObj, setChatObj] = useState<null | Chat>();
  const [db, setDb] = useState(getFirestore(app));
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "Chats", chat),
      (snap) => {
        setChatObj(snap.data() as Chat);
      },
      (err) => {
        console.log(err);
        console.log(chat);
      }
    );

    return () => {
      unsub();
    };
  }, []);

  return (
    <MaxWidthWrapper className="mt-14 border-t-[1px] border-gray-200/50 shadow-md rounded-md">
      <Avatar>
        <AvatarImage src=""></AvatarImage>
      </Avatar>
    </MaxWidthWrapper>
  );
};
export default ChatBox;
