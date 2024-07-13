"use client";
import { ReactNode, useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "../ui/use-toast";
import { sendMessage } from "./actions";
import { useUser } from "@clerk/nextjs";
import { getFirestore } from "firebase/firestore";

const contacts = ["user1", "user2"];
const Message = () => {
  const { toast } = useToast();
  const [messageText, setMessageText] = useState("");
  const [toUser, setToUser] = useState<null | string>("me");
  const user = useUser();

  const handleMessageSend = () => {
    if (!messageText) {
      toast({
        title: "no message",
        description: new Date(Date.now()).toLocaleString("en-US"),
        variant: "destructive",
      });
      return;
    } else {
      sendMessage({
        message: messageText,
        to: toUser!,
        id: user.user?.id!,
      });
    }
  };

  return (
    <div className="h-fit w-full flex flex-col">
      <Textarea
        onChange={(el) => setMessageText(el.target.value)}
        className="max-h-80 mb-4 w-full"
        placeholder="..."
      ></Textarea>
      <div className="flex gap-2 items-center">
        <p>To:</p>
        <Select onValueChange={(value) => setToUser(value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder={"me"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="me">me</SelectItem>
            {contacts.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button className="ml-auto w-20" onClick={() => handleMessageSend()}>
          Send
        </Button>
      </div>
    </div>
  );
};
export default Message;
