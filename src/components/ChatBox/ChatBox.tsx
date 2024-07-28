"use client";
import { app } from "@/app/fb";
import { cn } from "@/lib/utils";
import { Chat, Messaged, UserName, UserObj } from "@/util/util";
import { doc, getDoc, getFirestore, onSnapshot } from "firebase/firestore";
import { Trash, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import "react-swipeable-list/dist/styles.css";
import DefUser from "../DefUser";
import MaxWidthWrapper from "../MaxWidthWrapper";
import Message from "../Message/Message";
import { deleteChat } from "./actions";
import { Button } from "../ui/button";

var AES = require("crypto-js/aes");
var enc = require("crypto-js/enc-utf8");

const ChatBox = ({
  messaged,
  dbUser,
  onClick,
  selected,
}: {
  messaged: Messaged;
  dbUser: UserObj;
  onClick: (isTrue: boolean) => void;
  selected: string;
}) => {
  const [deleter, setDeleter] = useState<boolean>(false);
  const mainRef = useRef<HTMLDivElement>();
  const [chatObj, setChatObj] = useState<null | Chat>(null);
  const [db, setDb] = useState(getFirestore(app));
  const [toUser, setToUser] = useState<UserName | null>(null);
  const chatDivRef = useRef<HTMLDivElement | undefined>(undefined);
  const isClosed = selected !== messaged.chat;
  const messageDate = useRef<number>(0);
  const year = new Date(Date.now()).getFullYear();
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
        console.error(err.message);
        console.error(messaged.chat);
      }
    );

    return () => {
      unsub();
    };
  }, []);

  const handleLoad = () => {
    chatDivRef.current!.scrollTop = chatDivRef.current!.scrollHeight;
  };

  if (!selected || selected == messaged.chat) {
    return (
      chatObj &&
      toUser && (
        <div
          //@ts-ignore
          ref={mainRef}
          onClick={() => {
            if (isClosed) {
              onClick(true);
              false;
            }
          }}
          className={cn(
            "flex relative   mt-5  bg-gray-600/20   border-t-[1px] w-[90%]  mx-auto border-gray-200/50 shadow-md dark:shadow-slate-800 dark:border-slate-800 dark:bg-slate-800 rounded-md",
            isClosed
              ? "max-w-screen-2xl hover:scale-105 transition"
              : "h-full flex-col w-full mt-0 dark:bg-slate-900 rounded-none"
          )}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className={cn(
              "absolute w-full h-full hidden justify-center items-center gap-5",
              { flex: deleter }
            )}
          >
            <Button
              className="hover:scale-110 transition active:scale-90"
              onClick={(e) => {
                e.stopPropagation();
                deleteChat(toUser.id);
                mainRef.current!.classList.add("hidden");
              }}
              variant={"destructive"}
            >
              Delete
            </Button>
            <Button
              className="hover:scale-110 transition active:scale-90"
              onClick={(e) => {
                e.stopPropagation();
                setDeleter(false);
              }}
            >
              Cancel
            </Button>
          </div>
          <MaxWidthWrapper className="items-end">
            <div className="pb-1 sm:pb-0">
              <DefUser img={toUser!.image_url}></DefUser>
            </div>

            <div className="flex flex-col w-fit h-full   ml-2   items-start   mr-4">
              <p className="font-semibold">{toUser?.displayName}</p>
              <p className="text-xs text-slate-500">@{toUser?.name}</p>
            </div>
            {isClosed && (
              <>
                {chatObj.messages.length > 0 && (
                  <>
                    <div
                      className={cn(
                        " overflow-hidden  flex  flex-col justify-end ml-auto"
                      )}
                    >
                      <p className="truncate ">
                        {chatObj.messages.at(-1)?.message}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "text-[8px] mb-1 w-fit text-nowrap  text-slate-500 ml-2"
                      )}
                    >
                      {new Date(
                        chatObj.messages.at(-1)?.time!
                      ).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "numeric",
                      })}
                    </span>
                  </>
                )}
              </>
            )}
            {!isClosed && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onClick(false);
                }}
                className="ml-auto hover:scale-125 active:scale-100 transition mr-2  sm:mr-4 mt-2 sm:mt-4 mb-auto "
              >
                <XIcon />
              </div>
            )}
          </MaxWidthWrapper>
          <div
            className={cn(
              "flex items-end pr-2 pb-5 hover:scale-110 transition active:scale-90 -ml-4",
              {
                hidden: !isClosed,
              }
            )}
            onClick={(e) => {
              e.stopPropagation();

              setDeleter(true);
            }}
          >
            <Trash className="text-red-700" />
          </div>
          {!isClosed && (
            //@ts-ignore
            <div
              //@ts-ignore
              ref={chatDivRef}
              onLoad={handleLoad}
              className="h-full flex flex-col dark:bg-slate-800 bg-gray-100 overflow-y-scroll "
            >
              {chatObj.messages.map((messa, i) => {
                const date = new Date(messa.time);
                const bool =
                  date.getDate() != messageDate.current ? true : false;
                messageDate.current = date.getDate();

                return (
                  <div
                    key={messa.id}
                    className={cn("flex flex-col ", i === 0 ? "mt-auto" : "")}
                  >
                    {bool && (
                      <div className="flex w-full justify-center">
                        <p className="text-nowrap text-[0.5rem] text-slate-500">
                          {date.toLocaleString("default", {
                            month: "long",
                            day: "2-digit",
                          })}
                          {date.getFullYear() != year
                            ? `, ${date.toLocaleString("default", {
                                year: "2-digit",
                              })}`
                            : ""}
                        </p>
                      </div>
                    )}

                    <MaxWidthWrapper
                      className={cn(
                        "shadow-sm relative  items-end",
                        messa.from === dbUser.id ? "flex-row-reverse" : ""
                      )}
                      key={messa.id}
                    >
                      <DefUser
                        className={
                          messa.from === dbUser.id
                            ? "ml-1 sm:ml-2"
                            : "mr-1 sm:mr-2"
                        }
                        img={
                          messa.from == dbUser.id
                            ? dbUser.img_url
                            : toUser.image_url
                        }
                      ></DefUser>

                      <div
                        className={cn(
                          " overflow-hidden flex   flex-col justify-end  ",
                          messa.from === dbUser.id ? "mr-auto" : "ml-auto"
                        )}
                      >
                        <p className=" break-words">{messa.message}</p>
                      </div>
                      <span
                        className={cn(
                          "text-[8px]  w-fit text-nowrap mb-1 text-slate-500",
                          messa.from === dbUser.id ? "mr-2" : "ml-2"
                        )}
                      >
                        {new Date(messa.time).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "numeric",
                        })}
                      </span>
                    </MaxWidthWrapper>
                  </div>
                );
              })}
            </div>
          )}
          {!isClosed && (
            <div className="p-2 sm:p-4">
              <Message toUser={toUser?.id!}></Message>
            </div>
          )}
        </div>
      )
    );
  } else {
    return <></>;
  }
};
export default ChatBox;
