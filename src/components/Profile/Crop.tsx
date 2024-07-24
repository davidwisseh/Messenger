"use client";
import React, { Dispatch, MutableRefObject } from "react";
import Cropper from "react-easy-crop";
import { useState, useCallback } from "react";
import { Check, Loader2Icon, XIcon } from "lucide-react";
import getCroppedImg, { createImage } from "./actions";
import { useUploadThing } from "@/util/uploadthing";
import { cn } from "@/lib/utils";

const Crop = ({
  image,
  setIsLoading,
  inputRef,
}: {
  image: string;
  setIsLoading: Dispatch<React.SetStateAction<string>>;
  inputRef: MutableRefObject<HTMLInputElement | undefined>;
}) => {
  const [loadingPic, setLoadingPic] = useState(false);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [cropped, setCropped] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const { startUpload } = useUploadThing("imageUploader");

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    console.log(croppedArea, croppedAreaPixels);
    setCropped(croppedAreaPixels);
  };

  function base64ToBlob(base64: string, mimeType: string) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  return (
    <>
      {loadingPic && <Loader2Icon className="animate-spin" />}
      {!loadingPic && (
        <div
          className={cn(
            "flex relative flex-col w-[80%] h-[60%] mt-24 sm:mt-40 justify-end items-center md:items-end"
          )}
        >
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1 / 1}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            cropShape="round"
            zoomSpeed={0.2}
          />
          <div
            onClick={() => {
              inputRef.current!.value = "";
              setIsLoading("");
            }}
            className="hover:scale-110 brightness-150 active:scale-90 transition absolute top-5 right-5 bg-red-700 rounded-full"
          >
            <XIcon />
          </div>
          <div
            onClick={() => {
              setLoadingPic(true);
              getCroppedImg(image, cropped).then((res) => {
                const blob = base64ToBlob(
                  res?.split(",")[1] as string,
                  "image/jpeg"
                );
                const file = new File([blob], "filename.jpeg", {
                  type: "image/jpeg",
                });
                startUpload([file]).then(() => {
                  setIsLoading("");
                  inputRef.current!.value = "";
                  setLoadingPic(false);
                });
              });
            }}
            className="brightness-110  hover:scale-110 active:scale-90 transition h-10 w-10 flex items-center justify-center bg-green-500 rounded-full mb-5 md:mr-5"
          >
            <Check />
          </div>
        </div>
      )}
    </>
  );
};

export default Crop;
