import { SignedIn, SignOutButton } from "@clerk/nextjs";
import { Loader2Icon } from "lucide-react";

const LoadingPage = () => {
  return (
    <div className="w-screen dark:bg-gray-900/80 h-full flex flex-col items-center justify-center">
      <Loader2Icon className="animate-spin"></Loader2Icon>
      <div className="hidden">
        <SignedIn>
          <SignOutButton />
        </SignedIn>
      </div>
    </div>
  );
};
export default LoadingPage;
