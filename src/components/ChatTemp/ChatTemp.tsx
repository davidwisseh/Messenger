"use client";
import { cn } from "@/lib/utils";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { getFirestore } from "firebase/firestore";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { MutableRefObject, useState } from "react";
import { UserObj } from "../../util/util";
import ChatBox from "../ChatBox/ChatBox";
import MaxWidthWrapper from "../MaxWidthWrapper";
import SearchBar from "../SearchBar/SearchBar";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import { makeEmptyChat } from "./actions";

const ChatTemp = ({
  dbUser,
  toUser,
  navRef,
}: {
  dbUser: UserObj;
  toUser: MutableRefObject<string>;
  navRef: MutableRefObject<HTMLDivElement | undefined>;
}) => {
  const [chats, setChats] = useState();
  const db = getFirestore();
  const router = useRouter();
  const [enabled, setEnabled] = useState<boolean>(true);
  const [selected, setSelected] = useState<string>("");
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
    <div className="h-full w-full relative flex overflow-y-hidden">
      <div className="m-auto w-full h-full overflow-y-scroll">
        <MaxWidthWrapper className="justify-center hidden items-start  gap-2 ">
          <div className="pt-2">
            <SearchIcon></SearchIcon>
          </div>
          <SearchBar
            className="h-full "
            toUser={toUser}
            dbUser={dbUser}
          ></SearchBar>
          <Button
            className={cn(
              !enabled ? "pointer-events-none hover:cursor-wait" : ""
            )}
            onClick={() => handleCLick()}
          >
            Chat
          </Button>
        </MaxWidthWrapper>
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
  );
};

export default ChatTemp;
