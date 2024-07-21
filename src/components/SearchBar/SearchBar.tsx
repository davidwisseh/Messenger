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
  LegacyRef,
  MutableRefObject,
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
import { MessageSquareIcon, SearchIcon } from "lucide-react";

const SearchBar = ({
  className,
  dbUser,
}: {
  className?: ClassValue;
  dbUser: UserObj;
}) => {
  const [db, setDb] = useState(getFirestore(app));
  const inputRef = useRef<undefined | HTMLInputElement>(undefined);
  const [filteredCon, setFilteredCon] = useState<UserName[] | undefined>(
    undefined
  );
  const btnRef = useRef<null | HTMLButtonElement>(null);
  let buffering = false;

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
    <div className="w-full h-full flex flex-col ">
      <div
        className={cn([
          "h-10 rounded-sm  items-center flex justify-center mt-5 mb-2 w-full",
          className,
        ])}
      >
        <input
          type="text"
          className="rounded-md h-full min-w-fit px-2"
          onChange={() => buffer()}
          //@ts-ignore
          ref={inputRef}
        />
        <div className="transition hover:scale-110 active:scale-90 ml-2 rounded-md px-1 bg-slate-600/20 h-full flex items-center justify-center">
          <MessageSquareIcon className=" sm:hidden sm:h-10 sm:w-10 h-8 w-8 sc "></MessageSquareIcon>
          <p className=" hidden    sm:flex items-center justify-center  text-2xl font-bold uppercase">
            Chat
          </p>
        </div>{" "}
      </div>
      <div className="h-full overflow-y-scroll">
        {filteredCon?.map((username) => {
          return (
            <Button
              className=" h-80 dark:hover:bg-slate-900/80 border-b border-gray-600/20 hover:bg-gray-600/20 brightness-125 block w-full rounded-none text-left"
              variant={"ghost"}
              key={username.id}
              onClick={() => {
                inputRef.current!.value = username.displayName;
                inputRef.current?.blur();
                setFilteredCon(undefined);
              }}
            >
              <span>@{username.name}-</span>
              <span className="text-slate-600">{username.displayName}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
export default SearchBar;
