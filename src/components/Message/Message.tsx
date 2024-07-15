"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
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
const Message = () => {
  const [contacts, setContacts] = useState<string[] | null>(null);
  const { toast } = useToast();
  const [messageText, setMessageText] = useState("");
  const [toUser, setToUser] = useState("me");
  const user = useUser();
  const db = getFirestore(app);
  useEffect(() => {
    const doWork = async () => {
      const dbUser = (
        await getDoc(doc(db, "Users", user.user?.id!))
      ).data() as UserObj;
      const blockedBy = dbUser.blockedBy;
      const dbUsers = await getDocs(collection(db, "Users"));
      const filtered = dbUsers.docs.filter((d) => {
        const ud = d.data() as UserObj;

        if (!blockedBy?.includes(ud.id) && ud.id !== user.user?.id) {
          return true;
        }
      });
      const setcon = filtered.map((d) => d.data().id) as string[];

      setContacts(setcon);
    };
    doWork();
  }, []);

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
      }).catch((error: Error) => {
        toast({
          title: error.message,
          variant: "destructive",
        });
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
            {contacts?.map((c, i) => (
              <SelectItem key={`${c}_${i}`} value={c}>
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
