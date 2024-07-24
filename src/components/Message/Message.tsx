"use client";
import { UserName, UserObj } from "@/util/util";
import { useUser } from "@clerk/nextjs";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";
import { sendMessage } from "./actions";
import { nanoid } from "nanoid";
const Message = ({
  toUser,
  setTo,
  setPage,
  setSelected,
  setIsLoading,
}: {
  toUser: string;
  setTo?: Dispatch<SetStateAction<UserName | undefined>>;
  setPage?: Dispatch<SetStateAction<string>>;
  setSelected?: Dispatch<SetStateAction<string>>;
  setIsLoading?: Dispatch<SetStateAction<boolean>>;
}) => {
  const { toast } = useToast();
  const [messageText, setMessageText] = useState("");
  const textRef = useRef<HTMLTextAreaElement | undefined>(undefined);

  const handleMessageSend = () => {
    if (setTo) {
      const chatId = nanoid();

      if (!messageText.trim()) {
        toast({
          title: "No Message",
          description: new Date(Date.now()).toLocaleString("en-US"),
          variant: "destructive",
        });
        return;
      } else {
        setIsLoading!(true);
        sendMessage({
          message: messageText.trim(),
          to: toUser,
          chatId,
        })
          .catch((error: Error) => {
            toast({
              title: error.message,
              variant: "destructive",
            });
          })
          .then(() => {
            setSelected!(chatId);
            setPage!("Chat");
          });
        setMessageText("");
        setTo(undefined);
      }
    } else {
      if (!messageText.trim()) {
        toast({
          title: "No Message",
          description: new Date(Date.now()).toLocaleString("en-US"),
          variant: "destructive",
        });
        return;
      } else {
        sendMessage({
          message: messageText.trim(),
          to: toUser,
        }).catch((error: Error) => {
          toast({
            title: error.message,
            variant: "destructive",
          });
        });

        setMessageText("");
      }
    }
  };
  function isMobile() {
    const regex =
      /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return regex.test(navigator.userAgent);
  }
  const mobile = isMobile();

  return (
    <div className="h-fit w-full  flex flex-col">
      <Textarea
        autoFocus
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key == "Return") {
            if (mobile) {
              e.preventDefault();
              e.currentTarget.blur();
              handleMessageSend();
            } else {
              if (e.shiftKey) {
                e.preventDefault();
                handleMessageSend();
              }
            }
          }
        }}
        value={messageText}
        //@ts-ignore
        ref={textRef}
        onChange={(e) => {
          setMessageText(e.target.value);
          e.currentTarget.style.height = "1px";
          e.currentTarget.style.height =
            25 + e.currentTarget.scrollHeight + "px";
        }}
        className="max-h-40  w-full  overflow-hidden h-fit "
        placeholder="..."
      ></Textarea>
      {!mobile && (
        <div className="flex gap-2 mt-2 sm:mt-4 items-center">
          <p className="ml-auto text-xs text-slate-500/50">Shift + Enter</p>
          <Button
            variant={"secondary"}
            className="bg-gray-600/20 w-20 hover:bg-gray-600/40"
            onClick={() => handleMessageSend()}
          >
            Send
          </Button>
        </div>
      )}
    </div>
  );
};

export default Message;
