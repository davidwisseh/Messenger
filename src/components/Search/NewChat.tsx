"use client";
import { app } from "@/app/fb";
import { cn } from "@/lib/utils";
import { UserName } from "@/util/util";
import { getFirestore } from "firebase/firestore";
import { XIcon } from "lucide-react";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import DefUser from "../DefUser";
import MaxWidthWrapper from "../MaxWidthWrapper";
import Message from "../Message/Message";

var AES = require("crypto-js/aes");
var enc = require("crypto-js/enc-utf8");

const NewChat = ({
  to,
  setTo,
  setPage,
  setSelected,
  setIsLoading,
}: {
  to: UserName;
  setTo: Dispatch<SetStateAction<UserName | undefined>>;
  setPage: Dispatch<SetStateAction<string>>;
  setSelected: Dispatch<SetStateAction<string>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}) => {
  const [db, setDb] = useState(getFirestore(app));
  const [toUser, setToUser] = useState<UserName>(to);
  const chatDivRef = useRef<HTMLDivElement | undefined>(undefined);

  const handleLoad = () => {
    chatDivRef.current!.scrollTop = chatDivRef.current!.scrollHeight;
  };

  return (
    toUser && (
      <div
        className={cn(
          "flex flex-col    bg-gray-600/20  rounded-md border-t-[1px]   mx-auto border-gray-200/50 shadow-sm dark:shadow-slate-800 dark:border-slate-800 h-full w-[90%]  dark:bg-slate-900 "
        )}
      >
        <MaxWidthWrapper className="items-end">
          <div className="pb-1 xs:pb-0">
            <DefUser img={toUser!.image_url}></DefUser>
          </div>

          <div className="flex flex-col w-fit h-full   ml-2   items-start   mr-4">
            <p className="font-semibold">{toUser?.displayName}</p>
            <p className="text-xs text-slate-500">@{toUser?.name}</p>
          </div>

          <div
            onClick={(e) => {
              setTo(undefined);
              e.stopPropagation();
            }}
            className="ml-auto hover:scale-125 active:scale-100 transition mr-2  xs:mr-4 mt-2 xs:mt-4 mb-auto "
          >
            <XIcon />
          </div>
        </MaxWidthWrapper>

        <div className="p-2 xs:p-4">
          <Message
            setPage={setPage}
            setTo={setTo}
            toUser={toUser?.id!}
            setSelected={setSelected}
            setIsLoading={setIsLoading}
          ></Message>
        </div>
      </div>
    )
  );
};
export default NewChat;
