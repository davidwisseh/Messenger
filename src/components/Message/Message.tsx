"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";
import { sendMessage } from "./actions";

const contacts = ["user1", "user2"];
const Message = () => {
  const { toast } = useToast();
  const [messageText, setMessageText] = useState("");
  const [toUser, setToUser] = useState("me");
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
        to: toUser,
      });
      setMessageText("");
      setToUser("me");
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
        <p>To:</p>
        <Select
          value={toUser}
          onValueChange={(val) => {
            setToUser(val);
          }}
        >
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
