"use client";
import { UserObj } from "@/util/util";
import { useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";
import { sendMessage } from "./actions";
const Message = ({ toUser }: { toUser: string }) => {
  const { toast } = useToast();
  const [messageText, setMessageText] = useState("");
  const textRef = useRef<HTMLTextAreaElement | undefined>(undefined);

  const handleMessageSend = () => {
    if (!messageText) {
      toast({
        title: "No Message",
        description: new Date(Date.now()).toLocaleString("en-US"),
        variant: "destructive",
      });
      return;
    } else {
      sendMessage({
        message: messageText,
        to: toUser,
      }).catch((error: Error) => {
        toast({
          title: error.message,
          variant: "destructive",
        });
      });
      setMessageText("");
    }
  };

  return (
    <div className="h-fit w-full  flex flex-col">
      <Textarea
        value={messageText}
        ref={textRef}
        onChange={(e) => {
          setMessageText(e.target.value);
          e.currentTarget.style.height = "1px";
          e.currentTarget.style.height =
            25 + e.currentTarget.scrollHeight + "px";
        }}
        className="max-h-80 mb-4 w-full  overflow-hidden h-fit "
        placeholder="..."
      ></Textarea>
      <div className="flex gap-2 items-center">
        <Button className="ml-auto w-20" onClick={() => handleMessageSend()}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default Message;
