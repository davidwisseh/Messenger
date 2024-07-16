"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";
import { sendMessage } from "./actions";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { app } from "@/app/fb";
import { UserObj } from "@/util/util";
import SearchBar from "../SearchBar/SearchBar";
const Message = ({ dbUser }: { dbUser: UserObj }) => {
  const { toast } = useToast();
  const [messageText, setMessageText] = useState("");
  const toUser = useRef<string>("");

  const user = useUser();

  const handleMessageSend = () => {
    if (!messageText) {
      toast({
        title: "No Message",
        description: new Date(Date.now()).toLocaleString("en-US"),
        variant: "destructive",
      });
      return;
    } else if (!toUser.current) {
      toast({
        title: "No User",
        description: new Date(Date.now()).toLocaleString("en-US"),
        variant: "destructive",
      });
      return;
    } else {
      sendMessage({
        message: messageText,
        to: toUser.current,
      }).catch((error: Error) => {
        toast({
          title: error.message,
          variant: "destructive",
        });
      });
      setMessageText("");
      toUser.current = "";
    }
  };

  return (
    <div className="h-fit w-full flex flex-col">
      <Textarea
        value={messageText}
        onChange={(e) => {
          setMessageText(e.target.value);
          console.log(e.currentTarget.scrollHeight);
          e.currentTarget.style.height = "1px";
          e.currentTarget.style.height =
            25 + e.currentTarget.scrollHeight + "px";
        }}
        className="max-h-80 mb-4 w-full  overflow-hidden h-fit "
        placeholder="..."
      ></Textarea>
      <div className="flex gap-2 items-center">
        <SearchBar toUser = {toUser} dbUser={dbUser}></SearchBar>

        <Button className="ml-auto w-20" onClick={() => handleMessageSend()}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default Message;
