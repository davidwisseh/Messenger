"use client";
import MaxWidthWrapper from "./MaxWidthWrapper";
import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
const NavBar = () => {
  return (
    <nav className="h-20 relative dark:text-white bg-gray-100 dark:bg-gray-900">
      <MaxWidthWrapper className="gap-1 items-center">
        <div>hi</div>
        <div>hello</div>
        <div className=" ml-auto">
          <SignedOut>
            <div className=" flex gap-2">
              <SignInButton>Login</SignInButton>{" "}
              <SignUpButton>Sign up</SignUpButton>
            </div>
          </SignedOut>
          <SignedIn>
            <div className="flex gap-2">
              <UserButton></UserButton>
              <SignOutButton>Sign out</SignOutButton>
            </div>
          </SignedIn>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};
export default NavBar;
