"use client";
import {
  getFirestore,
  query,
  collection,
  where,
  getDocs,
  onSnapshot,
  DocumentData,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  Unsubscribe,
} from "firebase/firestore";
var AES = require("crypto-js/aes");
var enc = require("crypto-js/enc-utf8");
import { app } from "../../app/fb";
import { columns } from "../DataTable/columns";
import { DataTable } from "../DataTable/DataTable";
import { useEffect, useState } from "react";
import { Chat, Message } from "@/util/util";
const DATA = [
  {
    read: false,
    from: "user_2j7va4uD8t4rZP8DFwxxMFXBy2a",
    time: 1720834755016,
    to: "user1",
    message: "hello",
  },
];

const MessageTable = ({ chat }: { chat: string }) => {
  const [data, setData] = useState<null | Message[]>(null);
  const db = getFirestore(app);

  useEffect(() => {
    const unsu = onSnapshot(doc(db, "Chats", chat), (snap) => {
      const d = snap.data() as Chat;

      const decrypted = d.messages.map((val) => ({
        ...val,
        message: AES.decrypt(val.message, chat).toString(enc),
      }));
      setData(decrypted);
    });

    return () => {
      unsu();
    };
  }, []);

  const handleDelete = ({ id }: { id: string }) => {
    updateDoc(doc(db, "Chats", chat), {
      messages: data?.filter((message) => message.id !== id),
    });
  };

  if (data) {
    return (
      <div className="w-full  flex flex-col max-h-80 overflow-hidden">
        <div className="mb-2">{`Chat id: ${chat}`}:</div>
        <div className="flex  px-4 border-t border-r border-l -mb-2 justify-start border-gray-200 rounded-sm  py-4">
          {/* <p className="ml-auto">delete</p> */}
        </div>

        <DataTable
          data={data}
          //@ts-ignore
          chat={chat}
          columns={columns}
          handleDelete={handleDelete}
        ></DataTable>
      </div>
    );
  }
  return <></>;
};

export default MessageTable;
