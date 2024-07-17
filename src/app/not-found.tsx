"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function notFound() {
  const router = useRouter();
  useEffect(() => {
    if (router) {
      router.push("/");
    }
  });
  return <></>;
}
