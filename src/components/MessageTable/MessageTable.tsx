"use server";
import admin from "firebase-admin";
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
  const db = admin.database();
  const messagesRef = db.ref("Messages");
  const m = await messagesRef.get();
  console.log("m: " + m.toJSON());
  return (
    <div className="w-full flex flex-col">
      <div className="mb-2">{type === "to" ? "Received" : "Sent"}:</div>
      <DataTable data={DATA} columns={columns}></DataTable>
    </div>
  );
};

export default MessageTable;
