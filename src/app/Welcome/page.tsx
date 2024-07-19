"use client";
import LoadingPage from "@/components/LoadingPage";
import NavBar from "@/components/NavBar";
import { useUser } from "@clerk/nextjs";
import { Loader2Icon, LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const router = useRouter();
  const user = useUser();
  useEffect(() => {
    if (user.isSignedIn) {
      router.push("/");
    }
  }, [user.isSignedIn, router]);
  if (!user.isSignedIn) {
    return (
      <div className="w-screen h-full bg-gray-100 dark:bg-slate-900">
        <NavBar />
      </div>
    );
  } else {
    return <LoadingPage />;
  }
};

export default Page;
