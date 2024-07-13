"use client";
import { SignInButton, SignOutButton, UserButton } from "@clerk/nextjs";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
//@ts-ignore
const NavBar = ({ user }) => {
  let USER = null;
  try {
    USER = JSON.parse(user);
  } catch (error) {}

  if (USER) {
    return (
      <nav className="h-16 relative dark:text-white bg-gray-200 dark:bg-gray-900">
        <MaxWidthWrapper className="gap-1 h-full items-center">
          <div>hi</div>
          <div>hello</div>
          <div className=" ml-auto">
            <div className={"flex gap-2 "}>
              <UserButton></UserButton>
              <Avatar>
                <AvatarImage src={USER.imageUrl} />
              </Avatar>
              <SignOutButton>Sign out</SignOutButton>
            </div>
          </div>
        </MaxWidthWrapper>
      </nav>
    );
  } else {
    return (
      <nav className="h-16 relative dark:text-white bg-gray-200 dark:bg-gray-900">
        <MaxWidthWrapper className="gap-1 h-full items-center">
          <div>hi</div>
          <div>hello</div>
          <div className=" ml-auto">
            <div className={"flex gap-2 "}>
              <SignInButton>
                <Button>Sign in</Button>
              </SignInButton>
            </div>
          </div>
        </MaxWidthWrapper>
      </nav>
    );
  }
};
export default NavBar;
