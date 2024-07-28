import {
  SignInButton,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";
import { json } from "stream/consumers";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "next-themes";

//@ts-ignore
const NavBar = () => {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="h-16 fixed brightness-125 w-full dark:text-white bg-gray-400/80 dark:bg-slate-900/80">
      <MaxWidthWrapper className="gap-1 h-full items-center">
        <p className="text-2xl">Messenger</p>

        <div className=" ml-auto">
          <div className={"flex gap-2 items-center "}>
            <div
              onClick={() => {
                if (theme === "light") {
                  setTheme("dark");
                } else {
                  setTheme("light");
                }
              }}
              className=" sm:mx-0 w-10 sm:w-full sm:pr-2  h-full my-auto     flex justify-center items-center  active:scale-90 sm:place-self-start hover:scale-110 transform duration-300  brightness-125 rounded-full dark:text-yellow-700"
            >
              <div className="w-6  block h-6 sm:w-8 sm:h-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278" />
                  <path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.73 1.73 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.73 1.73 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.73 1.73 0 0 0 1.097-1.097zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z" />
                </svg>
              </div>
              <p className="text-2xl pl-1 hidden sm:block mx-auto uppercase font-bold">
                {theme === "light" ? "dark" : "light"}
              </p>
            </div>
            <div className="h-full flex items-center">
              <SignInButton forceRedirectUrl={"/"}>
                <Button
                  variant={"secondary"}
                  className="bg-slate-600/60 dark:bg-slate-900"
                >
                  Sign in
                </Button>
              </SignInButton>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};
export default NavBar;
