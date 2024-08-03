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
      <div className="h-full relative flex flex-col min-h-[570px] ">
        <NavBar />
        <div className="w-full h-full mt-16   bg-gray-100 dark:bg-slate-900">
          <div className="w-full h-full flex justify-center items-center ">
            <Carousel
              className="max-w-[70%]  xs:hidden  h-full "
              plugins={[
                Autoplay({
                  delay: 15000,
                }),
              ]}
            >
              <CarouselContent>
                <CarouselItem className="h-full  flex items-center  ">
                  <video
                    className=" max-h-full  "
                    preload=""
                    autoPlay
                    playsInline
                    muted
                    loop
                  >
                    <source src="/Mobile1.mp4" type="video/mp4" />
                    <track
                      src="/path/to/captions.vtt"
                      kind="subtitles"
                      srcLang="en"
                      label="English"
                    />
                    Your browser does not support the video tag.
                  </video>{" "}
                </CarouselItem>

                <CarouselItem className="h-full flex items-center  ">
                  <video
                    className=" max-h-full  "
                    preload=""
                    autoPlay
                    playsInline
                    muted
                    loop
                  >
                    <source src="/Mobile2.mp4" type="video/mp4" />
                    <track
                      src="/path/to/captions.vtt"
                      kind="subtitles"
                      srcLang="en"
                      label="English"
                    />
                    Your browser does not support the video tag.
                  </video>{" "}
                </CarouselItem>

                <CarouselItem className="h-full  flex items-center  ">
                  <video
                    className=" max-h-full  "
                    preload=""
                    autoPlay
                    playsInline
                    muted
                    loop
                  >
                    <source src="/Mobile3.mp4" type="video/mp4" />
                    <track
                      src="/path/to/captions.vtt"
                      kind="subtitles"
                      srcLang="en"
                      label="English"
                    />
                    Your browser does not support the video tag.
                  </video>{" "}
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
            <Carousel
              className="max-w-[70%]  hidden xs:block  h-full "
              plugins={[
                Autoplay({
                  delay: 15000,
                }),
              ]}
            >
              <CarouselContent>
                <CarouselItem className="h-full  flex items-center  ">
                  <video
                    className=" max-h-full  "
                    preload=""
                    autoPlay
                    playsInline
                    muted
                    loop
                  >
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

                <CarouselItem className="h-full flex items-center  ">
                  <video
                    className=" max-h-full  "
                    preload=""
                    autoPlay
                    playsInline
                    muted
                    loop
                  >
                    <source src="/vid2.mp4" type="video/mp4" />
                    <track
                      src="/path/to/captions.vtt"
                      kind="subtitles"
                      srcLang="en"
                      label="English"
                    />
                    Your browser does not support the video tag.
                  </video>{" "}
                </CarouselItem>

                <CarouselItem className="h-full  flex items-center  ">
                  <video
                    className=" max-h-full  "
                    preload=""
                    autoPlay
                    playsInline
                    muted
                    loop
                  >
                    <source src="/vid3.mp4" type="video/mp4" />
                    <track
                      src="/path/to/captions.vtt"
                      kind="subtitles"
                      srcLang="en"
                      label="English"
                    />
                    Your browser does not support the video tag.
                  </video>{" "}
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </div>
    );
  } else {
    return <LoadingPage />;
  }
};

export default Page;
