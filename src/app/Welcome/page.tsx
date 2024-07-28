"use client";
import LoadingPage from "@/components/LoadingPage";
import NavBar from "@/components/NavBar";
import { useUser } from "@clerk/nextjs";
import { Loader2Icon, LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useTheme } from "next-themes";

const Page = () => {
  const router = useRouter();
  const user = useUser();
  const theme = useTheme();
  useEffect(() => {
    if (user.isSignedIn) {
      router.push("/");
    }
  }, [user.isSignedIn, router]);
  if (!user.isSignedIn) {
    return (
      <>
        <NavBar />
        <div className="w-full h-full pt-16  bg-gray-100 dark:bg-slate-900">
          <div className="w-full h-full flex justify-center ">
            <Carousel className="w-[70%]">
              <CarouselContent>
                <CarouselItem>1</CarouselItem>
                <CarouselItem>2</CarouselItem>
                <CarouselItem>3</CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </>
    );
  } else {
    return <LoadingPage />;
  }
};

export default Page;
