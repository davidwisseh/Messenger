"use client";
import { useEffect, useState } from "react";
import MaxWidthWrapper from "../MaxWidthWrapper";
import { Chat, Messaged, UserName } from "@/util/util";
import { doc, getDoc, getFirestore, onSnapshot } from "firebase/firestore";
import { app } from "@/app/fb";
import { Avatar, AvatarImage } from "../ui/avatar";

const ChatBox = ({ messaged }: { messaged: Messaged }) => {
  const [chatObj, setChatObj] = useState<null | Chat>();
  const [db, setDb] = useState(getFirestore(app));
  const [imageUrl, setImageUrl] = useState<string>("");
  useEffect(() => {
    getDoc(doc(db, "UserNames", messaged.user)).then((doc) => {
      const username = doc.data() as UserName;
      setImageUrl(username.imageUrl);
    });
    const unsub = onSnapshot(
      doc(db, "Chats", messaged.chat),
      (snap) => {
        setChatObj(snap.data() as Chat);
      },
      (err) => {
        console.log(err);
        console.log(messaged.chat);
      }
    );

    return () => {
      unsub();
    };
  }, []);

  return (
    chatObj && (
      <MaxWidthWrapper className="mt-14 border-t-[1px] border-gray-200/50 shadow-md rounded-md">
        <Avatar>
          <AvatarImage src=""></AvatarImage>
        </Avatar>
      </MaxWidthWrapper>
    )
  );
};
export default ChatBox;
