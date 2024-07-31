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
import Autoplay from "embla-carousel-autoplay";

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
  if (user.isLoaded && !user.isSignedIn) {
    return (
      <>
        <NavBar />
        <div className="w-full h-full pt-16  bg-gray-100 dark:bg-slate-900">
          <div className="w-full h-full flex justify-center ">
            <Carousel
              className="w-[70%] flex justify-center items-center h-full "
              plugins={[
                Autoplay({
                  delay: 15000,
                }),
              ]}
            >
              <CarouselContent>
                <CarouselItem className=" xs:hidden  h-[90vh] flex items-center justify-center">
                  <video
                    className="scale-90  border-t-2 border-b-2 border-black"
                    preload=""
                    autoPlay
                    playsInline
                    muted
                    loop
                  >
                    <source src="/Pvid1.mp4" type="video/mp4" />
                    <track
                      src="/path/to/captions.vtt"
                      kind="subtitles"
                      srcLang="en"
                      label="English"
                    />
                    Your browser does not support the video tag.
                  </video>{" "}
                </CarouselItem>
                <CarouselItem className="hidden xs:block">
                  <video preload="" autoPlay playsInline muted loop>
                    <source src="/vid1.mp4" type="video/mp4" />
                    <track
                      src="/path/to/captions.vtt"
                      kind="subtitles"
                      srcLang="en"
                      label="English"
                    />
                    Your browser does not support the video tag.
                  </video>{" "}
                </CarouselItem>
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
