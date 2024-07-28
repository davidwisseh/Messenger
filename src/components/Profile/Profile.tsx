import { UploadButton, UserName, UserObj } from "@/util/util";
import Cropper from "react-easy-crop";
import MaxWidthWrapper from "../MaxWidthWrapper";
import { useUser } from "@clerk/nextjs";
import {
  and,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { app } from "@/app/fb";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "../ui/use-toast";
import { cn } from "@/lib/utils";
import { ArrowRightCircle, Check, Loader2Icon, PencilIcon } from "lucide-react";
import LoadingPage from "../LoadingPage";
import DefUser from "../DefUser";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Crop from "./Crop";
import getCroppedImage from "./actions";

const Profile = ({ DUser }: { DUser?: UserObj }) => {
  const user = useUser();
  const db = getFirestore(app);
  const [dbUser, setDbUser] = useState<UserObj | undefined>(DUser);
  const router = useRouter();
  const userNameRef = useRef<HTMLInputElement>();
  const displayNameRef = useRef<HTMLInputElement>();
  const pencilRef = useRef<HTMLDivElement>();
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const [imgFileUrl, setImgFileUrl] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>();

  const handleClick = () => {
    setIsLoading(true);
    if (userNameRef.current) {
      if (!userNameRef.current.value) {
        toast({
          title: "Invalid Username",
          variant: "destructive",
          duration: 3000,
        });
        setIsLoading(false);
      } else if (!displayNameRef.current!.value) {
        toast({
          title: "Invalid display name",
          variant: "destructive",
          duration: 3000,
        });
        setIsLoading(false);
      } else {
        getDocs(
          query(
            collection(db, "UserNames"),
            where("name", "==", userNameRef.current.value),
            where("id", "!=", dbUser?.id)
          )
        ).then((snap) => {
          if (snap.size) {
            toast({
              title: "In Use",
              variant: "destructive",
              duration: 3000,
            });
            setIsLoading(false);
          } else {
            const userName = {
              displayName: displayNameRef.current?.value,
              id: user.user?.id,
              image_url: dbUser?.img_url,
              name: userNameRef.current?.value,
            } as UserName;
            fetch("/api/user", {
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
                  duration: 3000,
                });
              } else {
                if (pathname.includes("user")) {
                  router!.push("/");
                } else {
                  toast({
                    title: "success",
                    variant: "default",
                    duration: 3000,
                  });
                  setIsLoading(false);
                }
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
          router!.push("/Welcome");
        } else {
          const unsub = onSnapshot(doc(db, "Users", user.user.id), (doc) => {
            setDbUser(doc.data() as UserObj);
            if (displayNameRef.current) {
              displayNameRef.current.value = doc.get("displayName");
            }
          });

          return () => {
            unsub();
          };
        }
      }
    } else {
      if (displayNameRef.current && userNameRef.current) {
        displayNameRef.current!.value = dbUser.displayName;
        userNameRef.current!.value = dbUser.userName;
      }
    }
  }, [user.isLoaded, router]);
  useEffect(() => {
    setDbUser(DUser);
  }, [DUser]);

  if (user.isSignedIn) {
    const onUser = pathname.includes("user");
    return (
      <>
        {!dbUser && <LoadingPage />}
        <div
          className={cn(
            "h-full  w-screen min-w-80 min-h-[600px] bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center",
            { hidden: !dbUser }
          )}
        >
          {onUser && (
            <h1 className="text-3xl md:text-5xl font-bold drop-shadow-md  ">
              Complete your acount
            </h1>
          )}

          <MaxWidthWrapper
            className={cn(
              " w-[70vw] relative overflow-hidden min-h-[520px] p-5  min-w-fit h-[80%] items-center  flex-col  dark:bg-gray-700/30 shadow-2xl rounded-3xl",
              { "mt-14 h-[70%]": onUser }
            )}
          >
            <div
              className={cn(
                "absolute w-full -mt-5 h-full flex items-center justify-center bg-black/50",
                { hidden: !isLoading }
              )}
            >
              <Loader2Icon className="animate-spin" />
            </div>
            <div
              className={cn(
                "absolute w-full h-full   -mt-5  bg-black/50 hidden items-center justify-center rounded-3xl overflow-hidden",
                { flex: imgFileUrl }
              )}
            >
              <Crop
                inputRef={fileRef}
                setIsLoading={setImgFileUrl}
                image={imgFileUrl}
              />
            </div>
            <div className="sm:w-40 w-32 sm:h-40 h-32 flex flex-col  rounded-full mx-auto object-contain">
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
                <Avatar
                  className={cn({ "brightness-50": imgFileUrl || isLoading })}
                >
                  <AvatarImage className="w-full" src={dbUser?.img_url} />
                  <AvatarFallback>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      className="bi bi-person-circle"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                      <path
                        fillRule="evenodd"
                        d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                      />
                    </svg>
                  </AvatarFallback>
                </Avatar>

                <div
                  //@ts-ignore
                  ref={pencilRef}
                  className=" rounded-full overflow-hidden relative outline outline-1 invisible transition ml-auto mr-1 h-5 w-5  -mt-3 sm:-mt-5 flex items-center justify-center"
                >
                  <PencilIcon className=" absolute z-0 h-4 w-4 "></PencilIcon>
                  {/* <UploadButton
                  onUploadBegin={() => {
                    pencilRef.current?.classList.add("pointer-events-none");
                    pencilRef.current?.classList.add("cursor-wait");
                    }}
                    onUploadProgress={(val) => {}}
                    className="opacity-0"
                    endpoint="imageUploader"
                    ></UploadButton> */}
                  <input
                    //@ts-ignore
                    ref={fileRef}
                    accept="image/jpeg,image/jpg,image/png"
                    type="file"
                    className="h-full hover:cursor-pointer opacity-0  absolute w-full"
                    onChange={(e) => {
                      const image = e.target.files![0];
                      setImgFileUrl(URL.createObjectURL(image));
                    }}
                  />
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
                isLoading ? "pointer-events-none" : ""
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
      </>
    );
  }
  return <LoadingPage />;
};

export default Profile;
