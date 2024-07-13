"use server";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import MessageTable from "@/components/MessageTable/MessageTable";
import { currentUser } from "@clerk/nextjs/server";
import Message from "../components/Message/Message";
import Navbar from "../components/NavBar";

export default async function Home() {
  const user = await currentUser();
  return (
    <>
      <Navbar user={JSON.stringify(user)}></Navbar>

      {user && (
        <>
          <div className="m-auto w-[80%] h-max relative">
            <MaxWidthWrapper className="mt-14 shadow-md rounded-md">
              <Message></Message>
            </MaxWidthWrapper>
          </div>
          <div className="m-auto w-[80%] h-max relative">
            <MaxWidthWrapper className="mt-14 shadow-md rounded-md">
              <MessageTable type="to" userId={user.id}></MessageTable>
            </MaxWidthWrapper>
          </div>
          <div className="m-auto w-[80%] h-max relative">
            <MaxWidthWrapper className="mt-14 shadow-md rounded-md">
              <MessageTable type="from" userId={user.id}></MessageTable>
            </MaxWidthWrapper>
          </div>
        </>
      )}
    </>
  );
}
