"use server";
import { auth } from "firebase-admin";
import Navbar from "../components/NavBar";
import { useEffect, useState } from "react";
import { getFirestore } from "firebase-admin/firestore";
import { currentUser } from "@clerk/nextjs/server";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { SignedIn, SignInButton } from "@clerk/nextjs";

export default async function Home() {
  return (
    <>
      <Navbar></Navbar>
    </>
  );
}
