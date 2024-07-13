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
} from "firebase/firestore";
import { app } from "../../app/fb";
import { columns } from "../DataTable/columns";
import { DataTable } from "../DataTable/DataTable";
import { useState } from "react";
import { Message } from "@/util/util";
const DATA = [
  {
    read: false,
    from: "user_2j7va4uD8t4rZP8DFwxxMFXBy2a",
    time: 1720834755016,
    to: "user1",
    message: "hello",
  },
];

const MessageTable = ({ type, userId }: { type: string; userId: string }) => {
  const [data, setData] = useState<[] | DocumentData[]>([]);
  const db = getFirestore(app);
  const q = query(collection(db, "Messages"), where(type, "==", userId));

  const unsub = onSnapshot(q, (snap) => {
    const d = snap.docs
      .sort((a, b) => b.get("time") - a.get("time"))
      .map((d) => d.data());
    setData(d);
  });
  const handleDelete = ({ id }: { id: string }) => {
    deleteDoc(doc(db, "Messages", id));
  };
  return (
    <div className="w-full  flex flex-col max-h-80 overflow-hidden">
      <div className="mb-2">{type === "to" ? "Received" : "Sent"}:</div>
      <div className="flex  px-4 border-t border-r border-l -mb-2 justify-start border-gray-200 rounded-sm  py-4">
        <p className="w-72">{type === "to" ? "from" : "to"}</p>
        <p className="mx-auto">message</p>
        {/* <p className="ml-auto">delete</p> */}
      </div>

      <DataTable
        data={data}
        //@ts-ignore
        columns={columns[type]}
        handleDelete={handleDelete}
        types={type}
      ></DataTable>
    </div>
  );
};

export default MessageTable;
