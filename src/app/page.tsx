"use server";
import Image from "next/image";
import Navbar from "../components/NavBar";
import { app } from "@/app/layout";
import { useEffect } from "react";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import { auth as useAuth } from "@clerk/nextjs/server";

const db = getFirestore(app);
// Connect to Firebase auth
const auth = getAuth(app);

export default async function Home() {
  return (
    <>
      <Navbar></Navbar>
    </>
  );
}
