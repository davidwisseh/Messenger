import { UserObj } from "@/util/util";
import MaxWidthWrapper from "../MaxWidthWrapper";

const Profile = ({ dbUser }: { dbUser: UserObj }) => {
  return (
    <div className="h-full w-full relative flex overflow-y-hidden">
      <div className="w-[90%] max-w-screen-2xl mx-auto h-20 mt-5 flex justify-center items-center hover:scale-105 transition  bg-gray-200/50 shadow-md dark:shadow-slate-800  dark:bg-slate-800 rounded-sm">
        <p>hello</p>
      </div>
    </div>
  );
};
export default Profile;
