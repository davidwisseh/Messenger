"use client";
import { useEffect, useRef, useState } from "react";
import MaxWidthWrapper from "../MaxWidthWrapper";
import { Chat, Messaged, UserName, UserObj } from "@/util/util";
import { doc, getDoc, getFirestore, onSnapshot } from "firebase/firestore";
import { app } from "@/app/fb";
import { Avatar, AvatarImage } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import DefUser from "../DefUser";
import Message from "../Message/Message";
import { useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
var AES = require("crypto-js/aes");
var enc = require("crypto-js/enc-utf8");

const ChatBox = ({
  messaged,
  dbUser,
}: {
  messaged: Messaged;
  dbUser: UserObj;
}) => {
  const [chatObj, setChatObj] = useState<null | Chat>(null);
  const [db, setDb] = useState(getFirestore(app));
  const [toUser, setToUser] = useState<UserName | null>(null);
  const chatDivRef = useRef<HTMLDivElement | undefined>(undefined);

  useEffect(() => {
    getDoc(doc(db, "UserNames", messaged.user)).then((doc) => {
      const username = doc.data() as UserName;
      setToUser(username);
    });
    const unsub = onSnapshot(
      doc(db, "Chats", messaged.chat),
      (snap) => {
        const data = snap.data();
        const { messages } = data as Chat;
        const decMess = messages.map((mes) => {
          return {
            ...mes,
            message: AES.decrypt(mes.message, messaged.chat).toString(enc),
          };
        });

        setChatObj({ ...data, messages: decMess } as Chat);
      },
      (err) => {
        console.log(err.message);
        console.log(messaged.chat);
      }
    );

    return () => {
      unsub();
    };
  }, []);

  const handleLoad = () => {
    chatDivRef.current!.scrollTop = chatDivRef.current!.scrollHeight;
  };

  return (
    chatObj && (
      <div className="flex flex-col mt-10 border-t-[1px]  border-gray-200/50 shadow-md rounded-md">
        <MaxWidthWrapper className="">
          <Avatar className="transition  hover:ring ring-slate-500/50 hover:scale-110">
            <AvatarImage src={toUser?.image_url}></AvatarImage>
            <AvatarFallback className="w-10 h-10">
              <DefUser></DefUser>
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col w-fit h-full   ml-2   items-start   mr-4">
            <p className="font-semibold">{toUser?.displayName}</p>
            <p className="text-xs text-slate-500">@{toUser?.name}</p>
          </div>
        </MaxWidthWrapper>
        {
          //@ts-ignore
          <div ref={chatDivRef} className="max-h-[50vh]  overflow-y-scroll">
            {chatObj.messages.map((messa) => {
              return (
                <MaxWidthWrapper
                  className={`shadow-sm items-end ${
                    messa.from === dbUser.id ? "flex-row-reverse" : ""
                  }`}
                  key={messa.id}
                >
                  <Avatar className="transition mr-2 hover:ring ring-slate-500/50 hover:scale-110">
                    <AvatarImage
                      onLoad={() => handleLoad()}
                      src={
                        messa.from === dbUser.id
                          ? dbUser.img_url
                          : toUser?.image_url
                      }
                    ></AvatarImage>
                    <AvatarFallback className="w-10 h-10">
                      <DefUser></DefUser>
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col w-fit h-full hidden      items-start   mr-4">
                    <p className="font-semibold">
                      {messa.from === dbUser.id
                        ? dbUser.displayName
                        : toUser?.displayName}
                    </p>
                    <p className="text-xs text-slate-500">
                      @
                      {messa.from === dbUser.id
                        ? dbUser.userName
                        : toUser?.name}
                    </p>
                  </div>
                  <div
                    className={cn(
                      " overflow-hidden flex  flex-col justify-end ",
                      messa.from === dbUser.id ? "mr-auto" : "ml-auto"
                    )}
                  >
                    <p className=" break-words">{messa.message}</p>
                  </div>
                  <span
                    className={cn(
                      "text-[8px]  w-fit text-nowrap  text-slate-500",
                      messa.from === dbUser.id ? "mr-2" : "ml-2"
                    )}
                  >
                    {new Date(
                      chatObj.messages.at(-1)?.time!
                    ).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "numeric",
                    })}
                  </span>
                </MaxWidthWrapper>
              );
            })}
          </div>
        }
        <div className="p-4">
          <Message toUser={toUser?.id!}></Message>
        </div>
      </div>
    )
  );
};
export default ChatBox;
