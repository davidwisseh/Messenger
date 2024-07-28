"use client";
import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import {
  ChangeEvent,
  Dispatch,
  LegacyRef,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { match } from "assert";
import {
  and,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { app } from "@/app/fb";
import { UserName, UserObj } from "@/util/util";
import { Loader2Icon, MessageSquareIcon, SearchIcon } from "lucide-react";
import NewChat from "./NewChat";

const Search = ({
  className,
  dbUser: dbUseR,
  setSelected,
  setPage,
}: {
  className?: ClassValue;
  dbUser: UserObj;

  setPage: Dispatch<SetStateAction<string>>;
  setSelected: Dispatch<SetStateAction<string>>;
}) => {
  const [to, setTo] = useState<UserName>();
  const [db, setDb] = useState(getFirestore(app));
  const inputRef = useRef<undefined | HTMLInputElement>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filteredCon, setFilteredCon] = useState<UserName[] | undefined>(
    undefined
  );
  const btnRef = useRef<null | HTMLButtonElement>(null);
  let buffering = false;
  const [dbUser, setDbUser] = useState(dbUseR);
  useEffect(() => {
    setDbUser(dbUseR);
  }, [dbUseR]);

  const buffer = () => {
    if (!buffering) {
      buffering = !buffering;
      setTimeout(() => {
        if (!inputRef.current?.value) {
          setFilteredCon(undefined);
        } else {
          getDocs(
            query(
              collection(db, "UserNames"),
              where(
                "id",
                "not-in",
                dbUser.blockedBy.length ? dbUser.blockedBy : [""]
              )
            )
          ).then((snap) => {
            const data = snap.docs
              .filter((d) => {
                if (
                  d.data().id != dbUser.id &&
                  d
                    .data()
                    .name.match(new RegExp(`${inputRef.current?.value}`, "ig"))
                ) {
                  return true;
                }
                return false;
              })
              .map((d) => d.data()) as UserName[];
            setFilteredCon(data);
          });
        }

        buffering = !buffering;
      }, 500);
    }
  };

  return (
    <div className=" relative overflow-y-hidden w-full h-full flex flex-col ">
      <div
        className={cn(
          "absolute w-full h-full   bg-black/50 hidden items-center justify-center",
          { flex: isLoading }
        )}
      >
        <Loader2Icon className="animate-spin" />
      </div>
      <div
        className={cn([
          "h-10 rounded-sm  items-center flex justify-center mt-5 mb-2 w-full",
          className,
        ])}
      >
        <SearchIcon className="mr-2" />
        <input
          type="text"
          className="rounded-md h-full min-w-fit  border-2 px-2"
          onChange={() => buffer()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key == "Return") {
              e.currentTarget.blur();
            }
          }}
          //@ts-ignore
          ref={inputRef}
        />{" "}
      </div>
      <div className=" overflow-y-scroll">
        {filteredCon && !filteredCon.length && (
          <div className=" h-full w-full flex justify-center">no results</div>
        )}
        {filteredCon?.map((username) => {
          return (
            <Button
              className=" h-fit dark:hover:bg-slate-900/80 border-b border-gray-600/20 hover:bg-gray-600/20 brightness-125 flex justify-between  w-full rounded-none text-left"
              variant={"ghost"}
              key={username.id}
            >
              <div>
                <span>@{username.name}-</span>
                <span className="text-slate-600">{username.displayName}</span>
              </div>
              <div
                onClick={() => {
                  const exists = dbUser.messaged.find((mess) => {
                    return mess.user === username.id;
                  });
                  if (!exists) {
                    setTo(username);
                    inputRef.current?.blur();
                    setFilteredCon(undefined);
                  } else {
                    setSelected(exists.chat);
                    setPage("Chat");
                  }
                }}
                className="transition py-0.5 hover:scale-110 active:scale-90 ml-2 rounded-md px-1 w-fit bg-slate-600/20 h-fit flex items-center justify-center"
              >
                <MessageSquareIcon className=" sm:hidden sm:h-10 sm:w-10 h-8 w-8 sc "></MessageSquareIcon>
                <p className=" hidden    sm:flex items-center justify-center  text-xl font-bold uppercase">
                  Chat
                </p>
              </div>
            </Button>
          );
        })}
        {to && (
          <NewChat
            setSelected={setSelected}
            to={to}
            setTo={setTo}
            setPage={setPage}
            setIsLoading={setIsLoading}
          />
        )}
      </div>
    </div>
  );
};
export default Search;
