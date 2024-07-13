"use server";

import {
  getFirestore,
  collection,
  getDocs,
  where,
  query,
} from "firebase/firestore";
import { columns } from "../DataTable/columns";
import { DataTable } from "../DataTable/DataTable";
const DATA = [
  {
    read: false,
    from: "user_2j7va4uD8t4rZP8DFwxxMFXBy2a",
    time: 1720834755016,
    to: "user1",
    message: "hello",
  },
];
const MessageTable = async ({
  type,
  userId,
}: {
  type: string;
  userId: string;
}) => {
  const db = getFirestore();
  const q = query(collection(db, "Messages"), where(type, "==", userId));
  const data = (await getDocs(q)).docs.map((d) => d.data());

  return (
    <div className="w-full flex flex-col">
      <div className="mb-2">{type === "to" ? "Received" : "Sent"}:</div>
      {
        //@ts-ignore
        <DataTable data={data} columns={columns}></DataTable>
      }
    </div>
  );
};

export default MessageTable;
