import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Dispatch, MutableRefObject, SetStateAction } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import DefUser from "./DefUser";
import { UserObj } from "@/util/util";

const NavCol = ({
  navRef,
  setPage,
  page,
  dbUser,
}: {
  navRef: MutableRefObject<HTMLDivElement | undefined>;
  setPage: Dispatch<SetStateAction<string>>;
  page: string;
  dbUser: UserObj;
}) => {
  const { theme, setTheme } = useTheme();
  return (
    <div
      //@ts-ignore
      ref={navRef}
      className={cn(
        "    flex sm:flex sm:flex-col items-center  flex-row dark:bg-slate-900/80 brightness-125 sm:max-w-40 bg-gray-600/20 border-t-2 sm:border-t-0 sm:border-r-2 border-black/20 shadow-lg h-14 w-full sm:h-full"
      )}
    >
      <div
        onClick={() => {
          if (theme === "light") {
            setTheme("dark");
          } else {
            setTheme("light");
          }
        }}
        className="mx-2 flex justify-center items-center sm:mt-2 active:scale-90 sm:place-self-start h-7 w-7 sm:w-10 sm:h-10 hover:scale-110 transform duration-300  brightness-125 rounded-full dark:text-yellow-700"
      >
        <div className="w-6  h-6 sm:w-9 sm:h-9">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278" />
            <path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.73 1.73 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.73 1.73 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.73 1.73 0 0 0 1.097-1.097zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z" />
          </svg>
        </div>
      </div>
      <div
        className={cn(
          "sm:pl-2 mr-2 px-2  sm:py-2 sm:mr-0 flex justify-start items-center h-full sm:h-fit sm:w-full",
          { "bg-black/20 ": page === "Profile" }
        )}
      >
        <DefUser
          img={dbUser.img_url}
          onClick={() => {
            setPage("Profile");
          }}
        />
      </div>
      <div className=" my-auto  w-fit place-self-start sm:mx-2 sm:my-2 ">
        <SignedIn>
          <UserButton></UserButton>
        </SignedIn>
      </div>
    </div>
  );
};
export default NavCol;
