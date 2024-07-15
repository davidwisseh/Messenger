import { app } from "@/app/fb";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import {UserObj} from "../../util/util"
import { useUser } from "@clerk/nextjs";
import MaxWidthWrapper from "../MaxWidthWrapper";
import Message from "../Message/Message";
import MessageTable from "../MessageTable/MessageTable";



const ChatTemp = async () => {
    const user = useUser()
    const db =  getFirestore(app)
    const dbUser =  (await getDoc(doc(db,"Users", user.user!.id))).data() as UserObj
    const {chats} = dbUser;

  return (
    <>
      <div className="m-auto w-[80%] h-max relative">
        <MaxWidthWrapper className="mt-14 shadow-md rounded-md">
          <Message></Message>
        </MaxWidthWrapper>
      </div>
      <div className="m-auto w-[80%] h-max relative">
        <MaxWidthWrapper className="mt-14 shadow-md rounded-md">
          {chats?.map((chat)=>{
            return <MessageTable chat={chat}></MessageTable>
          })}
        </MaxWidthWrapper>
      </div>
      
    </>
  );
};

export default ChatTemp;
