"use client";
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

//@ts-ignore
const NavBar = () => {
  const user = useUser();
  if (user.isLoaded) {
    if (user.isSignedIn) {
      return (
        <nav className="h-16 fixed w-full  backdrop-blur-lg z-[999] top-0 left-0 dark:text-white bg-gray-200/70 dark:bg-gray-900">
          <MaxWidthWrapper className="gap-1 h-full items-center">
            <div>hi</div>
            <div>hello</div>
            <div className=" ml-auto">
              <div className={"flex gap-2 items-center"}>
                <div className="flex  items-center">
                  <UserButton></UserButton>
                </div>

                {/* <Avatar>
                <AvatarImage src={user.user.imageUrl} />
                </Avatar> */}
                <SignOutButton>Sign out</SignOutButton>
              </div>
            </div>
          </MaxWidthWrapper>
        </nav>
      );
    } else {
      return (
        <nav className="h-16 fixed brightness-125 w-full dark:text-white bg-gray-400/80 dark:bg-slate-900/80">
          <MaxWidthWrapper className="gap-1 h-full items-center">
            <div>hi</div>
            <div>hello</div>
            <div className=" ml-auto">
              <div className={"flex gap-2 "}>
                <SignInButton>
                  <Button
                    variant={"secondary"}
                    className="bg-slate-600/60 dark:bg-slate-900"
                  >
                    Sign in
                  </Button>
                </SignInButton>
              </div>
            </div>
          </MaxWidthWrapper>
        </nav>
      );
    }
  } else {
    return <></>;
  }
};
export default NavBar;
