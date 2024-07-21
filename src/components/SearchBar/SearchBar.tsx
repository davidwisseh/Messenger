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
          "h-10 rounded-sm flex justify-center mt-5  w-full",
          className,
        ])}
      >
        <input
          type="text"
          className="h-full min-w-fit px-2"
          onChange={() => buffer()}
          //@ts-ignore
          ref={inputRef}
        />
      </div>
      <div>
        {filteredCon?.map((username) => {
          return (
            <Button
              className="  block w-full rounded-none text-left"
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
