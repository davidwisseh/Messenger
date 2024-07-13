import { Message } from "@/util/util";
import { ColumnDef } from "@tanstack/react-table";
import { DocumentData } from "firebase/firestore";
import { from } from "svix/dist/openapi/rxjsStub";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: Record<string, ColumnDef<Message>[]> = {
  to: [
    {
      accessorKey: "from",
      header: "From",
    },
    {
      accessorKey: "message",
      header: "Message",
    },
  ] as ColumnDef<Message>[],
  from: [
    {
      accessorKey: "to",
      header: "To",
    },
    {
      accessorKey: "message",
      header: "Message",
    },
  ] as ColumnDef<Message>[],
};
