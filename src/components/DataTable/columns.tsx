import { Message } from "@/util/util";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Message>[] = [
  {
    accessorKey: "from",
    header: "From",
  },
  {
    accessorKey: "message",
    header: "Message",
  },
];
