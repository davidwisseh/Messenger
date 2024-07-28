"use client";
import { cn } from "@/lib/utils";
import { getFirestore } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Dispatch, MutableRefObject, SetStateAction, useState } from "react";
import { SwipeAction, TrailingActions } from "react-swipeable-list";
import { UserObj } from "../../util/util";
import ChatBox from "../ChatBox/ChatBox";

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
                  key={messaged.chat}
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
