import { Message } from "@/util/util";
import { ColumnDef } from "@tanstack/react-table";
import { DocumentData } from "firebase/firestore";
import { from } from "svix/dist/openapi/rxjsStub";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Message>[] = [
  {
    accessorKey: "from",
    header: "From",
  },
  {
    accessorKey: "to",
    header: "To",
  },
  {
    accessorKey: "message",
    header: "Message",
  },
];
