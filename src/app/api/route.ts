"use server";
import { Message } from "@/util/util";
import { currentUser } from "@clerk/nextjs/server";
export const POST = async (req: Request) => {
  const item = await req.json();
  if (item.type === "message") {
    const Message = item.data as Message;
    const clerkUser = await currentUser();

    console.log(Message.read ? "true" : "false");
    if (!clerkUser) {
      console.error("no user");
      return new Response("not Ok", { status: 400 });
    }
    console.log(clerkUser?.id);
  }
  return new Response("dfadffadsffdsf", { status: 200 });
};
