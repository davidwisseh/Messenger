import { cn } from "@/lib/utils";
import { UserObj } from "@/util/util";
import { SignOutButton } from "@clerk/nextjs";
import { LogOutIcon, MessageSquareIcon, SearchIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Dispatch, MutableRefObject, SetStateAction } from "react";
import DefUser from "./DefUser";

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
  const router = useRouter();
  return (
    <div
      //@ts-ignore
      ref={navRef}
      className={cn(
        "    flex sm:flex sm:flex-col items-center justify-center flex-row dark:bg-slate-900/80 brightness-125 sm:max-w-40 bg-gray-600/20 border-t-2 sm:border-t-0 sm:border-r-2 border-black/20 shadow-lg h-14 min-h-14 sm:min-h-full w-full sm:h-full"
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
        className="px-2 sm:px-2 sm:mx-0 w-10  sm:w-full  py-2 h-full sm:h-14  flex justify-center items-center  active:scale-90 sm:place-self-start hover:scale-110 transform duration-300  brightness-125 rounded-full dark:text-yellow-700"
      >
        <div className="w-6  block h-6 sm:w-9 sm:h-9">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278" />
            <path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.73 1.73 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.73 1.73 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.73 1.73 0 0 0 1.097-1.097zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z" />
          </svg>
        </div>
        <p className="text-2xl hidden sm:block ml-2 uppercase font-bold">
          {theme === "light" ? "dark" : "light"}
        </p>
      </div>
      <div
        onClick={() => {
          setPage("Profile");
        }}
        className={cn(
          "sm:pl-2  px-2 *:hover:scale-105 *:active:scale-90 sm:py-2  flex justify-start items-center h-full sm:h-fit sm:w-full",
          { "bg-black/20 ": page === "Profile" }
        )}
      >
        <div className="flex transition  gap-1 items-center">
          <DefUser className="hover:scale-100" img={dbUser.img_url} />
          <p className="text-2xl hidden sm:block transition font-bold mx-auto uppercase">
            profile
          </p>
        </div>
      </div>
      <div
        onClick={() => {
          setPage("Chat");
        }}
        className={cn(
          "w-11 *:hover:scale-110 *:active:scale-90 px-2 items-center justify-center  flex h-full sm:w-full sm:h-14 sm:py-2",
          {
            "bg-black/20 ": page === "Chat",
          }
        )}
      >
        <div className="transition h-full w-full flex items-center justify-center">
          <MessageSquareIcon className="  sm:h-10 sm:w-10 h-8 w-8 sc "></MessageSquareIcon>
          <p className=" hidden    ml-2 sm:flex items-center justify-center  text-2xl font-bold uppercase">
            Chat
          </p>
        </div>
      </div>
      <div
        onClick={() => {
          setPage("Search");
        }}
        className={cn(
          " *:hover:scale-110 *:active:scale-90 items-center text-2xl font-bold justify-center sm:h-14 sm:w-full h-full w-11 flex",
          { "bg-black/20": page === "Search" }
        )}
      >
        <div className="flex w-full transition h-full items-center justify-center">
          <SearchIcon className="w-7 sm:h-10 sm:w-10 h-7" />
          <p className="ml-2 hidden sm:block">Search</p>
        </div>
      </div>
      <SignOutButton>
        <div
          onClick={() => {
            router.refresh();
          }}
          className="hover:scale-105 h-full sm:h-14  items-center transition active:scale-90 my-auto text-2xl w-11 font-bold sm:w-full flex justify-center  sm:my-2 "
        >
          <div className=" flex items-center justify-center h-full w-full">
            <LogOutIcon className="sm:w-10 sm:h-10" />
            <p className=" ml-2 hidden sm:flex">Sign Out</p>
          </div>
        </div>
      </SignOutButton>
    </div>
  );
};
export default NavCol;
