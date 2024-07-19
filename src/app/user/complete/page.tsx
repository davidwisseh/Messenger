"use client";

import { app } from "@/app/fb";
import DefUser from "@/components/DefUser";
import LoadingPage from "@/components/LoadingPage";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { UserName, UserObj } from "@/util/util";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { ArrowRightCircle, Loader2Icon, PencilIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const Page = ({ DUser }: { DUser?: UserObj }) => {
  const user = useUser();
  const db = getFirestore(app);
  const [dbUser, setDbUser] = useState<UserObj | undefined>(DUser);
  const router = useRouter();
  const userNameRef = useRef<HTMLInputElement>();
  const displayNameRef = useRef<HTMLInputElement>();
  const pencilRef = useRef<HTMLDivElement>();
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const handleClick = () => {
    setIsLoading(true);
    if (userNameRef.current) {
      if (!userNameRef.current.value) {
        toast({
          title: "Invalid Username",
          variant: "destructive",
        });
        setIsLoading(false);
      } else if (!displayNameRef.current) {
        toast({ title: "Invalid display name", variant: "destructive" });
        setIsLoading(false);
      } else {
        getDocs(
          query(
            collection(db, "UserNames"),
            where("name", "==", userNameRef.current.value)
          )
        ).then((snap) => {
          if (snap.size) {
            toast({
              title: "In Use",
              variant: "destructive",
            });
            setIsLoading(false);
          } else {
            const userName = {
              displayName: displayNameRef.current?.value,
              id: user.user?.id,
              image_url: user.user?.imageUrl,
              name: userNameRef.current?.value,
            } as UserName;
            fetch("/api/user/", {
              method: "POST",
              body: JSON.stringify(userName),
              headers: {
                "Content-type": "application/json",
              },
            }).then((res) => {
              if (res.status !== 200) {
                toast({
                  title: res.statusText,
                  variant: "destructive",
                });
              } else {
                router.push("/");
              }
            });
          }
        });
      }
    } else {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (!dbUser) {
      if (user.isLoaded) {
        if (!user.isSignedIn) {
          router.push("/Welcome");
        } else {
          getDoc(doc(db, "Users", user.user.id)).then((doc) => {
            setDbUser(doc.data() as UserObj);
            displayNameRef.current!.value = doc.get("displayName");
          });
        }
      }
    } else {
      displayNameRef.current!.value = dbUser.displayName;
      userNameRef.current!.value = dbUser.userName;
    }
  }, [user.isLoaded, router]);

  if (user.isSignedIn) {
    const onUser = pathname.includes("user");
    return (
      <div className="h-full w-screen min-w-80 min-h-[600px] bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center">
        {onUser && (
          <h1 className="text-3xl md:text-5xl font-bold drop-shadow-md  ">
            Complete your acount
          </h1>
        )}
        <MaxWidthWrapper
          className={cn(
            " w-[70vw] min-h-[520px] p-5  min-w-fit h-[80%] items-center  flex-col  dark:bg-gray-700/30 shadow-2xl rounded-3xl",
            { "mt-14 h-[70%]": onUser }
          )}
        >
          <div className="sm:w-40 w-32 flex flex-col sm:h-40 h-32 rounded-full mx-auto object-contain">
            <div
              onMouseEnter={() => {
                if (pencilRef.current) {
                  pencilRef.current.classList.remove("invisible");
                }
              }}
              onMouseLeave={() => {
                if (pencilRef.current) {
                  pencilRef.current.classList.add("invisible");
                }
              }}
              onClick={() => {
                pencilRef.current?.classList.toggle("invisible");
              }}
              className="flex flex-col"
            >
              <img
                className="rounded-full ring-offset-2 ring  ring-black"
                src={onUser ? user.user.imageUrl : dbUser?.img_url}
                alt=""
              />
              <div
                //@ts-ignore
                ref={pencilRef}
                className=" rounded-full relative outline outline-1 invisible  transition ml-auto mr-1 h-5 w-5  -mt-3 sm:-mt-5 flex items-center justify-center"
              >
                <input
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  accept="image/jpeg,image/jpg,image/png"
                  onSubmit={(e) => {
                    console.log(e);
                  }}
                  type="file"
                  className="h-full hover:cursor-pointer opacity-0  absolute w-full"
                />
                <PencilIcon className="   h-4 w-4 "></PencilIcon>
              </div>
            </div>
          </div>

          <div className=" mt-20 md:mt-32 max-w-full -ml-1 sm:text-2xl  lg:text-3xl text-nowrap capitalize flex flex-col md:flex-row">
            <p className="mx-auto">User Name:</p>
            <span className="w-full ml-2  h-full">
              <span className="mr-1">@</span>

              <input
                //@ts-ignore
                ref={userNameRef}
                type="text"
                className=" md:ml-1 mt-2 md:mt-0 caret-black  border-b-4 focus:outline-none border-black bg-transparent  "
              />
            </span>
          </div>
          <div className="mt-8 max-w-full sm:text-2xl  lg:text-3xl text-nowrap capitalize flex flex-col md:flex-row">
            <p className="mx-auto pr-1">Display Name:</p>
            <span className="w-full ml-1 md:ml-0 h-full">
              <span className="mr-1 invisible md:hidden">@</span>
              <input
                type="text"
                className="  md:ml-1 mt-2 md:mt-0 caret-black  border-b-4 focus:outline-none border-black bg-transparent  "
                //@ts-ignore
                ref={displayNameRef}
              />
            </span>
          </div>

          <div
            className={cn(
              " flex  mt-4 md:mt-7",
              isLoading ? "pointer-events-none" : "",
              { hidden: !onUser }
            )}
          >
            <ArrowRightCircle
              onClick={() => {
                handleClick();
              }}
              className=" transition  active:scale-100 hover:cursor-pointer hover:animate-pulse text-black h-10 w-10 md:h-14 md:w-14 hover:scale-110  rounded-full"
            ></ArrowRightCircle>
          </div>
        </MaxWidthWrapper>
      </div>
    );
  }
  return <LoadingPage />;
};
export default Page;
