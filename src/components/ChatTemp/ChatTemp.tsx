"use client";
import { cn } from "@/lib/utils";
import { getFirestore } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Dispatch, MutableRefObject, SetStateAction, useState } from "react";
import { UserObj } from "../../util/util";
import ChatBox from "../ChatBox/ChatBox";
import { toast } from "../ui/use-toast";
import { makeEmptyChat } from "./actions";

const ChatTemp = ({
  dbUser,
  toUser,
  navRef,
  selected,
  setSelected,
}: {
  dbUser: UserObj;
  toUser: MutableRefObject<string>;
  navRef: MutableRefObject<HTMLDivElement | undefined>;
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
}) => {
  const [chats, setChats] = useState();
  const db = getFirestore();
  const router = useRouter();
  const [enabled, setEnabled] = useState<boolean>(true);

  const [loading, setLoading] = useState(false);
  const handleCLick = () => {
    if (enabled) {
      setEnabled(false);
      if (!toUser.current) {
        toast({ title: "No User", variant: "destructive" });
        setEnabled(false);
      } else if (dbUser.blockedBy.includes(toUser.current)) {
        toast({ title: "Blocked by User", variant: "destructive" });
        setEnabled(false);
      } else if (!dbUser.messaged.every((me) => me.user !== toUser.current)) {
        toast({
          title: "Messaged Already",
          variant: "destructive",
        });
        setEnabled(false);
      } else {
        makeEmptyChat(toUser.current).then(() => {
          router.push("/");
        });
      }
    }
  };

  return (
    !loading && (
      <div
        className={cn(
          "h-full w-full relative flex justify-center overflow-y-hidden"
        )}
      >
        <div className=" w-full h-full overflow-y-scroll">
          <div
            className={cn("w-full h-full flex items-center justify-center", {
              hidden: dbUser.messaged.length,
            })}
          >
            <p>No Chats</p>
          </div>
          {dbUser.messaged
            .map((messaged) => {
              return (
                <ChatBox
                  selected={selected}
                  onClick={(isTrue) => {
                    if (isTrue) {
                      navRef.current?.classList.add("hidden");
                      setSelected(messaged.chat);
                    } else {
                      navRef.current?.classList.remove("hidden");
                      setSelected("");
                    }
                  }}
                  dbUser={dbUser}
                  messaged={messaged}
                  key={messaged.chat}
                />
              );
            })
            .reverse()}
        </div>
      </div>
    )
  );
};

export default ChatTemp;
