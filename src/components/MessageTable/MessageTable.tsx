"use client";
import {
  getFirestore,
  query,
  collection,
  where,
  getDocs,
  onSnapshot,
  DocumentData,
} from "firebase/firestore";
import { app } from "../../app/fb";
import { columns } from "../DataTable/columns";
import { DataTable } from "../DataTable/DataTable";
import { useState } from "react";
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
    const d = snap.docs.map((d) => d.data());
    setData(d);
  });

  return (
    <div className="w-full flex flex-col">
      <div className="mb-2">{type === "to" ? "Received" : "Sent"}:</div>
      {
        //@ts-ignore
        <DataTable data={data} columns={columns[type]}></DataTable>
      }
    </div>
  );
};

export default MessageTable;
