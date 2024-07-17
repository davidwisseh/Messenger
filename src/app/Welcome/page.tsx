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
      if(router){

        router.push("/");
      }
    }
  }, [user.isSignedIn]);
  if (!user.isSignedIn) {
    return (
      <>
        <NavBar />
      </>
    );
  } else {
    return <LoadingPage />;
  }
};

export default Page;
